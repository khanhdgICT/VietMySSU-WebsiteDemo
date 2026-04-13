'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import {
  LayoutDashboard, FileText, Briefcase, Users, Shield, MessageSquare,
  Navigation, BarChart2, ClipboardList, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { isAuthenticated, getUser, clearAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import 'react-toastify/dist/ReactToastify.css';
import '../globals.css';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Tin tức', href: '/admin/posts', icon: FileText },
  { label: 'Tuyển dụng', href: '/admin/jobs', icon: Briefcase },
  { label: 'Người dùng', href: '/admin/users', icon: Users },
  { label: 'Roles & Quyền', href: '/admin/roles', icon: Shield },
  { label: 'Liên hệ', href: '/admin/contact', icon: MessageSquare },
  { label: 'Quản lý Menu', href: '/admin/menu', icon: Navigation },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    setUser(getUser());
  }, [pathname]);

  if (pathname === '/admin/login') {
    return (
      <>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  const handleLogout = async () => {
    try { await authApi.logout(); } catch {}
    clearAuth();
    router.push('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'} flex flex-col shrink-0 z-40 transition-all duration-300`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black">V</span>
          </div>
          {sidebarOpen && (
            <div>
              <div className="font-bold text-white text-sm">VietMy SSU</div>
              <div className="text-gray-400 text-xs">Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 mx-2 px-3 py-3 rounded-xl transition-all duration-200 group mb-1 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {isActive && <ChevronRight size={14} />}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-white/10 p-4">
          {user && sidebarOpen && (
            <div className="mb-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user.fullName?.[0] || 'A'}
              </div>
              <div className="overflow-hidden">
                <div className="text-white text-sm font-semibold truncate">{user.fullName}</div>
                <div className="text-gray-400 text-xs truncate">{user.role?.name}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && 'Đăng xuất'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem trang web →
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
