# Thegioididong-Style Ecommerce MVP Design

## Summary

Build an ecommerce MVP focused on selling phones, laptops, tablets, and accessories in the style of Thegioididong. The first version includes both the customer storefront and a complete admin dashboard so products, specifications, variants, inventory, promotions, and orders can be managed without editing seed data.

The MVP uses NestJS for the backend API and NextJS for the frontend applications. The current repository already contains a NestJS scaffold in `backend/`; the MVP will add a customer web app and admin experience around a structured product catalog.

## Goals

- Let customers browse, filter, search, compare, and order phones/laptops.
- Let staff manage the catalog and orders from an admin dashboard from day one.
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

## Recommended Approach

Use a catalog-first MVP with full admin management.

This means the system prioritizes a strong product model, specification filtering, search, product details, comparison, order placement, and admin workflows. COD checkout is enough for the first release. Payment gateways and shipping providers can be added later behind explicit integration boundaries.

## Applications

### Backend API

Path: `backend/`

NestJS API responsible for authentication, catalog data, search endpoints, cart/order workflows, admin operations, file upload metadata, and database access.

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
- Manage categories, brands, products, variants, specifications, promotions, and users.

## Customer Storefront Scope

### Home Page

- Header with logo, search, cart, account/order lookup entry.
- Main category navigation: phones, laptops, tablets, accessories.
- Featured sections for hot products, promotions, new arrivals, and laptop/phone collections.

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

### Upload Management

- Upload product and brand images.
- Store file metadata in the database.
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
- `cart`: cart validation and server-side cart support.
- `orders`: checkout, order creation, order status updates, order lookup.
- `uploads`: image upload metadata and storage adapter.

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

### Category

- `id`
- `parentId`
- `name`
- `slug`
- `imageUrl`
- `seoTitle`
- `seoDescription`
- `sortOrder`
- `isActive`

### Brand

- `id`
- `name`
- `slug`
- `logoUrl`
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
- `url`
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

## Error Handling

- API validation errors return field-level messages.
- Auth errors return clear unauthorized or forbidden responses.
- Checkout fails if SKU is inactive, out of stock, quantity is invalid, or submitted price is stale.
- Admin delete actions should soft-delete or deactivate records when data is referenced by orders.
- Order status transitions should reject invalid moves such as `completed` back to `pending`.

## Security

- Passwords must be hashed with a strong password hashing algorithm.
- Admin APIs require authenticated users and role checks.
- Customer-facing APIs expose only published and active catalog data.
- Uploads must validate file type and size.
- Admin forms must not trust client-provided price totals.
- Order totals are calculated on the server.

## Testing Strategy

### Backend

- Unit tests for product filtering, checkout validation, order total calculation, and order status transitions.
- Integration tests for public product APIs.
- E2E tests for admin auth, product creation, SKU creation, and order creation.

### Frontend

- Component tests for product card, filter controls, SKU selector, cart summary, and admin forms.
- Playwright tests for browse-to-checkout flow.
- Playwright tests for admin login, product creation, and order status update.

### Seed Data

MVP should include seed data for:

- Phone category with iPhone, Samsung, Xiaomi examples.
- Laptop category with MacBook, Dell, ASUS examples.
- Accessory category with charger and case examples.
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
- Add image upload metadata.

### Phase 3: Customer Catalog

- Add home page.
- Add category listing.
- Add search.
- Add product detail.
- Add comparison.

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

- Admin can log in and manage categories, brands, products, SKUs, specifications, inventory, promotions, users, and orders.
- Admin can create a phone product with multiple storage/color SKUs and publish it.
- Customer can find the published product through category listing and search.
- Customer can view product detail, select a SKU, add it to cart, and place a COD order.
- Checkout stores a price snapshot and rejects stale or invalid SKU data.
- Admin can view the new order and update its status.
- Customer can look up the order using phone number and order code.
- Product pages and category pages are SEO-friendly.
- Tests cover the critical catalog, checkout, and admin order flows.

## Chosen Implementation Defaults

- ORM: use Prisma for schema definition, migrations, generated types, and seed data.
- UI component system: use shadcn/ui for customer and admin components.
- Search engine: use PostgreSQL-backed search in the first implementation. Add Meilisearch only after the catalog API is stable.
- Image storage: use local disk for development. Keep the storage adapter interface compatible with S3-compatible production storage.
