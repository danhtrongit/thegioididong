import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu...');

  // ==================== USERS ====================
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const staffPassword = await bcrypt.hash('Staff@123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@didong.local' },
    update: {},
    create: {
      email: 'admin@didong.local',
      passwordHash: adminPassword,
      fullName: 'Quản trị viên',
      phone: '0901000001',
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@didong.local' },
    update: {},
    create: {
      email: 'staff@didong.local',
      passwordHash: staffPassword,
      fullName: 'Nhân viên',
      phone: '0901000002',
      role: 'STAFF',
    },
  });

  console.log('✅ Tạo tài khoản admin & staff');

  // ==================== MEDIA FOLDERS ====================
  const folders = [
    { name: 'Sản phẩm', slug: 'san-pham', sortOrder: 1 },
    { name: 'Thương hiệu', slug: 'thuong-hieu', sortOrder: 2 },
    { name: 'Bài viết', slug: 'bai-viet', sortOrder: 3 },
    { name: 'Trang', slug: 'trang', sortOrder: 4 },
    { name: 'Banner', slug: 'banner', sortOrder: 5 },
  ];

  for (const f of folders) {
    await prisma.mediaFolder.upsert({
      where: { slug: f.slug },
      update: {},
      create: f,
    });
  }
  console.log('✅ Tạo thư mục media');

  // ==================== CATEGORIES ====================
  const phonesCat = await prisma.category.upsert({
    where: { slug: 'dien-thoai' },
    update: {},
    create: { name: 'Điện thoại', slug: 'dien-thoai', sortOrder: 1, seoTitle: 'Điện thoại chính hãng giá tốt', seoDescription: 'Mua điện thoại chính hãng, giá rẻ. Bảo hành chính hãng.' },
  });

  const laptopCat = await prisma.category.upsert({
    where: { slug: 'laptop' },
    update: {},
    create: { name: 'Laptop', slug: 'laptop', sortOrder: 2, seoTitle: 'Laptop chính hãng', seoDescription: 'Mua laptop chính hãng giá tốt nhất.' },
  });

  const tabletCat = await prisma.category.upsert({
    where: { slug: 'tablet' },
    update: {},
    create: { name: 'Tablet', slug: 'tablet', sortOrder: 3 },
  });

  const accessoryCat = await prisma.category.upsert({
    where: { slug: 'phu-kien' },
    update: {},
    create: { name: 'Phụ kiện', slug: 'phu-kien', sortOrder: 4 },
  });

  console.log('✅ Tạo danh mục');

  // ==================== BRANDS ====================
  const apple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: { name: 'Apple', slug: 'apple', description: 'Thương hiệu công nghệ hàng đầu thế giới' },
  });

  const samsung = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: { name: 'Samsung', slug: 'samsung', description: 'Tập đoàn điện tử Hàn Quốc' },
  });

  const xiaomi = await prisma.brand.upsert({
    where: { slug: 'xiaomi' },
    update: {},
    create: { name: 'Xiaomi', slug: 'xiaomi', description: 'Thương hiệu điện thoại Trung Quốc' },
  });

  const dell = await prisma.brand.upsert({
    where: { slug: 'dell' },
    update: {},
    create: { name: 'Dell', slug: 'dell', description: 'Hãng laptop nổi tiếng' },
  });

  const asus = await prisma.brand.upsert({
    where: { slug: 'asus' },
    update: {},
    create: { name: 'ASUS', slug: 'asus', description: 'Hãng laptop và linh kiện đến từ Đài Loan' },
  });

  console.log('✅ Tạo thương hiệu');

  // ==================== SPECIFICATION DEFINITIONS ====================
  const phoneSpecs = [
    { groupName: 'Màn hình', name: 'Kích thước màn hình', valueType: 'TEXT' as const, unit: 'inch', isFilterable: true, isComparable: true, isHighlighted: true, sortOrder: 1 },
    { groupName: 'Màn hình', name: 'Công nghệ màn hình', valueType: 'TEXT' as const, isComparable: true, sortOrder: 2 },
    { groupName: 'Màn hình', name: 'Tần số quét', valueType: 'TEXT' as const, isFilterable: true, isComparable: true, sortOrder: 3 },
    { groupName: 'Hiệu năng', name: 'Chip xử lý', valueType: 'TEXT' as const, isFilterable: true, isComparable: true, isHighlighted: true, sortOrder: 4 },
    { groupName: 'Hiệu năng', name: 'RAM', valueType: 'TEXT' as const, isFilterable: true, isComparable: true, isHighlighted: true, sortOrder: 5 },
    { groupName: 'Hiệu năng', name: 'Bộ nhớ trong', valueType: 'TEXT' as const, isFilterable: true, isComparable: true, isHighlighted: true, sortOrder: 6 },
    { groupName: 'Camera', name: 'Camera sau', valueType: 'TEXT' as const, isComparable: true, isHighlighted: true, sortOrder: 7 },
    { groupName: 'Camera', name: 'Camera trước', valueType: 'TEXT' as const, isComparable: true, sortOrder: 8 },
    { groupName: 'Pin', name: 'Dung lượng pin', valueType: 'TEXT' as const, isComparable: true, isHighlighted: true, sortOrder: 9 },
    { groupName: 'Pin', name: 'Sạc nhanh', valueType: 'TEXT' as const, isComparable: true, sortOrder: 10 },
    { groupName: 'Thiết kế', name: 'Chất liệu', valueType: 'TEXT' as const, sortOrder: 11 },
    { groupName: 'Thiết kế', name: 'Trọng lượng', valueType: 'TEXT' as const, isComparable: true, sortOrder: 12 },
  ];

  const createdPhoneSpecs: any[] = [];
  for (const spec of phoneSpecs) {
    const created = await prisma.specificationDefinition.create({
      data: { categoryId: phonesCat.id, ...spec },
    });
    createdPhoneSpecs.push(created);
  }

  console.log('✅ Tạo thông số kỹ thuật');

  // ==================== PRODUCTS ====================
  // iPhone 16 Pro Max
  const iphone16 = await prisma.product.upsert({
    where: { slug: 'iphone-16-pro-max' },
    update: {},
    create: {
      categoryId: phonesCat.id,
      brandId: apple.id,
      name: 'iPhone 16 Pro Max',
      slug: 'iphone-16-pro-max',
      shortDescription: 'iPhone 16 Pro Max - Chip A18 Pro, camera 48MP, pin lớn',
      description: '# iPhone 16 Pro Max\n\nĐiện thoại flagship mới nhất của Apple với chip A18 Pro mạnh mẽ.',
      seoTitle: 'iPhone 16 Pro Max - Giá tốt, chính hãng',
      status: 'PUBLISHED',
    },
  });

  // Samsung Galaxy S24 Ultra
  const galaxyS24 = await prisma.product.upsert({
    where: { slug: 'samsung-galaxy-s24-ultra' },
    update: {},
    create: {
      categoryId: phonesCat.id,
      brandId: samsung.id,
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      shortDescription: 'Galaxy S24 Ultra - Galaxy AI, S Pen, camera 200MP',
      description: '# Samsung Galaxy S24 Ultra\n\nSmartphone cao cấp nhất của Samsung với Galaxy AI.',
      seoTitle: 'Samsung Galaxy S24 Ultra - Chính hãng',
      status: 'PUBLISHED',
    },
  });

  // Xiaomi 14 Ultra
  const xiaomi14 = await prisma.product.upsert({
    where: { slug: 'xiaomi-14-ultra' },
    update: {},
    create: {
      categoryId: phonesCat.id,
      brandId: xiaomi.id,
      name: 'Xiaomi 14 Ultra',
      slug: 'xiaomi-14-ultra',
      shortDescription: 'Xiaomi 14 Ultra - Leica camera, Snapdragon 8 Gen 3',
      status: 'PUBLISHED',
    },
  });

  // MacBook Pro M4
  const macbook = await prisma.product.upsert({
    where: { slug: 'macbook-pro-m4-14-inch' },
    update: {},
    create: {
      categoryId: laptopCat.id,
      brandId: apple.id,
      name: 'MacBook Pro M4 14 inch',
      slug: 'macbook-pro-m4-14-inch',
      shortDescription: 'MacBook Pro chip M4 - Hiệu năng vượt trội',
      status: 'PUBLISHED',
    },
  });

  // Dell XPS 15
  const dellXps = await prisma.product.upsert({
    where: { slug: 'dell-xps-15-2024' },
    update: {},
    create: {
      categoryId: laptopCat.id,
      brandId: dell.id,
      name: 'Dell XPS 15 2024',
      slug: 'dell-xps-15-2024',
      shortDescription: 'Dell XPS 15 - Laptop cao cấp doanh nhân',
      status: 'PUBLISHED',
    },
  });

  // ASUS ROG
  const asusRog = await prisma.product.upsert({
    where: { slug: 'asus-rog-strix-g16' },
    update: {},
    create: {
      categoryId: laptopCat.id,
      brandId: asus.id,
      name: 'ASUS ROG Strix G16',
      slug: 'asus-rog-strix-g16',
      shortDescription: 'Laptop gaming ASUS ROG Strix G16',
      status: 'PUBLISHED',
    },
  });

  console.log('✅ Tạo sản phẩm');

  // ==================== SKUs ====================
  // iPhone 16 Pro Max SKUs
  await prisma.sKU.upsert({
    where: { skuCode: 'IP16PM-256-TITAN-DEN' },
    update: {},
    create: {
      productId: iphone16.id, skuCode: 'IP16PM-256-TITAN-DEN',
      name: 'iPhone 16 Pro Max 256GB Titan Đen', price: 34990000, oldPrice: 36990000,
      stockQuantity: 50, isDefault: true,
      variantAttributes: { createMany: { data: [
        { name: 'storage', value: '256GB' },
        { name: 'color', value: 'Titan Đen' },
      ] } },
    },
  });

  await prisma.sKU.upsert({
    where: { skuCode: 'IP16PM-512-TITAN-TRANG' },
    update: {},
    create: {
      productId: iphone16.id, skuCode: 'IP16PM-512-TITAN-TRANG',
      name: 'iPhone 16 Pro Max 512GB Titan Trắng', price: 40990000, oldPrice: 42990000,
      stockQuantity: 30,
      variantAttributes: { createMany: { data: [
        { name: 'storage', value: '512GB' },
        { name: 'color', value: 'Titan Trắng' },
      ] } },
    },
  });

  await prisma.sKU.upsert({
    where: { skuCode: 'IP16PM-1TB-TITAN-XANH' },
    update: {},
    create: {
      productId: iphone16.id, skuCode: 'IP16PM-1TB-TITAN-XANH',
      name: 'iPhone 16 Pro Max 1TB Titan Xanh', price: 46990000,
      stockQuantity: 15,
      variantAttributes: { createMany: { data: [
        { name: 'storage', value: '1TB' },
        { name: 'color', value: 'Titan Xanh' },
      ] } },
    },
  });

  // Samsung Galaxy S24 Ultra SKUs
  await prisma.sKU.upsert({
    where: { skuCode: 'SS-S24U-256-DEN' },
    update: {},
    create: {
      productId: galaxyS24.id, skuCode: 'SS-S24U-256-DEN',
      name: 'Galaxy S24 Ultra 256GB Đen', price: 29990000, oldPrice: 33990000,
      stockQuantity: 40, isDefault: true,
      variantAttributes: { createMany: { data: [
        { name: 'storage', value: '256GB' },
        { name: 'color', value: 'Đen' },
      ] } },
    },
  });

  await prisma.sKU.upsert({
    where: { skuCode: 'SS-S24U-512-XAM' },
    update: {},
    create: {
      productId: galaxyS24.id, skuCode: 'SS-S24U-512-XAM',
      name: 'Galaxy S24 Ultra 512GB Xám', price: 33990000,
      stockQuantity: 25,
      variantAttributes: { createMany: { data: [
        { name: 'storage', value: '512GB' },
        { name: 'color', value: 'Xám' },
      ] } },
    },
  });

  // Xiaomi 14 Ultra SKU
  await prisma.sKU.upsert({
    where: { skuCode: 'XM-14U-512-DEN' },
    update: {},
    create: {
      productId: xiaomi14.id, skuCode: 'XM-14U-512-DEN',
      name: 'Xiaomi 14 Ultra 512GB Đen', price: 23990000,
      stockQuantity: 20, isDefault: true,
      variantAttributes: { createMany: { data: [
        { name: 'storage', value: '512GB' },
        { name: 'color', value: 'Đen' },
      ] } },
    },
  });

  // MacBook Pro M4 SKU
  await prisma.sKU.upsert({
    where: { skuCode: 'MBP-M4-16-512' },
    update: {},
    create: {
      productId: macbook.id, skuCode: 'MBP-M4-16-512',
      name: 'MacBook Pro M4 16GB/512GB', price: 44990000,
      stockQuantity: 20, isDefault: true,
      variantAttributes: { createMany: { data: [
        { name: 'ram', value: '16GB' },
        { name: 'storage', value: '512GB' },
      ] } },
    },
  });

  // Dell XPS 15 SKU
  await prisma.sKU.upsert({
    where: { skuCode: 'DELL-XPS15-16-512' },
    update: {},
    create: {
      productId: dellXps.id, skuCode: 'DELL-XPS15-16-512',
      name: 'Dell XPS 15 16GB/512GB', price: 39990000,
      stockQuantity: 15, isDefault: true,
      variantAttributes: { createMany: { data: [
        { name: 'ram', value: '16GB' },
        { name: 'storage', value: '512GB' },
      ] } },
    },
  });

  // ASUS ROG SKU
  await prisma.sKU.upsert({
    where: { skuCode: 'ASUS-ROG-G16-16-512' },
    update: {},
    create: {
      productId: asusRog.id, skuCode: 'ASUS-ROG-G16-16-512',
      name: 'ASUS ROG Strix G16 16GB/512GB', price: 35990000,
      stockQuantity: 10, isDefault: true,
      variantAttributes: { createMany: { data: [
        { name: 'ram', value: '16GB' },
        { name: 'storage', value: '512GB' },
      ] } },
    },
  });

  console.log('✅ Tạo SKU');

  // ==================== PRODUCT SPECIFICATIONS (iPhone 16 Pro Max) ====================
  const specValues = [
    { defIndex: 0, valueText: '6.9 inch' },
    { defIndex: 1, valueText: 'Super Retina XDR OLED' },
    { defIndex: 2, valueText: '120Hz ProMotion' },
    { defIndex: 3, valueText: 'Apple A18 Pro' },
    { defIndex: 4, valueText: '8GB' },
    { defIndex: 5, valueText: '256GB / 512GB / 1TB' },
    { defIndex: 6, valueText: '48MP + 12MP + 12MP' },
    { defIndex: 7, valueText: '12MP TrueDepth' },
    { defIndex: 8, valueText: '4685 mAh' },
    { defIndex: 9, valueText: 'Sạc nhanh 27W, MagSafe 25W' },
    { defIndex: 10, valueText: 'Titan + kính ceramic' },
    { defIndex: 11, valueText: '227g' },
  ];

  for (const sv of specValues) {
    const def = createdPhoneSpecs[sv.defIndex];
    if (def) {
      await prisma.productSpecification.upsert({
        where: {
          productId_specificationDefinitionId: {
            productId: iphone16.id,
            specificationDefinitionId: def.id,
          },
        },
        update: { valueText: sv.valueText },
        create: {
          productId: iphone16.id,
          specificationDefinitionId: def.id,
          valueText: sv.valueText,
        },
      });
    }
  }

  console.log('✅ Tạo thông số sản phẩm');

  // ==================== ARTICLE CATEGORIES ====================
  const articleCats = [
    { name: 'Tin tức', slug: 'tin-tuc', sortOrder: 1 },
    { name: 'Hướng dẫn mua hàng', slug: 'huong-dan-mua-hang', sortOrder: 2 },
    { name: 'Khuyến mãi', slug: 'khuyen-mai', sortOrder: 3 },
    { name: 'Mẹo & Thủ thuật', slug: 'meo-thu-thuat', sortOrder: 4 },
    { name: 'Hỗ trợ', slug: 'ho-tro', sortOrder: 5 },
  ];

  const createdArticleCats: any[] = [];
  for (const ac of articleCats) {
    const cat = await prisma.articleCategory.upsert({
      where: { slug: ac.slug },
      update: {},
      create: ac,
    });
    createdArticleCats.push(cat);
  }

  console.log('✅ Tạo danh mục bài viết');

  // ==================== SAMPLE ARTICLES ====================
  await prisma.article.upsert({
    where: { slug: 'so-sanh-iphone-16-pro-max-vs-samsung-s24-ultra' },
    update: {},
    create: {
      articleCategoryId: createdArticleCats[1].id,
      authorUserId: admin.id,
      title: 'So sánh iPhone 16 Pro Max và Samsung Galaxy S24 Ultra',
      slug: 'so-sanh-iphone-16-pro-max-vs-samsung-s24-ultra',
      excerpt: 'Bài viết so sánh chi tiết giữa hai flagship hàng đầu 2024',
      content: '# So sánh iPhone 16 Pro Max vs Samsung Galaxy S24 Ultra\n\n## Thiết kế\n\niPhone 16 Pro Max sử dụng khung titan...\n\n## Hiệu năng\n\nChip A18 Pro của Apple...',
      status: 'PUBLISHED',
      isFeatured: true,
      publishedAt: new Date(),
    },
  });

  await prisma.article.upsert({
    where: { slug: 'top-5-laptop-tot-nhat-2024' },
    update: {},
    create: {
      articleCategoryId: createdArticleCats[1].id,
      authorUserId: admin.id,
      title: 'Top 5 Laptop tốt nhất 2024',
      slug: 'top-5-laptop-tot-nhat-2024',
      excerpt: 'Gợi ý 5 laptop đáng mua nhất năm 2024',
      content: '# Top 5 Laptop tốt nhất 2024\n\n## 1. MacBook Pro M4\n\nChip M4 mới...',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  console.log('✅ Tạo bài viết mẫu');

  // ==================== SAMPLE PAGES ====================
  const pages = [
    {
      title: 'Chính sách bảo hành', slug: 'chinh-sach-bao-hanh', template: 'policy',
      content: '# Chính sách bảo hành\n\n## 1. Điều kiện bảo hành\n\n- Sản phẩm còn trong thời hạn bảo hành\n- Tem bảo hành còn nguyên vẹn\n- Sản phẩm bị lỗi do nhà sản xuất\n\n## 2. Thời gian bảo hành\n\n- Điện thoại: 12 tháng\n- Laptop: 24 tháng\n- Phụ kiện: 6 tháng',
      showInFooter: true, showInCheckoutHelp: true,
    },
    {
      title: 'Chính sách đổi trả', slug: 'chinh-sach-doi-tra', template: 'policy',
      content: '# Chính sách đổi trả\n\n## 1. Điều kiện đổi trả\n\n- Trong vòng 7 ngày kể từ ngày mua\n- Sản phẩm còn nguyên hộp và phụ kiện\n- Chưa kích hoạt bảo hành điện tử',
      showInFooter: true,
    },
    {
      title: 'Chính sách giao hàng', slug: 'chinh-sach-giao-hang', template: 'policy',
      content: '# Chính sách giao hàng\n\n## Miễn phí giao hàng\n\nÁp dụng cho đơn hàng từ 500.000đ\n\n## Thời gian giao hàng\n\n- Nội thành: 1-2 ngày\n- Ngoại thành: 2-4 ngày',
      showInFooter: true, showInCheckoutHelp: true,
    },
    {
      title: 'Giới thiệu', slug: 'gioi-thieu', template: 'default',
      content: '# Giới thiệu Thegioididong\n\nChúng tôi là hệ thống bán lẻ điện thoại, laptop, phụ kiện chính hãng hàng đầu Việt Nam.',
      showInFooter: true,
    },
  ];

  for (const p of pages) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        authorUserId: admin.id,
        title: p.title,
        slug: p.slug,
        template: p.template,
        content: p.content,
        status: 'PUBLISHED',
        showInFooter: p.showInFooter ?? false,
        showInCheckoutHelp: p.showInCheckoutHelp ?? false,
        publishedAt: new Date(),
      },
    });
  }

  console.log('✅ Tạo trang nội dung');

  console.log('\n🎉 Hoàn thành tạo dữ liệu mẫu!');
  console.log('📧 Admin: admin@didong.local / Admin@123456');
  console.log('📧 Staff: staff@didong.local / Staff@123456');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
