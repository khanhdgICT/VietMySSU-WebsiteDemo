import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

const METHOD_TO_ACTION: Record<string, string> = {
  POST: 'CREATE',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
  DELETE: 'DELETE',
};

// Sub-path segments that are not resource IDs
const NON_ID_SEGMENTS = new Set([
  'applications', 'status', 'permissions', 'stats',
  'verify', 'setup', 'enable', 'disable', 'refresh',
  'dashboard', 'chart', 'activity',
]);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;

    const action = METHOD_TO_ACTION[method];
    if (!action) return next.handle();

    // Only intercept /admin/ routes, skip auth endpoints
    if (!url.includes('/admin/') || url.includes('/auth/')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const user = req.user;
          const resource = this.extractResource(url);
          const resourceId = this.extractResourceId(url) ?? responseData?.id ?? null;

          this.auditService
            .log({
              userId: user?.id ?? null,
              action,
              resource,
              resourceId: resourceId ? String(resourceId) : null,
              newData: action !== 'DELETE' ? this.sanitize(responseData) : null,
              ipAddress: this.resolveIp(req),
              userAgent: req.headers?.['user-agent'] ?? null,
              description: this.buildDescription(action, resource, resourceId, user),
            })
            .catch(() => {
              // Never let audit logging break the response
            });
        },
        // On error: don't log — the operation failed
      }),
    );
  }

  // /api/v1/admin/posts/uuid  → "posts"
  // /api/v1/admin/audit-logs  → "audit-logs"
  private extractResource(url: string): string {
    const match = url.match(/\/admin\/([^/?]+)/);
    return match ? match[1] : 'unknown';
  }

  // /api/v1/admin/posts/uuid       → "uuid"
  // /api/v1/admin/posts            → null
  // /api/v1/admin/jobs/applications → null  (sub-path, not an ID)
  private extractResourceId(url: string): string | null {
    const match = url.match(/\/admin\/[^/]+\/([^/?]+)/);
    if (!match) return null;
    const segment = match[1];
    return NON_ID_SEGMENTS.has(segment) ? null : segment;
  }

  // Strip sensitive fields before storing in JSONB
  private sanitize(data: any): any {
    if (!data || typeof data !== 'object') return data;
    const {
      password, passwordHash, refreshToken, twoFactorSecret,
      // Strip large HTML content fields to keep the log compact
      content, contentEn, description, descriptionEn,
      requirements, requirementsEn, benefits, benefitsEn,
      ...rest
    } = data as Record<string, any>;
    return rest;
  }

  private resolveIp(req: any): string | null {
    const forwarded = req.headers?.['x-forwarded-for'];
    if (forwarded) return (forwarded as string).split(',')[0].trim();
    return req.ip ?? null;
  }

  private buildDescription(
    action: string,
    resource: string,
    resourceId: string | null,
    user: any,
  ): string {
    const who = user?.email ?? user?.id ?? 'unknown';
    const what = resourceId ? `${resource}/${resourceId}` : resource;
    const verb = action === 'CREATE' ? 'created' : action === 'UPDATE' ? 'updated' : 'deleted';
    return `${who} ${verb} ${what}`;
  }
}
