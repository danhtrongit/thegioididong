# Thegioididong-Style Ecommerce MVP Design

## Summary

Build an ecommerce MVP focused on selling phones, laptops, tablets, and accessories in the style of Thegioididong. The first version includes both the customer storefront and a complete admin dashboard so products, specifications, variants, inventory, promotions, media assets, pages, articles, and orders can be managed without editing seed data.

The MVP uses NestJS for the backend API and NextJS for the frontend applications. The current repository already contains a NestJS scaffold in `backend/`; the MVP will add a customer web app and admin experience around a structured product catalog.

## Goals

- Let customers browse, filter, search, compare, and order phones/laptops.
- Let staff manage the catalog and orders from an admin dashboard from day one.
- Let staff publish buying guides, product news, promotion articles, and SEO content from day one.
- Let staff manage reusable media assets and static CMS pages from day one.
- Model product variants and technical specifications properly for electronics.
- Keep checkout simple with cash-on-delivery first.
- Keep the architecture ready for later payment, shipping, and multi-store inventory integrations.

## Non-Goals For MVP

- Online payment integration.
- Shipping provider integration.
- Installment payments.
- Trade-in flow.
- Complex loyalty system.
- Customer reviews and ratings.
- Marketplace seller management.
- Real-time chat.
- Native mobile app.
- Full CMS features such as drag-and-drop page builders, approval workflows, and multi-language publishing.

## Recommended Approach

Use a catalog-first MVP with full admin management.

This means the system prioritizes a strong product model, specification filtering, search, product details, comparison, media reuse, page/article content, order placement, and admin workflows. COD checkout is enough for the first release. Payment gateways and shipping providers can be added later behind explicit integration boundaries.

## Applications

### Backend API

Path: `backend/`

NestJS API responsible for authentication, catalog data, media metadata, page content, article content, search endpoints, cart/order workflows, admin operations, file upload metadata, and database access.

### Customer Web

Path: `frontend/`

NextJS app for shoppers. It should support SEO-friendly category pages and product detail pages.

### Admin Dashboard

Path: `admin/`

NextJS app for staff/admin users. It should focus on dense, efficient workflows rather than marketing-style pages.

The admin app can be developed as a separate NextJS app to keep permissions, navigation, and layout independent from the customer storefront.

## Core User Roles

### Guest

- Browse categories and product detail pages.
- Search and filter products.
- Compare products.
- Read buying guides, product news, promotion posts, support articles, and static policy pages.
- Add items to cart.
- Place COD order with contact and address details.
- Track order by phone number and order code.

### Customer

- Same as guest.
- View order history after login.
- Reuse saved contact information.

### Staff

- View and process orders.
- Update order status.
- Manage inventory counts.
- Read catalog data.

### Admin

- Full staff permissions.
- Manage categories, brands, products, variants, specifications, promotions, media, pages, articles, and users.

## Customer Storefront Scope

### Home Page

- Header with logo, search, cart, account/order lookup entry.
- Main category navigation: phones, laptops, tablets, accessories.
- Featured sections for hot products, promotions, new arrivals, laptop/phone collections, and latest buying guides.

### Category Listing

- SEO-friendly route per category.
- Filter by brand, price range, RAM, storage, chip/CPU, screen size, refresh rate, and other category-specific specs.
- Sort by featured, price ascending, price descending, newest.
- Pagination or load-more.
- Product cards show image, name, current price, old price, promotion tags, key specs, and stock status.

### Product Detail

- Product image gallery.
- Variant selector for storage, color, RAM, or other SKU-level choices.
- Current price and old price.
- Promotion block.
- Stock status.
- Key specifications.
- Full specification table grouped by section.
- Related products.
- Add to cart and buy-now actions.

### Product Comparison

- Compare up to 3 products.
- Show price, image, key specs, and grouped technical specs.
- Highlight spec differences where possible.

### Search

- Search by product name, brand, SKU, and keyword.
- Show suggestions in the header.
- Search result page supports the same filters and sorting as category listing.

### Cart

- Add, remove, and update quantity.
- Persist cart for guest users in browser storage and optionally server-side after login.
- Validate price and availability again during checkout.

### Checkout

- COD only for MVP.
- Required fields: full name, phone number, province/city, district, ward, address, note.
- Optional order method: delivery to address or pick up at store.
- Create order and show order code.

### Order Lookup

- Lookup by phone number and order code.
- Show order status and order items.

### Articles And Buying Guides

- SEO-friendly article listing page.
- Article category pages for news, buying guides, promotions, tips, and support.
- Article detail page with title, slug, excerpt, cover image, author, published date, content, table of contents, and related articles.
- Link articles to related products where useful, such as buying guides and promotion posts.
- Show latest and related articles on home page, product detail pages, and category pages.
- Support article search through the shared search experience.

### Static Pages

- SEO-friendly page detail route for content such as buying policy, warranty policy, return policy, delivery policy, about page, and store information.
- Page detail includes title, slug, excerpt, cover image, body content, SEO title, SEO description, and publish date.
- Customer storefront only shows published pages.
- Header, footer, and checkout can link to selected published pages.

## Admin Dashboard Scope

### Admin Auth

- Login with email and password.
- JWT-based session with refresh token.
- Role-based authorization for admin and staff.

### Dashboard Overview

- Daily order count.
- Pending orders count.
- Revenue estimate from completed orders.
- Low-stock SKU count.
- Recent orders.

### Category Management

- Create, update, delete, and reorder categories.
- Configure slug, display name, icon/image, SEO title, SEO description, and active status.
- Define category-specific specification filters.

### Brand Management

- Create, update, and delete brands.
- Configure name, slug, logo, description, and active status.

### Product Management

- Create, update, publish, unpublish, and archive products.
- Assign category and brand.
- Configure name, slug, short description, full description, SEO metadata, and product status.
- Attach product images.
- Configure highlighted specs for product cards.
- Manage full technical specification groups.

### Variant And SKU Management

- Create and update SKUs under a product.
- Configure variant attributes such as color, storage, RAM, CPU, screen size, or GPU.
- Configure SKU code, barcode, price, old price, cost price, stock quantity, and active status.
- Mark default SKU.

### Specification Management

- Manage reusable specification definitions per category.
- Group specs into sections such as display, performance, camera, battery, design, connectivity, and warranty.
- Support text, number, boolean, and option values.
- Mark specs as filterable, comparable, or highlighted.

### Inventory Management

- View stock by SKU.
- Manually adjust stock with reason.
- Track stock changes through inventory movements.
- Show low-stock warning based on threshold.

### Promotion Management

- Create product-level promotions.
- Configure title, description, start date, end date, active status.
- Attach promotions to products or SKUs.
- MVP promotions affect display only unless an explicit fixed discount is configured.

### Article Management

- Create, update, preview, publish, unpublish, and archive articles.
- Manage article categories and tags.
- Configure title, slug, excerpt, cover image, body content, SEO title, SEO description, canonical URL, and publish date.
- Link articles to related products.
- Mark featured articles for home page and category sections.
- Manage author display name and reading time.

### Page Management

- Create, update, preview, publish, unpublish, and archive static pages.
- Configure title, slug, excerpt, cover image, body content, SEO title, SEO description, canonical URL, template, and publish date.
- Supported MVP templates: default content page, policy page, and store information page.
- Mark pages as visible in footer, checkout help, or account help sections.
- Keep page content as structured Markdown content for MVP rather than a drag-and-drop builder.

### Order Management

- List orders with filters by status, phone number, date, and order code.
- View order detail.
- Update order status.
- Add internal note.
- Cancel order with reason.
- Adjust customer information before confirmation.

### User Management

- Create staff/admin users.
- Disable users.
- Assign role.
- Reset password through admin-controlled flow.

### Media Library Management

- Upload product, brand, category, article, and page images.
- Browse media assets by folder, type, keyword, and upload date.
- Edit title, alt text, folder, and active/archive status.
- Select existing media assets from product, brand, category, article, and page forms.
- Store file metadata in the database and keep uploaded files behind a storage adapter.
- Keep physical storage pluggable so local disk can be used first and S3-compatible storage can be added later.

## Backend Modules

- `auth`: login, token refresh, password hashing, guards, role authorization.
- `users`: admin/staff/customer user records.
- `categories`: category tree and filter configuration.
- `brands`: brand records.
- `products`: product records and public catalog queries.
- `variants`: SKU and variant attributes.
- `specifications`: spec definitions and product spec values.
- `inventory`: stock and inventory movements.
- `promotions`: promotion records and product/SKU attachments.
- `media`: reusable media asset metadata, folders, upload validation, and storage adapter.
- `pages`: static CMS pages, page publishing, and public page queries.
- `articles`: article categories, tags, posts, relations to products, and public article queries.
- `cart`: cart validation and server-side cart support.
- `orders`: checkout, order creation, order status updates, order lookup.

## Data Model

### User

- `id`
- `email`
- `passwordHash`
- `fullName`
- `phone`
- `role`
- `status`
- `createdAt`
- `updatedAt`

### MediaFolder

- `id`
- `parentId`
- `name`
- `slug`
- `sortOrder`
- `createdAt`
- `updatedAt`

### MediaAsset

- `id`
- `folderId`
- `uploadedByUserId`
- `storageKey`
- `url`
- `mimeType`
- `fileSizeBytes`
- `width`
- `height`
- `title`
- `altText`
- `status`
- `createdAt`
- `updatedAt`

### Category

- `id`
- `parentId`
- `name`
- `slug`
- `imageMediaAssetId`
- `seoTitle`
- `seoDescription`
- `sortOrder`
- `isActive`

### Brand

- `id`
- `name`
- `slug`
- `logoMediaAssetId`
- `description`
- `isActive`

### Product

- `id`
- `categoryId`
- `brandId`
- `name`
- `slug`
- `shortDescription`
- `description`
- `seoTitle`
- `seoDescription`
- `status`
- `createdAt`
- `updatedAt`

### ProductImage

- `id`
- `productId`
- `skuId`
- `mediaAssetId`
- `altText`
- `sortOrder`

### SKU

- `id`
- `productId`
- `skuCode`
- `barcode`
- `name`
- `price`
- `oldPrice`
- `costPrice`
- `stockQuantity`
- `lowStockThreshold`
- `isDefault`
- `isActive`

### VariantAttribute

- `id`
- `skuId`
- `name`
- `value`

Examples: `color = Titan Xanh`, `storage = 256GB`, `ram = 8GB`.

### SpecificationDefinition

- `id`
- `categoryId`
- `groupName`
- `name`
- `valueType`
- `unit`
- `isFilterable`
- `isComparable`
- `isHighlighted`
- `sortOrder`

### ProductSpecification

- `id`
- `productId`
- `specificationDefinitionId`
- `valueText`
- `valueNumber`
- `valueBoolean`

### Promotion

- `id`
- `title`
- `description`
- `discountType`
- `discountValue`
- `startsAt`
- `endsAt`
- `isActive`

### ArticleCategory

- `id`
- `name`
- `slug`
- `description`
- `sortOrder`
- `isActive`

### ArticleTag

- `id`
- `name`
- `slug`

### Article

- `id`
- `articleCategoryId`
- `authorUserId`
- `title`
- `slug`
- `excerpt`
- `coverMediaAssetId`
- `content`
- `seoTitle`
- `seoDescription`
- `canonicalUrl`
- `status`
- `isFeatured`
- `publishedAt`
- `createdAt`
- `updatedAt`

### ArticleProduct

- `id`
- `articleId`
- `productId`

### ArticleTagMap

- `id`
- `articleId`
- `articleTagId`

### Page

- `id`
- `authorUserId`
- `title`
- `slug`
- `excerpt`
- `coverMediaAssetId`
- `content`
- `template`
- `seoTitle`
- `seoDescription`
- `canonicalUrl`
- `status`
- `showInFooter`
- `showInCheckoutHelp`
- `showInAccountHelp`
- `publishedAt`
- `createdAt`
- `updatedAt`

### InventoryMovement

- `id`
- `skuId`
- `quantityChange`
- `reason`
- `note`
- `createdByUserId`
- `createdAt`

### Cart

- `id`
- `userId`
- `sessionId`
- `createdAt`
- `updatedAt`

### CartItem

- `id`
- `cartId`
- `skuId`
- `quantity`

### Order

- `id`
- `orderCode`
- `userId`
- `customerName`
- `customerPhone`
- `customerEmail`
- `province`
- `district`
- `ward`
- `address`
- `note`
- `fulfillmentMethod`
- `paymentMethod`
- `status`
- `subtotal`
- `discountTotal`
- `shippingFee`
- `grandTotal`
- `createdAt`
- `updatedAt`

### OrderItem

- `id`
- `orderId`
- `skuId`
- `productName`
- `skuName`
- `unitPrice`
- `quantity`
- `lineTotal`

## API Surface

### Public API

- `GET /categories`
- `GET /categories/:slug`
- `GET /brands`
- `GET /products`
- `GET /products/:slug`
- `GET /products/compare`
- `GET /search/suggestions`
- `GET /search`
- `GET /articles`
- `GET /articles/:slug`
- `GET /article-categories`
- `GET /pages/:slug`
- `POST /cart/validate`
- `POST /orders`
- `GET /orders/lookup`

### Admin API

- `POST /admin/auth/login`
- `POST /admin/auth/refresh`
- `GET /admin/dashboard`
- `GET /admin/categories`
- `POST /admin/categories`
- `PATCH /admin/categories/:id`
- `DELETE /admin/categories/:id`
- `GET /admin/brands`
- `POST /admin/brands`
- `PATCH /admin/brands/:id`
- `DELETE /admin/brands/:id`
- `GET /admin/products`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `POST /admin/products/:id/images`
- `POST /admin/products/:id/specifications`
- `POST /admin/products/:id/skus`
- `PATCH /admin/skus/:id`
- `POST /admin/inventory/movements`
- `GET /admin/promotions`
- `POST /admin/promotions`
- `PATCH /admin/promotions/:id`
- `GET /admin/media/folders`
- `POST /admin/media/folders`
- `PATCH /admin/media/folders/:id`
- `GET /admin/media/assets`
- `POST /admin/media/assets`
- `PATCH /admin/media/assets/:id`
- `DELETE /admin/media/assets/:id`
- `GET /admin/pages`
- `POST /admin/pages`
- `PATCH /admin/pages/:id`
- `POST /admin/pages/:id/preview`
- `GET /admin/article-categories`
- `POST /admin/article-categories`
- `PATCH /admin/article-categories/:id`
- `GET /admin/article-tags`
- `POST /admin/article-tags`
- `PATCH /admin/article-tags/:id`
- `GET /admin/articles`
- `POST /admin/articles`
- `PATCH /admin/articles/:id`
- `POST /admin/articles/:id/preview`
- `GET /admin/orders`
- `GET /admin/orders/:id`
- `PATCH /admin/orders/:id/status`
- `POST /admin/orders/:id/notes`
- `GET /admin/users`
- `POST /admin/users`
- `PATCH /admin/users/:id`

## Frontend Routes

### Customer Web

- `/`
- `/dien-thoai`
- `/laptop`
- `/tablet`
- `/phu-kien`
- `/tim-kiem`
- `/so-sanh`
- `/tin-tuc`
- `/tin-tuc/[categorySlug]`
- `/bai-viet/[slug]`
- `/trang/[slug]`
- `/san-pham/[slug]`
- `/gio-hang`
- `/thanh-toan`
- `/tra-cuu-don-hang`
- `/tai-khoan`
- `/tai-khoan/don-hang`

### Admin Dashboard

- `/admin/login`
- `/admin`
- `/admin/categories`
- `/admin/brands`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]`
- `/admin/inventory`
- `/admin/promotions`
- `/admin/media`
- `/admin/pages`
- `/admin/pages/new`
- `/admin/pages/[id]`
- `/admin/articles`
- `/admin/articles/new`
- `/admin/articles/[id]`
- `/admin/article-categories`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/users`

## Data Flow

### Browse Product

1. Customer opens a category page.
2. NextJS requests category and product listing data from NestJS.
3. NestJS applies category, brand, price, spec filters, sorting, and pagination.
4. NextJS renders product cards with SEO metadata.

### Product Detail

1. Customer opens a product slug.
2. NextJS requests product detail including images, SKUs, specs, promotions, and related products.
3. Customer selects a SKU.
4. UI updates price, images, stock, and promotion display.

### Checkout

1. Customer submits cart and contact information.
2. NestJS validates SKU status, stock, price, and quantity.
3. NestJS creates order and order items using a price snapshot.
4. NestJS decreases stock immediately when the order is created.
5. Customer receives an order code.

If the order is canceled, stock is restored with an inventory movement record.

### Admin Product Editing

1. Admin creates product base information.
2. Admin adds images, specifications, and SKUs.
3. Admin publishes product.
4. Customer storefront only shows published products with at least one active SKU.

### Article Publishing

1. Admin creates an article draft.
2. Admin selects article category, tags, cover image, body content, related products, and SEO metadata.
3. Admin previews the article.
4. Admin publishes the article.
5. Customer storefront only shows published articles with a `publishedAt` date in the past or present.

### Media Selection

1. Admin uploads an image into the media library.
2. NestJS validates file type, size, and image metadata.
3. NestJS stores the file using the configured storage adapter and saves a `MediaAsset` record.
4. Admin selects the asset from product, category, brand, article, or page forms.
5. Customer storefront renders the resolved media URL and alt text from the linked `MediaAsset`.

### Page Publishing

1. Admin creates a page draft.
2. Admin selects template, cover image, body content, SEO metadata, and navigation visibility flags.
3. Admin previews the page.
4. Admin publishes the page.
5. Customer storefront only shows published pages with a `publishedAt` date in the past or present.

## Error Handling

- API validation errors return field-level messages.
- Auth errors return clear unauthorized or forbidden responses.
- Checkout fails if SKU is inactive, out of stock, quantity is invalid, or submitted price is stale.
- Page public routes return not found for drafts, archived pages, and future-scheduled pages.
- Article public pages return not found for drafts, archived posts, and future-scheduled posts.
- Media delete archives the asset when it is referenced by products, brands, categories, articles, or pages.
- Admin delete actions should soft-delete or deactivate records when data is referenced by orders.
- Order status transitions should reject invalid moves such as `completed` back to `pending`.

## Security

- Passwords must be hashed with a strong password hashing algorithm.
- Admin APIs require authenticated users and role checks.
- Customer-facing APIs expose only published and active catalog data.
- Customer-facing article APIs expose only published articles.
- Customer-facing page APIs expose only published pages.
- Uploads must validate file type and size.
- Page and article content must be sanitized before rendering.
- Admin forms must not trust client-provided price totals.
- Order totals are calculated on the server.

## Testing Strategy

### Backend

- Unit tests for product filtering, checkout validation, order total calculation, and order status transitions.
- Unit tests for media validation, media archive behavior, and page publishing visibility.
- Unit tests for article publishing visibility and slug uniqueness.
- Integration tests for public product APIs.
- E2E tests for admin auth, media upload, product creation, SKU creation, page publishing, article publishing, and order creation.

### Frontend

- Component tests for product card, filter controls, SKU selector, cart summary, and admin forms.
- Playwright tests for browse-to-checkout flow.
- Playwright tests for static page detail routes.
- Playwright tests for article listing and article detail pages.
- Playwright tests for admin login, media selection, page creation, product creation, and order status update.

### Seed Data

MVP should include seed data for:

- Phone category with iPhone, Samsung, Xiaomi examples.
- Laptop category with MacBook, Dell, ASUS examples.
- Accessory category with charger and case examples.
- Article categories for news, buying guides, promotions, tips, and support.
- Sample articles linked to phone and laptop products.
- Media folders for products, brands, articles, pages, and banners.
- Sample static pages for warranty policy, return policy, delivery policy, and about page.
- Admin user.
- Staff user.

Seed data is only for local development and demos. Real product data must be manageable through the admin dashboard.

## Delivery Phases

### Phase 1: Foundation

- Convert repo into a multi-app structure.
- Add NextJS customer web app.
- Add NextJS admin app.
- Add PostgreSQL and ORM.
- Add environment configuration.
- Add auth and role system.

### Phase 2: Catalog Admin

- Add category management.
- Add brand management.
- Add product management.
- Add SKU and specification management.
- Add media library management.
- Add static page management.
- Add article category, tag, and article management.

### Phase 3: Customer Catalog And Content

- Add home page.
- Add category listing.
- Add search.
- Add product detail.
- Add comparison.
- Add article listing.
- Add article detail.
- Add article-to-product related sections.
- Add static page detail routes.

### Phase 4: Cart And Orders

- Add cart.
- Add checkout.
- Add order creation.
- Add order lookup.
- Add admin order management.

### Phase 5: Polish And Hardening

- Add dashboard metrics.
- Add promotion management.
- Add inventory movements.
- Add Playwright flows.
- Add production build checks.

## Acceptance Criteria

- Admin can log in and manage categories, brands, products, SKUs, specifications, inventory, promotions, media, pages, users, and orders.
- Admin can upload, browse, edit, select, and archive media assets.
- Admin can create and publish static pages for warranty, return, delivery, about, and store information content.
- Admin can manage article categories, tags, articles, article SEO metadata, and related products.
- Admin can create a phone product with multiple storage/color SKUs and publish it.
- Admin can create and publish a buying guide article linked to relevant phone/laptop products.
- Customer can find the published product through category listing and search.
- Customer can read published articles and navigate from an article to related products.
- Customer can read published static pages linked from storefront navigation areas.
- Customer can view product detail, select a SKU, add it to cart, and place a COD order.
- Checkout stores a price snapshot and rejects stale or invalid SKU data.
- Admin can view the new order and update its status.
- Customer can look up the order using phone number and order code.
- Product pages and category pages are SEO-friendly.
- Tests cover the critical catalog, checkout, and admin order flows.

## Chosen Implementation Defaults

- ORM: use Prisma for schema definition, migrations, generated types, and seed data.
- UI component system: use shadcn/ui for customer and admin components.
- Content editor: use Markdown for pages and articles in the MVP. A rich text editor can replace it later without changing public routes.
- Search engine: use PostgreSQL-backed search in the first implementation. Add Meilisearch only after the catalog API is stable.
- Image storage: use local disk for development. Keep the storage adapter interface compatible with S3-compatible production storage.
