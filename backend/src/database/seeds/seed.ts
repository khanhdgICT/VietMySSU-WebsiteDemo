import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User, UserStatus } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../roles/entities/permission.entity';
import { Category, CategoryType } from '../../categories/entities/category.entity';
import { Post, PostStatus } from '../../posts/entities/post.entity';
import { Job, JobStatus, JobType } from '../../jobs/entities/job.entity';
import { MenuItem, MenuLocation } from '../../menu/entities/menu-item.entity';
import { AuditLog } from '../../audit/entities/audit-log.entity';
import { JobApplication } from '../../jobs/entities/job-application.entity';
import { ContactSubmission } from '../../contact/entities/contact-submission.entity';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

const AppDataSource = new DataSource(
  dbUrl
    ? {
        type: 'postgres',
        url: dbUrl,
        ssl: { rejectUnauthorized: false },
        entities: [User, Role, Permission, Category, Post, Job, MenuItem, AuditLog, JobApplication, ContactSubmission],
        synchronize: true,
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'vietmy_callcenter',
        entities: [User, Role, Permission, Category, Post, Job, MenuItem, AuditLog, JobApplication, ContactSubmission],
        synchronize: true,
      },
);

async function seed() {
  await AppDataSource.initialize();
  console.log('📦 Database connected. Starting seed...\n');

  // === PERMISSIONS ===
  const permissionRepo = AppDataSource.getRepository(Permission);
  const resources = ['posts', 'jobs', 'users', 'roles', 'categories', 'contact', 'menu', 'audit', 'analytics'];
  const actions = ['create', 'read', 'update', 'delete'];

  const permissions: Permission[] = [];
  for (const resource of resources) {
    for (const action of actions) {
      const existing = await permissionRepo.findOne({ where: { name: `${resource}:${action}` } });
      if (!existing) {
        const p = permissionRepo.create({
          name: `${resource}:${action}`,
          resource,
          action,
          description: `${action} ${resource}`,
        });
        permissions.push(await permissionRepo.save(p));
      } else {
        permissions.push(existing);
      }
    }
  }
  console.log(`✅ ${permissions.length} permissions created`);

  // === ROLES ===
  const roleRepo = AppDataSource.getRepository(Role);

  let superAdminRole = await roleRepo.findOne({ where: { name: 'super_admin' }, relations: ['permissions'] });
  if (!superAdminRole) {
    superAdminRole = roleRepo.create({
      name: 'super_admin',
      description: 'Super Administrator with all permissions',
      permissions,
    });
    await roleRepo.save(superAdminRole);
  }

  let editorRole = await roleRepo.findOne({ where: { name: 'editor' }, relations: ['permissions'] });
  if (!editorRole) {
    const editorPerms = permissions.filter((p) =>
      ['posts:create', 'posts:read', 'posts:update', 'jobs:read', 'categories:read'].includes(p.name),
    );
    editorRole = roleRepo.create({
      name: 'editor',
      description: 'Content Editor',
      permissions: editorPerms,
    });
    await roleRepo.save(editorRole);
  }
  console.log('✅ Roles created');

  // === USERS ===
  const userRepo = AppDataSource.getRepository(User);

  const adminExists = await userRepo.findOne({ where: { email: 'admin@vietmy.com' } });
  if (!adminExists) {
    const admin = userRepo.create({
      fullName: 'Super Admin',
      email: 'admin@vietmy.com',
      password: 'Admin@123',
      status: UserStatus.ACTIVE,
      role: superAdminRole,
    });
    await userRepo.save(admin);
    console.log('✅ Admin user created: admin@vietmy.com / Admin@123');
  }

  const editorExists = await userRepo.findOne({ where: { email: 'editor@vietmy.com' } });
  if (!editorExists) {
    const editor = userRepo.create({
      fullName: 'Content Editor',
      email: 'editor@vietmy.com',
      password: 'Editor@123',
      status: UserStatus.ACTIVE,
      role: editorRole,
    });
    await userRepo.save(editor);
    console.log('✅ Editor user created: editor@vietmy.com / Editor@123');
  }

  // === CATEGORIES ===
  const categoryRepo = AppDataSource.getRepository(Category);
  const categoriesData = [
    { name: 'Tin tức ngành', slug: 'tin-tuc-nganh', type: CategoryType.NEWS },
    { name: 'Tin tức mới', slug: 'tin-tuc-moi', type: CategoryType.NEWS },
    { name: 'Dịch vụ Call Center', slug: 'dich-vu-call-center', type: CategoryType.SERVICE },
    { name: 'Dịch vụ BPO', slug: 'dich-vu-bpo', type: CategoryType.SERVICE },
  ];
  const categories: Category[] = [];
  for (const data of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { slug: data.slug } });
    if (!cat) {
      cat = await categoryRepo.save(categoryRepo.create(data));
    }
    categories.push(cat);
  }
  console.log('✅ Categories created');

  // === POSTS ===
  const postRepo = AppDataSource.getRepository(Post);
  const admin = await userRepo.findOne({ where: { email: 'admin@vietmy.com' }, relations: ['role'] });
  const postsData = [
    {
      title: 'Xu hướng Call Center 2024: AI và Automation',
      titleEn: 'Call Center Trends 2024: AI and Automation',
      slug: 'xu-huong-call-center-2024',
      excerpt: 'Tìm hiểu về các xu hướng công nghệ mới nhất đang định hình ngành Call Center trong năm 2024.',
      excerptEn: 'Explore the latest technology trends shaping the Call Center industry in 2024.',
      content: '<h2>Xu hướng AI trong Call Center</h2><p>Trí tuệ nhân tạo đang cách mạng hóa cách các trung tâm cuộc gọi hoạt động...</p>',
      contentEn: '<h2>AI Trends in Call Centers</h2><p>Artificial intelligence is revolutionizing how call centers operate...</p>',
      status: PostStatus.PUBLISHED,
      isFeatured: true,
      publishedAt: new Date(),
      category: categories[0],
      author: admin,
    },
    {
      title: 'VietMy SSU ra mắt dịch vụ Call Center thế hệ mới',
      titleEn: 'VietMy SSU launches next-gen Call Center services',
      slug: 'vietmy-ssu-ra-mat-dich-vu-moi',
      excerpt: 'VietMy SSU chính thức giới thiệu nền tảng Call Center thế hệ mới với công nghệ AI tiên tiến.',
      excerptEn: 'VietMy SSU officially introduces next-generation Call Center platform with advanced AI technology.',
      content: '<p>Chúng tôi tự hào giới thiệu giải pháp Call Center toàn diện...</p>',
      contentEn: '<p>We are proud to introduce our comprehensive Call Center solution...</p>',
      status: PostStatus.PUBLISHED,
      isFeatured: false,
      publishedAt: new Date(),
      category: categories[1],
      author: admin,
    },
  ];

  for (const data of postsData) {
    const exists = await postRepo.findOne({ where: { slug: data.slug } });
    if (!exists) await postRepo.save(postRepo.create(data));
  }
  console.log('✅ Posts created');

  // === JOBS ===
  const jobRepo = AppDataSource.getRepository(Job);
  const jobsData = [
    {
      title: 'Nhân viên Tư vấn Khách hàng (Call Center Agent)',
      titleEn: 'Customer Service Agent (Call Center)',
      slug: 'nhan-vien-tu-van-khach-hang',
      location: 'Hà Nội',
      salary: '8,000,000 - 12,000,000 VNĐ',
      jobType: JobType.FULL_TIME,
      description: '<p>Chúng tôi đang tìm kiếm nhân viên tư vấn khách hàng nhiệt tình...</p>',
      descriptionEn: '<p>We are looking for enthusiastic customer service agents...</p>',
      requirements: '<ul><li>Tốt nghiệp THPT trở lên</li><li>Kỹ năng giao tiếp tốt</li><li>Có kinh nghiệm ưu tiên</li></ul>',
      status: JobStatus.OPEN,
      isFeatured: true,
      quantity: 10,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Trưởng nhóm Call Center (Team Leader)',
      titleEn: 'Call Center Team Leader',
      slug: 'truong-nhom-call-center',
      location: 'TP. Hồ Chí Minh',
      salary: '15,000,000 - 20,000,000 VNĐ',
      jobType: JobType.FULL_TIME,
      description: '<p>Vị trí Trưởng nhóm Call Center với trách nhiệm quản lý đội nhóm...</p>',
      descriptionEn: '<p>Call Center Team Leader position with team management responsibilities...</p>',
      requirements: '<ul><li>Tốt nghiệp Đại học</li><li>Ít nhất 2 năm kinh nghiệm</li><li>Kỹ năng lãnh đạo tốt</li></ul>',
      status: JobStatus.OPEN,
      isFeatured: true,
      quantity: 3,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Kỹ sư Hệ thống Call Center',
      titleEn: 'Call Center System Engineer',
      slug: 'ky-su-he-thong-call-center',
      location: 'Đà Nẵng',
      salary: '18,000,000 - 25,000,000 VNĐ',
      jobType: JobType.FULL_TIME,
      description: '<p>Phát triển và duy trì hệ thống Call Center...</p>',
      descriptionEn: '<p>Develop and maintain Call Center systems...</p>',
      requirements: '<ul><li>Tốt nghiệp CNTT</li><li>Kinh nghiệm với VoIP/Asterisk</li></ul>',
      status: JobStatus.OPEN,
      isFeatured: false,
      quantity: 2,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const data of jobsData) {
    const exists = await jobRepo.findOne({ where: { slug: data.slug } });
    if (!exists) await jobRepo.save(jobRepo.create(data));
  }
  console.log('✅ Jobs created');

  // === MENU ITEMS ===
  const menuRepo = AppDataSource.getRepository(MenuItem);
  const headerMenuData = [
    { label: 'Trang chủ', labelEn: 'Home', url: '/', sortOrder: 1, location: MenuLocation.HEADER },
    { label: 'Giới thiệu', labelEn: 'About Us', url: '/about', sortOrder: 2, location: MenuLocation.HEADER },
    { label: 'Dịch vụ', labelEn: 'Services', url: '/services', sortOrder: 3, location: MenuLocation.HEADER },
    { label: 'Tin tức', labelEn: 'News', url: '/news', sortOrder: 4, location: MenuLocation.HEADER },
    { label: 'Tuyển dụng', labelEn: 'Careers', url: '/jobs', sortOrder: 5, location: MenuLocation.HEADER },
    { label: 'Liên hệ', labelEn: 'Contact', url: '/contact', sortOrder: 6, location: MenuLocation.HEADER },
  ];

  for (const data of headerMenuData) {
    const exists = await menuRepo.findOne({ where: { label: data.label, location: data.location } });
    if (!exists) await menuRepo.save(menuRepo.create(data));
  }

  // Service sub-menu
  const servicesMenu = await menuRepo.findOne({ where: { label: 'Dịch vụ', location: MenuLocation.HEADER } });
  if (servicesMenu) {
    const subMenus = [
      { label: 'Call Center Inbound', labelEn: 'Inbound Call Center', url: '/services/inbound', sortOrder: 1, location: MenuLocation.HEADER, parent: servicesMenu },
      { label: 'Call Center Outbound', labelEn: 'Outbound Call Center', url: '/services/outbound', sortOrder: 2, location: MenuLocation.HEADER, parent: servicesMenu },
      { label: 'Dịch vụ BPO', labelEn: 'BPO Services', url: '/services/bpo', sortOrder: 3, location: MenuLocation.HEADER, parent: servicesMenu },
      { label: 'Giải pháp AI', labelEn: 'AI Solutions', url: '/services/ai', sortOrder: 4, location: MenuLocation.HEADER, parent: servicesMenu },
    ];
    for (const sub of subMenus) {
      const exists = await menuRepo.findOne({ where: { label: sub.label, location: sub.location } });
      if (!exists) await menuRepo.save(menuRepo.create(sub));
    }
  }
  console.log('✅ Menu items created');

  await AppDataSource.destroy();
  console.log('\n🎉 Seed completed successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
