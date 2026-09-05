# E-Commerce Implementation Plan

> Status: `[ ]` pending | `[-]` in progress | `[x]` done

---

## Phase 1: Project Setup, DB Schema, Auth + Password, MinIO

**Duration:** 2-3 days

### 1.1 Initialize Monorepo
- [x] Create `ecommerce/` folder
- [x] Create `ecommerce/frontend/` folder
- [x] Create `ecommerce/backend/` folder
- [x] Initialize git repository in `ecommerce/`
- [x] Create `.gitignore` (Node.js, NestJS, Vite, Prisma)

### 1.2 Backend — NestJS Project
- [x] Create NestJS project in `backend/`
- [x] Install `@nestjs/config` and configure ConfigModule
- [x] Install `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`
- [x] Install `@prisma/client` and `prisma` (dev)
- [x] Install `class-validator`, `class-transformer`
- [x] Install `bcrypt` and `@types/bcrypt`
- [x] Install `minio`
- [x] Install `multer` and `@types/multer`
- [x] Create `.env` file with all environment variables
- [x] Configure global `ValidationPipe` in `main.ts`
- [x] Verify: `npm run build` compiles

### 1.3 Backend — Prisma Setup
- [x] Initialize Prisma (`npx prisma init`)
- [x] Create `User` model in schema
- [x] Create `Category` model in schema
- [x] Create `Product` model in schema
- [x] Create `File` model in schema
- [x] Run migration (`npx prisma migrate dev --name init`)
- [x] Verify: `npx prisma studio` shows tables

### 1.4 Backend — PrismaModule
- [x] Create `PrismaService` (`src/prisma/prisma.service.ts`)
- [x] Create `PrismaModule` (`src/prisma/prisma.module.ts`)
- [x] Register PrismaModule in `AppModule`
- [x] Verify: `npm run build` compiles

### 1.5 Backend — Seed File
- [ ] Create `prisma/seed.ts`
- [ ] Seed admin user (email, hashed password, ADMIN role)
- [ ] Seed sample categories (Electronics, Clothing, Books)
- [ ] Add seed script to `package.json`
- [ ] Run seed (`npx prisma db seed`)
- [ ] Verify: `npx prisma studio` shows seed data

### 1.6 Backend — Auth Module Structure
- [ ] Create `AuthModule` (`src/modules/auth/auth.module.ts`)
- [ ] Create `AuthService` (`src/modules/auth/auth.service.ts`)
- [ ] Create `AuthController` (`src/modules/auth/auth.controller.ts`)
- [ ] Register AuthModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 1.7 Backend — Auth DTOs
- [ ] Create `RegisterDto` (email, password, name)
- [ ] Create `LoginDto` (email, password)
- [ ] Create `RefreshTokenDto` (refreshToken)
- [ ] Create `ChangePasswordDto` (currentPassword, newPassword)
- [ ] Add validation decorators to all DTOs
- [ ] Verify: `npm run build` compiles

### 1.8 Backend — JWT Strategy
- [ ] Create JWT strategy (`src/modules/auth/strategies/jwt.strategy.ts`)
- [ ] Configure strategy to extract token from Authorization header
- [ ] Configure strategy to validate token and attach user to request
- [ ] Register strategy in AuthModule
- [ ] Verify: `npm run build` compiles

### 1.9 Backend — Auth Guards
- [ ] Create `JwtAuthGuard` (`src/modules/auth/guards/jwt-auth.guard.ts`)
- [ ] Create `RolesGuard` (`src/modules/auth/guards/roles.guard.ts`)
- [ ] Create `@Roles()` decorator (`src/modules/auth/decorators/roles.decorator.ts`)
- [ ] Verify: `npm run build` compiles

### 1.10 Backend — Register Endpoint
- [ ] Implement `register()` in AuthService
- [ ] Hash password with bcrypt before saving
- [ ] Check for existing user (email unique)
- [ ] Create user in database
- [ ] Return user data (without password)
- [ ] Add POST `/api/auth/register` route in AuthController
- [ ] Verify: Register a new user via API

### 1.11 Backend — Login & Logout Endpoints
- [ ] Implement `login()` in AuthService
- [ ] Find user by email
- [ ] Compare password with bcrypt
- [ ] Generate access token (JWT)
- [ ] Generate refresh token (JWT)
- [ ] Return both tokens
- [ ] Add POST `/api/auth/login` route in AuthController
- [ ] Implement `logout()` in AuthService
- [ ] Validate refresh token
- [ ] Invalidate refresh token (remove from storage)
- [ ] Add POST `/api/auth/logout` route in AuthController
- [ ] Verify: Login returns access + refresh tokens
- [ ] Verify: Logout invalidates refresh token

### 1.12 Backend — Refresh Token Endpoint
- [ ] Implement `refreshToken()` in AuthService
- [ ] Validate refresh token
- [ ] Generate new access token
- [ ] Return new access token
- [ ] Add POST `/api/auth/refresh` route in AuthController
- [ ] Verify: Refresh token returns new access token

### 1.13 Backend — Change Password Endpoint
- [ ] Implement `changePassword()` in AuthService
- [ ] Verify current password matches
- [ ] Hash new password
- [ ] Update password in database
- [ ] Add PATCH `/api/auth/change-password` route (protected)
- [ ] Verify: Password changes successfully

### 1.14 Backend — Profile Endpoint
- [ ] Implement `getProfile()` in AuthService
- [ ] Return current user data from JWT payload
- [ ] Add GET `/api/auth/profile` route (protected)
- [ ] Verify: Profile returns current user data

### 1.15 Backend — Auth Error Handling
- [ ] Return 401 for invalid credentials
- [ ] Return 409 for duplicate email on register
- [ ] Return 400 for invalid/expired refresh token
- [ ] Return 400 for wrong current password
- [ ] Verify: All error cases return correct status codes

### 1.16 Backend — MinIO Module
- [ ] Create `MinioModule` (`src/modules/minio/minio.module.ts`)
- [ ] Create `MinioService` (`src/modules/minio/minio.service.ts`)
- [ ] Implement bucket creation on module init
- [ ] Implement basic file upload to MinIO
- [ ] Implement basic file delete from MinIO
- [ ] Implement file URL generation
- [ ] Register MinioModule in `AppModule`
- [ ] Verify: MinIO connection works (check MinIO console)

### 1.17 Backend — Files Module
- [ ] Create `FilesModule` (`src/modules/files/files.module.ts`)
- [ ] Create `FilesService` (`src/modules/files/files.service.ts`)
- [ ] Create `FilesController` (`src/modules/files/files.controller.ts`)
- [ ] Register FilesModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 1.18 Backend — Basic File Upload Endpoint
- [ ] Implement basic POST `/api/files/upload` endpoint (single file)
- [ ] Use simple `multer` memory storage
- [ ] Save file record in database
- [ ] Return file data
- [ ] Verify: Upload image via API, check MinIO + DB

### 1.19 Backend — File List Endpoint
- [ ] Implement GET `/api/files` endpoint
- [ ] Filter by entityType and entityId
- [ ] Return list of files
- [ ] Verify: List files for an entity

### 1.20 Backend — File Delete Endpoint
- [ ] Implement DELETE `/api/files/:id` endpoint
- [ ] Delete from MinIO
- [ ] Delete record from database
- [ ] Verify: Delete removes from MinIO + DB

### 1.21 Backend — File Link/Unlink Endpoints
- [ ] Implement PATCH `/api/files/:id/link` endpoint
- [ ] Link file to entity (entityType + entityId)
- [ ] Implement PATCH `/api/files/:id/unlink` endpoint
- [ ] Unlink file from entity
- [ ] Verify: Link/unlink works correctly

### 1.22 Frontend — Vite Project
- [ ] Create Vite + React + TypeScript project in `frontend/`
- [ ] Install `@reduxjs/toolkit`, `react-redux`
- [ ] Install `react-router-dom`
- [ ] Install `axios`
- [ ] Install `tailwindcss` and `@tailwindcss/vite`
- [ ] Configure Tailwind in `vite.config.ts`
- [ ] Initialize shadcn/ui
- [ ] Add shadcn/ui components: button, input, card, label
- [ ] Verify: `npm run build` compiles

### 1.23 Frontend — Redux Store
- [ ] Create store (`src/store/index.ts`)
- [ ] Create auth slice (`src/store/slices/authSlice.ts`)
- [ ] Add user, tokens, isAuthenticated to auth state
- [ ] Add login, logout, setTokens actions
- [ ] Configure localStorage persistence for refresh token
- [ ] Wrap app with Redux Provider in `main.tsx`
- [ ] Verify: `npm run build` compiles

### 1.24 Frontend — API Base Service
- [ ] Create Axios instance (`src/services/api.ts`)
- [ ] Configure base URL from env variable
- [ ] Add request interceptor to attach access token
- [ ] Add response interceptor to handle 401 (refresh token)
- [ ] Verify: `npm run build` compiles

### 1.25 Frontend — Router Setup
- [ ] Configure React Router in `App.tsx`
- [ ] Create route structure: `/`, `/auth/*`, `/admin/*`, `/products`, `/cart`, etc.
- [ ] Create placeholder pages for each route
- [ ] Verify: `npm run build` compiles, routes work

### 1.26 Frontend — Auth API (RTK Query)
- [ ] Create authApi (`src/services/authApi.ts`)
- [ ] Add register mutation
- [ ] Add login mutation
- [ ] Add refresh mutation
- [ ] Add getProfile query
- [ ] Configure base URL and headers
- [ ] Verify: `npm run build` compiles

### 1.27 Frontend — Login Page
- [ ] Create Login page (`src/pages/auth/Login.tsx`)
- [ ] Add email input field
- [ ] Add password input field
- [ ] Add submit button
- [ ] Call login API on submit
- [ ] Redirect to home on success
- [ ] Show error message on failure
- [ ] Add link to register page
- [ ] Verify: Login works end-to-end

### 1.28 Frontend — Register Page
- [ ] Create Register page (`src/pages/auth/Register.tsx`)
- [ ] Add name, email, password fields
- [ ] Add submit button
- [ ] Call register API on submit
- [ ] Redirect to login on success
- [ ] Show error message on failure
- [ ] Add link to login page
- [ ] Verify: Register works end-to-end

### 1.29 Phase 1 — Full Verification
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Register a new user
- [ ] Login with new user
- [ ] Access protected route with token
- [ ] Refresh token works
- [ ] Change password works
- [ ] Upload file via API
- [ ] List files via API
- [ ] Delete file via API

---

## Phase 2: User Management (Admin)

**Duration:** 1-2 days

### 2.1 Backend — Users Module Structure
- [ ] Create `UsersModule` (`src/modules/users/users.module.ts`)
- [ ] Create `UsersService` (`src/modules/users/users.service.ts`)
- [ ] Create `UsersController` (`src/modules/users/users.controller.ts`)
- [ ] Register UsersModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 2.2 Backend — Users DTOs
- [ ] Create `UpdateRoleDto` (role: ADMIN | USER | CUSTOMER)
- [ ] Add validation decorators
- [ ] Verify: `npm run build` compiles

### 2.3 Backend — Admin List Users Endpoint
- [ ] Implement `findAll()` in UsersService
- [ ] Add pagination support (page, limit)
- [ ] Add search by name/email
- [ ] Add filter by role
- [ ] Return users with total count and order count
- [ ] Add GET `/api/admin/users` route (ADMIN only)
- [ ] Apply AdminGuard
- [ ] Verify: Admin can list users

### 2.4 Backend — Admin Update Role Endpoint
- [ ] Implement `updateRole()` in UsersService
- [ ] Validate role is valid enum value (CUSTOMER | USER | ADMIN)
- [ ] Prevent self-role change
- [ ] Add PATCH `/api/admin/users/:id/role` route (ADMIN only)
- [ ] Apply AdminGuard
- [ ] Verify: Admin can change user role

### 2.5 Backend — Admin User Error Handling
- [ ] Return 404 for non-existent user
- [ ] Return 400 for invalid role
- [ ] Return 403 for non-admin access
- [ ] Return 400 for self-role change attempt
- [ ] Verify: All error cases handled

### 2.6 Frontend — Admin API (RTK Query)
- [ ] Create adminApi (`src/services/adminApi.ts`)
- [ ] Add getUsers query (with pagination)
- [ ] Add updateUserRole mutation
- [ ] Verify: `npm run build` compiles

### 2.7 Frontend — Auth Guard Component
- [ ] Create AuthGuard (`src/components/guards/AuthGuard.tsx`)
- [ ] Check if user is authenticated
- [ ] Redirect to login if not
- [ ] Verify: `npm run build` compiles

### 2.8 Frontend — Role Guard Component
- [ ] Create RoleGuard (`src/components/guards/RoleGuard.tsx`)
- [ ] Check if user has required role
- [ ] Redirect to home if not authorized
- [ ] Verify: `npm run build` compiles

### 2.9 Frontend — Admin Layout
- [ ] Create AdminLayout (`src/pages/admin/AdminLayout.tsx`)
- [ ] Add sidebar navigation
- [ ] Add main content area
- [ ] Wrap with AuthGuard and RoleGuard
- [ ] Verify: `npm run build` compiles

### 2.10 Frontend — Admin Sidebar
- [ ] Create Sidebar component (`src/components/layout/Sidebar.tsx`)
- [ ] Add Dashboard link
- [ ] Add Products link
- [ ] Add Categories link
- [ ] Add Orders link
- [ ] Add Users link
- [ ] Verify: `npm run build` compiles

### 2.11 Frontend — User Table Component
- [ ] Create UserTable (`src/components/admin/UserTable.tsx`)
- [ ] Display user email, name, role, created date
- [ ] Add role selector dropdown
- [ ] Verify: `npm run build` compiles

### 2.12 Frontend — Role Selector Component
- [ ] Create RoleSelector (`src/components/admin/RoleSelector.tsx`)
- [ ] Show current role
- [ ] Dropdown to select new role
- [ ] Call updateUserRole on change
- [ ] Show success/error feedback
- [ ] Verify: `npm run build` compiles

### 2.13 Frontend — User List Page
- [ ] Create UserList page (`src/pages/admin/users/UserList.tsx`)
- [ ] Fetch users with adminApi
- [ ] Display UserTable
- [ ] Add pagination controls
- [ ] Verify: `npm run build` compiles

### 2.14 Frontend — Protect Admin Routes
- [ ] Wrap `/admin/*` routes with AuthGuard
- [ ] Wrap `/admin/*` routes with RoleGuard (ADMIN/USER)
- [ ] Verify: Non-admin users redirected

### 2.15 Phase 2 — Full Verification
- [ ] Backend admin endpoints work
- [ ] Admin can list users
- [ ] Admin can change user role
- [ ] Non-admin gets 403
- [ ] Frontend admin layout renders
- [ ] User list displays correctly
- [ ] Role change works in UI

---

## Phase 3: Products + Categories CRUD

**Duration:** 2-3 days

### 3.1 Backend — Categories Module Structure
- [ ] Create `CategoriesModule` (`src/modules/categories/categories.module.ts`)
- [ ] Create `CategoriesService` (`src/modules/categories/categories.service.ts`)
- [ ] Create `CategoriesController` (`src/modules/categories/categories.controller.ts`)
- [ ] Register CategoriesModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 3.2 Backend — Categories DTOs
- [ ] Create `CreateCategoryDto` (name, description, parentId)
- [ ] Create `UpdateCategoryDto` (name, description)
- [ ] Add validation decorators
- [ ] Verify: `npm run build` compiles

### 3.3 Backend — Slug Utility
- [ ] Create slugify function (`src/utils/slugify.ts`)
- [ ] Generate slug from name
- [ ] Handle duplicates (append number)
- [ ] Verify: `npm run build` compiles

### 3.4 Backend — Create Category Endpoint
- [ ] Implement `create()` in CategoriesService
- [ ] Auto-generate slug from name
- [ ] Check for duplicate name
- [ ] Add POST `/api/categories` route (admin only)
- [ ] Verify: Admin can create category

### 3.5 Backend — List Categories Endpoint
- [ ] Implement `findAll()` in CategoriesService
- [ ] Return all categories (public)
- [ ] Add GET `/api/categories` route
- [ ] Verify: Categories list returns data

### 3.6 Backend — Update Category Endpoint
- [ ] Implement `update()` in CategoriesService
- [ ] Check category exists
- [ ] Update slug if name changes
- [ ] Add PATCH `/api/categories/:id` route (admin only)
- [ ] Verify: Admin can update category

### 3.7 Backend — Delete Category Endpoint
- [ ] Implement `remove()` in CategoriesService
- [ ] Check for products in category
- [ ] Prevent delete if products exist
- [ ] Add DELETE `/api/categories/:id` route (admin only)
- [ ] Verify: Admin can delete category (if no products)

### 3.8 Backend — Products Module Structure
- [ ] Create `ProductsModule` (`src/modules/products/products.module.ts`)
- [ ] Create `ProductsService` (`src/modules/products/products.service.ts`)
- [ ] Create `ProductsController` (`src/modules/products/products.controller.ts`)
- [ ] Register ProductsModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 3.9 Backend — Products DTOs
- [ ] Create `CreateProductDto` (name, description, price, categoryId, stock)
- [ ] Create `UpdateProductDto` (all optional)
- [ ] Create `QueryProductDto` (page, limit, category, minPrice, maxPrice, sort)
- [ ] Add validation decorators
- [ ] Verify: `npm run build` compiles

### 3.10 Backend — Pagination Utility
- [ ] Create pagination helper (`src/utils/pagination.ts`)
- [ ] Accept page, limit params
- [ ] Return skip, take values
- [ ] Verify: `npm run build` compiles

### 3.11 Backend — ProductImage Model
- [ ] Add ProductImage model to schema
- [ ] Add relation to Product
- [ ] Run migration (`npx prisma migrate dev --name add-product-images`)
- [ ] Verify: `npx prisma studio` shows new table

### 3.12 Backend — Create Product Endpoint
- [ ] Implement `create()` in ProductsService
- [ ] Auto-generate slug from name
- [ ] Validate category exists
- [ ] Create product in database
- [ ] Add POST `/api/products` route (admin only)
- [ ] Verify: Admin can create product

### 3.13 Backend — List Products Endpoint
- [ ] Implement `findAll()` in ProductsService
- [ ] Add pagination (page, limit)
- [ ] Add filtering (category, price range)
- [ ] Add sorting (price, date, name)
- [ ] Include category and images in response
- [ ] Add GET `/api/products` route (public)
- [ ] Verify: Products list with filters works

### 3.14 Backend — Get Product Endpoint
- [ ] Implement `findBySlug()` in ProductsService
- [ ] Include category and images
- [ ] Add GET `/api/products/:slug` route (public)
- [ ] Verify: Single product returns correctly

### 3.15 Backend — Update Product Endpoint
- [ ] Implement `update()` in ProductsService
- [ ] Check product exists
- [ ] Validate category exists (if changing)
- [ ] Update slug if name changes
- [ ] Add PATCH `/api/products/:id` route (admin only)
- [ ] Verify: Admin can update product

### 3.16 Backend — Delete Product Endpoint
- [ ] Implement `remove()` in ProductsService
- [ ] Check product exists
- [ ] Delete product images from MinIO
- [ ] Delete product from database
- [ ] Add DELETE `/api/products/:id` route (admin only)
- [ ] Verify: Admin can delete product

### 3.17 Backend — Product Error Handling
- [ ] Return 404 for non-existent product
- [ ] Return 400 for invalid category
- [ ] Return 400 for duplicate slug
- [ ] Return 400 for negative stock/price
- [ ] Verify: All error cases handled

### 3.18 Frontend — Products API (RTK Query)
- [ ] Create productsApi (`src/services/productsApi.ts`)
- [ ] Add getProducts query (with filters)
- [ ] Add getProduct query (by slug)
- [ ] Verify: `npm run build` compiles

### 3.19 Frontend — Categories API (RTK Query)
- [ ] Create categoriesApi (`src/services/categoriesApi.ts`)
- [ ] Add getCategories query
- [ ] Verify: `npm run build` compiles

### 3.20 Frontend — ProductCard Component
- [ ] Create ProductCard (`src/components/ProductCard.tsx`)
- [ ] Display product image
- [ ] Display product name, price
- [ ] Link to product detail page
- [ ] Verify: `npm run build` compiles

### 3.21 Frontend — FilterSidebar Component
- [ ] Create FilterSidebar (`src/components/products/FilterSidebar.tsx`)
- [ ] Category filter (single-select radio, matches single `categoryId` param)
- [ ] Price range filter (min/max inputs)
- [ ] Clear filters button
- [ ] Verify: `npm run build` compiles

### 3.22 Frontend — SortSelect Component
- [ ] Create SortSelect (`src/components/products/SortSelect.tsx`)
- [ ] Options: Price Low-High, Price High-Low, Newest, Oldest
- [ ] Verify: `npm run build` compiles

### 3.23 Frontend — Pagination Component
- [ ] Create Pagination (`src/components/Pagination.tsx`)
- [ ] Previous/Next buttons
- [ ] Page numbers
- [ ] Current page highlight
- [ ] Verify: `npm run build` compiles

### 3.24 Frontend — ImageGallery Component
- [ ] Create ImageGallery (`src/components/ImageGallery.tsx`)
- [ ] Main image display
- [ ] Thumbnail navigation
- [ ] Click to select thumbnail
- [ ] Verify: `npm run build` compiles

### 3.25 Frontend — Products Page
- [ ] Create Products page (`src/pages/customer/Products.tsx`)
- [ ] Fetch products with productsApi
- [ ] Display product grid (ProductCard)
- [ ] Add FilterSidebar
- [ ] Add SortSelect
- [ ] Add Pagination
- [ ] Verify: Products page loads with data

### 3.26 Frontend — ProductDetail Page
- [ ] Create ProductDetail page (`src/pages/customer/ProductDetail.tsx`)
- [ ] Fetch product by slug
- [ ] Display ImageGallery
- [ ] Display product info (name, price, description)
- [ ] Display category
- [ ] Display stock status
- [ ] Add to Cart button
- [ ] Verify: Product detail page loads correctly

### 3.27 Frontend — Admin Product API (RTK Query)
- [ ] Add createProduct mutation to adminApi
- [ ] Add updateProduct mutation to adminApi
- [ ] Add deleteProduct mutation to adminApi
- [ ] Verify: `npm run build` compiles

### 3.28 Frontend — Admin Category API (RTK Query)
- [ ] Add createCategory mutation to adminApi
- [ ] Add updateCategory mutation to adminApi
- [ ] Add deleteCategory mutation to adminApi
- [ ] Verify: `npm run build` compiles

### 3.29 Frontend — Admin ProductTable Component
- [ ] Create ProductTable (`src/components/admin/ProductTable.tsx`)
- [ ] Display product name, price, stock, category
- [ ] Edit button
- [ ] Delete button
- [ ] Verify: `npm run build` compiles

### 3.30 Frontend — Admin ProductList Page
- [ ] Create ProductList page (`src/pages/admin/products/ProductList.tsx`)
- [ ] Fetch products with adminApi
- [ ] Display ProductTable
- [ ] Add "Create Product" button
- [ ] Verify: `npm run build` compiles

### 3.31 Frontend — Admin ProductForm Page
- [ ] Create ProductForm page (`src/pages/admin/products/ProductForm.tsx`)
- [ ] Form fields: name, description, price, categoryId, stock
- [ ] Image upload component
- [ ] Submit to create/update API
- [ ] Pre-fill form for edit mode
- [ ] Verify: `npm run build` compiles

### 3.32 Frontend — Admin CategoryList Page
- [ ] Create CategoryList page (`src/pages/admin/categories/CategoryList.tsx`)
- [ ] Fetch categories with adminApi
- [ ] Display category table
- [ ] Add "Create Category" button
- [ ] Verify: `npm run build` compiles

### 3.33 Frontend — Admin CategoryForm Page
- [ ] Create CategoryForm page (`src/pages/admin/categories/CategoryForm.tsx`)
- [ ] Form fields: name, description
- [ ] Submit to create/update API
- [ ] Pre-fill form for edit mode
- [ ] Verify: `npm run build` compiles

### 3.34 Phase 3 — Full Verification
- [ ] Admin can create category
- [ ] Admin can edit category
- [ ] Admin can delete category (if no products)
- [ ] Admin can create product
- [ ] Admin can edit product
- [ ] Admin can delete product
- [ ] Customer can browse products
- [ ] Customer can filter products
- [ ] Customer can sort products
- [ ] Customer can view product detail
- [ ] Product images display correctly

---

## Phase 4: File Upload Enhancements (Thumbnails + Validation)

**Duration:** 1 day

### 4.1 Backend — Upload Interceptor
- [ ] Create file interceptor (`src/modules/files/interceptors/file.interceptor.ts`)
- [ ] Configure file size limit (5MB)
- [ ] Configure allowed MIME types
- [ ] Verify: `npm run build` compiles

### 4.2 Backend — Image Filter
- [ ] Create image filter (`src/modules/files/filters/image.filter.ts`)
- [ ] Allow only image MIME types (jpg, jpeg, png, webp)
- [ ] Reject non-image files
- [ ] Verify: `npm run build` compiles

### 4.3 Backend — Thumbnail Service
- [ ] Create thumbnail service (`src/modules/minio/thumbnail.service.ts`)
- [ ] Generate thumbnails on upload:
  - Products: 200x200, 500x500
  - Avatars: 100x100
  - Categories: 300x300
  - Reviews: 200x200
- [ ] Save thumbnails to MinIO
- [ ] Return thumbnail URLs
- [ ] Verify: `npm run build` compiles

### 4.4 Backend — Multer Config
- [ ] Create multer config (`src/config/multer.config.ts`)
- [ ] Configure storage
- [ ] Configure file filter
- [ ] Configure limits
- [ ] Verify: `npm run build` compiles

### 4.5 Backend — Enhanced Upload Endpoint
- [ ] Update upload endpoint to use interceptor
- [ ] Apply image filter
- [ ] Generate thumbnails based on entity type
- [ ] Save both original and thumbnails
- [ ] Verify: Upload generates thumbnails

### 4.6 Backend — Multiple Upload Endpoint
- [ ] Implement POST `/api/files/upload/multiple` endpoint
- [ ] Accept max 5 files
- [ ] Validate each file (5MB limit, image types)
- [ ] Return array of uploaded files
- [ ] Verify: Multiple file upload works

### 4.7 Backend — File Validation
- [ ] Validate file size on upload
- [ ] Validate MIME type on upload
- [ ] Return meaningful error messages
- [ ] Verify: Invalid files rejected with clear error

### 4.8 Frontend — Files API (RTK Query)
- [ ] Create filesApi (`src/services/filesApi.ts`)
- [ ] Add uploadFile mutation
- [ ] Add uploadMultiple mutation
- [ ] Add getFiles query
- [ ] Add deleteFile mutation
- [ ] Verify: `npm run build` compiles

### 4.9 Frontend — useUpload Hook
- [ ] Create useUpload hook (`src/hooks/useUpload.ts`)
- [ ] Manage upload state (loading, progress, error)
- [ ] Handle file selection
- [ ] Handle upload to API
- [ ] Handle error states
- [ ] Verify: `npm run build` compiles

### 4.10 Frontend — SingleUpload Component
- [ ] Create SingleUpload (`src/components/file-upload/SingleUpload.tsx`)
- [ ] Drag & drop area
- [ ] Click to browse
- [ ] Image preview
- [ ] Upload progress indicator
- [ ] Remove button
- [ ] Verify: `npm run build` compiles

### 4.11 Frontend — MultiUpload Component
- [ ] Create MultiUpload (`src/components/file-upload/MultiUpload.tsx`)
- [ ] Multiple file selection (max 5)
- [ ] Grid preview of selected files
- [ ] Individual remove buttons
- [ ] Upload all button
- [ ] Verify: `npm run build` compiles

### 4.12 Frontend — FileUpload Wrapper Component
- [ ] Create FileUpload (`src/components/FileUpload.tsx`)
- [ ] Wrap SingleUpload and MultiUpload
- [ ] Accept mode prop (single/multi)
- [ ] Verify: `npm run build` compiles

### 4.13 Phase 4 — Full Verification
- [ ] Single file upload works
- [ ] Multi file upload works
- [ ] Thumbnails auto-generate (correct sizes per entity type)
- [ ] File size limit enforced (5MB)
- [ ] Invalid file types rejected (only jpg, jpeg, png, webp)
- [ ] Drag & drop works
- [ ] Upload progress shows
- [ ] Error messages display

---

## Phase 5: Cart Functionality

**Duration:** 1-2 days

### 5.1 Backend — Cart Module Structure
- [ ] Create `CartModule` (`src/modules/cart/cart.module.ts`)
- [ ] Create `CartService` (`src/modules/cart/cart.service.ts`)
- [ ] Create `CartController` (`src/modules/cart/cart.controller.ts`)
- [ ] Register CartModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 5.2 Backend — Cart DTOs
- [ ] Create `AddToCartDto` (productId, quantity)
- [ ] Create `UpdateCartDto` (quantity)
- [ ] Add validation decorators
- [ ] Verify: `npm run build` compiles

### 5.3 Backend — CartItem Model
- [ ] Add CartItem model to schema
- [ ] Add relations to User and Product
- [ ] Run migration (`npx prisma migrate dev --name add-cart`)
- [ ] Verify: `npx prisma studio` shows new table

### 5.4 Backend — Add to Cart Endpoint
- [ ] Implement `addToCart()` in CartService
- [ ] Check product exists and has stock
- [ ] Check if item already in cart (increment quantity)
- [ ] Create new cart item if not exists
- [ ] Add POST `/api/cart` route (protected)
- [ ] Verify: Add to cart works

### 5.5 Backend — Get Cart Endpoint
- [ ] Implement `getCart()` in CartService
- [ ] Return cart items with product details
- [ ] Calculate subtotal per item
- [ ] Calculate total
- [ ] Add GET `/api/cart` route (protected)
- [ ] Verify: Get cart returns correct data

### 5.6 Backend — Update Cart Endpoint
- [ ] Implement `updateCartItem()` in CartService
- [ ] Validate new quantity
- [ ] Check stock availability
- [ ] Update quantity
- [ ] Add PATCH `/api/cart/:id` route (protected)
- [ ] Verify: Update quantity works

### 5.7 Backend — Remove from Cart Endpoint
- [ ] Implement `removeFromCart()` in CartService
- [ ] Delete cart item
- [ ] Add DELETE `/api/cart/:id` route (protected)
- [ ] Verify: Remove from cart works

### 5.8 Backend — Cart Validation
- [ ] Prevent adding out-of-stock product
- [ ] Prevent quantity exceeding stock
- [ ] Return appropriate error messages
- [ ] Verify: Stock validation works

### 5.9 Frontend — Cart API (RTK Query)
- [ ] Create cartApi (`src/services/cartApi.ts`)
- [ ] Add addToCart mutation
- [ ] Add getCart query
- [ ] Add updateCart mutation
- [ ] Add removeFromCart mutation
- [ ] Verify: `npm run build` compiles

### 5.10 Frontend — Cart Slice
- [ ] Create cart slice (`src/store/slices/cartSlice.ts`)
- [ ] Add cartCount state
- [ ] Add updateCartCount action
- [ ] Sync with localStorage
- [ ] Verify: `npm run build` compiles

### 5.11 Frontend — QuantitySelector Component
- [ ] Create QuantitySelector (`src/components/QuantitySelector.tsx`)
- [ ] Decrease button
- [ ] Quantity display
- [ ] Increase button
- [ ] Min/max limits
- [ ] Verify: `npm run build` compiles

### 5.12 Frontend — CartItem Component
- [ ] Create CartItem (`src/components/cart/CartItem.tsx`)
- [ ] Display product image
- [ ] Display product name
- [ ] Display unit price
- [ ] QuantitySelector
- [ ] Line total
- [ ] Remove button
- [ ] Verify: `npm run build` compiles

### 5.13 Frontend — OrderSummary Component
- [ ] Create OrderSummary (`src/components/cart/OrderSummary.tsx`)
- [ ] Display subtotal
- [ ] Display shipping (flat rate)
- [ ] Display tax
- [ ] Display total
- [ ] Checkout button
- [ ] Verify: `npm run build` compiles

### 5.14 Frontend — Cart Page
- [ ] Create Cart page (`src/pages/customer/Cart.tsx`)
- [ ] Fetch cart with cartApi
- [ ] Display list of CartItems
- [ ] Display OrderSummary
- [ ] Empty cart message
- [ ] Verify: Cart page loads correctly

### 5.15 Frontend — CartDrawer Component
- [ ] Create CartDrawer (`src/components/cart/CartDrawer.tsx`)
- [ ] Cart icon trigger with count badge
- [ ] Slide-out drawer (single cart surface — no hover MiniCart)
- [ ] Item list (name, qty, price)
- [ ] OrderSummary (subtotal/shipping/tax/total from `GET /api/cart`)
- [ ] View Cart link
- [ ] Verify: `npm run build` compiles

### 5.16 Frontend — Header Integration
- [ ] Add CartDrawer trigger to Header
- [ ] Update cart count on add/remove
- [ ] Verify: Cart count updates in real-time

### 5.17 Phase 5 — Full Verification
- [ ] Add to cart from product page
- [ ] Cart count updates in header
- [ ] Cart page shows all items
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Cart totals calculate correctly
- [ ] Stock validation prevents overselling
- [ ] Cart persists across refreshes

---

## Phase 6: Checkout + Stripe

**Duration:** 2-3 days

### 6.1 Backend — Stripe Module Structure
- [ ] Create `StripeModule` (`src/modules/stripe/stripe.module.ts`)
- [ ] Create `StripeService` (`src/modules/stripe/stripe.service.ts`)
- [ ] Configure Stripe with secret key
- [ ] Register StripeModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 6.2 Backend — Stripe Service
- [ ] Implement `createCheckoutSession(orderId)` against an existing `PENDING` order (order-first: order was created first by `POST /api/orders`)
- [ ] Configure session from order fields (amount from order `total`, no cart re-derivation)
- [ ] Configure success URL with `{CHECKOUT_SESSION_ID}` and cancel URL
- [ ] Attach `orderId` to the session (client_reference_id/metadata)
- [ ] Return `{ orderId, sessionId, url }`
- [ ] Verify: `npm run build` compiles

### 6.3 Backend — Checkout Module Structure
- [ ] Create `CheckoutModule` (`src/modules/checkout/checkout.module.ts`)
- [ ] Create `CheckoutService` (`src/modules/checkout/checkout.service.ts`)
- [ ] Create `CheckoutController` (`src/modules/checkout/checkout.controller.ts`)
- [ ] Register CheckoutModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 6.4 Backend — Order Models
- [ ] Add Order model to schema (id, userId, status, total, shipping, tax, stripeSessionId?, shippingAddress Json)
- [ ] Add OrderItem model to schema (orderId, productId, quantity, price — price snapshot at creation)
- [ ] Add Payment model to schema
- [ ] Add relations
- [ ] Add shipping/tax Decimal fields to Order (pricing rule: flat $5, free ≥$100; tax 8.25%; snapshot at creation)
- [ ] Run migration (`npx prisma migrate dev --name add-orders`)
- [ ] Verify: `npx prisma studio` shows new tables

### 6.5 Backend — Order-First Checkout
- [ ] Implement `POST /api/orders` — creates order as `PENDING` from the user's cart, storing `shipping`, `tax`, `total`, `shippingAddress` (per `system-design.md` §3.4)
- [ ] Validate cart is not empty, items in stock before creating order
- [ ] Implement `POST /api/checkout/create-session` — accepts `{ orderId }`, verifies order is the user's own `PENDING`, calls Stripe service, returns `data.url`
- [ ] Add routes (protected)
- [ ] Verify: `POST /api/orders` + `create-session` produce a Stripe checkout URL

### 6.6 Backend — Stripe Webhook Handler
- [ ] Implement webhook handler in CheckoutController
- [ ] Verify webhook signature
- [ ] Handle `checkout.session.completed` event
- [ ] Resolve the order via `orderId` (client_reference_id/metadata) — do **not** create a new order
- [ ] Flip order status `PENDING → PAID`
- [ ] Create payment record
- [ ] Decrement product stock
- [ ] Clear user cart
- [ ] Add POST `/api/webhook/stripe` route
- [ ] Verify: Webhook processes correctly

### 6.7 Backend — Checkout Validation
- [ ] Validate order exists and belongs to the user
- [ ] Validate order status is `PENDING` (reject already-paid/cancelled)
- [ ] Validate order total > 0
- [ ] Return meaningful errors
- [ ] Verify: Validation works

### 6.8 Frontend — Checkout API (RTK Query)
- [ ] Create checkoutApi (`src/services/checkoutApi.ts`)
- [ ] Add createOrder mutation (`POST /api/orders`)
- [ ] Add createSession mutation (`POST /api/checkout/create-session`)
- [ ] Verify: `npm run build` compiles

### 6.9 Frontend — Card Redirect (Stripe Hosted Checkout)
- [ ] On `[Pay]`: `POST /api/orders` → `POST /api/checkout/create-session` → `window.location = data.url` (redirect, no Stripe Elements/Card Element on our page)
- [ ] Define success URL `/order/success?session_id={CHECKOUT_SESSION_ID}` and cancel URL `/cart`
- [ ] Verify: `npm run build` compiles

### 6.10 Frontend — AddressForm Component
- [ ] Create AddressForm (`src/components/checkout/AddressForm.tsx`)
- [ ] Form fields: line1, line2 (optional), city, state, zip, country
- [ ] Saved-address preselect (`label`, `isDefault`) + "+ New address"
- [ ] Form validation
- [ ] Verify: `npm run build` compiles

### 6.11 Frontend — Payment Form (Stripe Hosted Checkout)
- [ ] Radio: Credit/Debit Card (Stripe secure checkout) — hosted, no card fields on our page
- [ ] `[Pay $..]` button with double-submit lock
- [ ] Error handling: `422 PAYMENT_FAILED` → error state with retry
- [ ] Verify: `npm run build` compiles

### 6.12 Frontend — Checkout OrderSummary Component
- [ ] Create OrderSummary (`src/components/checkout/OrderSummary.tsx`)
- [ ] Display cart items
- [ ] Display subtotal, shipping, tax, total (from `GET /api/cart`, never computed client-side)
- [ ] Verify: `npm run build` compiles

### 6.13 Frontend — Checkout Page
- [ ] Create Checkout page (`src/pages/customer/Checkout.tsx`)
- [ ] Step 1: Shipping address (AddressForm)
- [ ] Step 2: Review & Pay (OrderSummary + Payment)
- [ ] Submit: create order → create session → redirect to Stripe
- [ ] Verify: Checkout flow works

### 6.14 Frontend — OrderConfirmation Page
- [ ] Create OrderConfirmation page (`src/pages/customer/OrderConfirmation.tsx`)
- [ ] Resolve the order via `?session_id` (+ `orderId` from create-session response) → `GET /api/orders/:id` (owner-gated)
- [ ] Display success message
- [ ] Display order number
- [ ] Display order summary (authoritative snapshot: total, shipping, tax)
- [ ] Continue shopping button
- [ ] Verify: Confirmation page displays

### 6.15 Phase 6 — Full Verification
- [ ] Complete checkout flow works (order-first: POST /api/orders → create-session → Stripe redirect)
- [ ] Stripe test card succeeds (4242...)
- [ ] Failed card shows error
- [ ] Order created in database as `PENDING` before redirect, flipped to `PAID` by webhook
- [ ] Payment record created
- [ ] Stock decremented
- [ ] Cart cleared after purchase
- [ ] Confirmation page displays verified order
- [ ] Order not found / not PENDING on create-session → `400`

---

## Phase 7: Orders + Profile

**Duration:** 2 days

### 7.1 Backend — Orders Module Structure
- [ ] Create `OrdersModule` (`src/modules/orders/orders.module.ts`)
- [ ] Create `OrdersService` (`src/modules/orders/orders.service.ts`)
- [ ] Create `OrdersController` (`src/modules/orders/orders.controller.ts`)
- [ ] Register OrdersModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 7.2 Backend — Orders DTOs
- [ ] Create `UpdateOrderStatusDto` (status)
- [ ] Add validation decorators
- [ ] Verify: `npm run build` compiles

### 7.3 Backend — List Orders Endpoint
- [ ] Implement `findAll()` in OrdersService
- [ ] Filter by current user
- [ ] Include order items
- [ ] Add pagination
- [ ] Add GET `/api/orders` route (protected)
- [ ] Verify: User can list their orders

### 7.4 Backend — Get Order Endpoint
- [ ] Implement `findOne()` in OrdersService
- [ ] Include order items and payment
- [ ] Verify user owns the order
- [ ] Add GET `/api/orders/:id` route (protected)
- [ ] Verify: User can get order detail

### 7.5 Backend — Admin Update Order Status Endpoint
- [ ] Implement `updateStatus()` in OrdersService
- [ ] Validate status is valid enum
- [ ] Update order status
- [ ] Add PATCH `/api/admin/orders/:id/status` route (admin only)
- [ ] Verify: Admin can update order status

### 7.6 Backend — Address Model
- [ ] Add Address model to schema
- [ ] Add relation to User
- [ ] Run migration (`npx prisma migrate dev --name add-addresses`)
- [ ] Verify: `npx prisma studio` shows new table

### 7.7 Backend — Profile Endpoints
- [ ] Implement `getProfile()` in UsersService
- [ ] Implement `updateProfile()` in UsersService
- [ ] Add GET `/api/users/me` route (protected)
- [ ] Add PATCH `/api/users/me` route (protected)
- [ ] Verify: Profile get/update works

### 7.8 Backend — Address Endpoints
- [ ] Implement `createAddress()` in UsersService
- [ ] Implement `updateAddress()` in UsersService
- [ ] Implement `deleteAddress()` in UsersService
- [ ] Implement `getAddresses()` in UsersService
- [ ] Add address routes (protected)
- [ ] Verify: Address CRUD works

### 7.9 Frontend — Orders API (RTK Query)
- [ ] Create ordersApi (`src/services/ordersApi.ts`)
- [ ] Add getOrders query
- [ ] Add getOrder query
- [ ] Verify: `npm run build` compiles

### 7.10 Frontend — Users API (RTK Query)
- [ ] Create usersApi (`src/services/usersApi.ts`)
- [ ] Add getProfile query
- [ ] Add updateProfile mutation
- [ ] Add getAddresses query
- [ ] Add createAddress mutation
- [ ] Add updateAddress mutation
- [ ] Add deleteAddress mutation
- [ ] Verify: `npm run build` compiles

### 7.11 Frontend — OrderStatusBadge Component
- [ ] Create OrderStatusBadge (`src/components/orders/OrderStatusBadge.tsx`)
- [ ] Color-coded status (pending=yellow, paid=green, shipped=blue, delivered=green, cancelled=red)
- [ ] Verify: `npm run build` compiles

### 7.12 Frontend — OrderList Component
- [ ] Create OrderList (`src/components/orders/OrderList.tsx`)
- [ ] Display order number, date, total, status
- [ ] Link to order detail
- [ ] Verify: `npm run build` compiles

### 7.13 Frontend — OrderDetail Component
- [ ] Create OrderDetail (`src/components/orders/OrderDetail.tsx`)
- [ ] Display order items
- [ ] Display shipping address
- [ ] Display payment info
- [ ] Display order status
- [ ] Verify: `npm run build` compiles

### 7.14 Frontend — Orders Page
- [ ] Create Orders page (`src/pages/customer/Orders.tsx`)
- [ ] Fetch orders with ordersApi
- [ ] Display OrderList
- [ ] Empty orders message
- [ ] Verify: Orders page loads

### 7.15 Frontend — OrderDetail Page
- [ ] Create OrderDetail page (`src/pages/customer/OrderDetail.tsx`)
- [ ] Fetch order by ID
- [ ] Display OrderDetail component
- [ ] Verify: Order detail page loads

### 7.16 Frontend — UserInfo Component
- [ ] Create UserInfo (`src/components/profile/UserInfo.tsx`)
- [ ] Display user info (name, email)
- [ ] Edit button
- [ ] Verify: `npm run build` compiles

### 7.17 Frontend — AddressList Component
- [ ] Create AddressList (`src/components/profile/AddressList.tsx`)
- [ ] Display list of addresses
- [ ] Edit button per address
- [ ] Delete button per address
- [ ] Add address button
- [ ] Verify: `npm run build` compiles

### 7.18 Frontend — AddressForm Component
- [ ] Create AddressForm (`src/components/profile/AddressForm.tsx`)
- [ ] Form fields: line1, line2, city, state, zip, country
- [ ] Form validation
- [ ] Submit to create/update API
- [ ] Verify: `npm run build` compiles

### 7.19 Frontend — PasswordForm Component
- [ ] Create PasswordForm (`src/components/profile/PasswordForm.tsx`)
- [ ] Current password field
- [ ] New password field
- [ ] Confirm password field
- [ ] Submit to change password API
- [ ] Verify: `npm run build` compiles

### 7.20 Frontend — Profile Page
- [ ] Create Profile page (`src/pages/customer/Profile.tsx`)
- [ ] Display UserInfo
- [ ] Display AddressList
- [ ] Display PasswordForm
- [ ] Verify: Profile page loads

### 7.21 Phase 7 — Full Verification
- [ ] Order history displays correctly
- [ ] Order detail shows all info
- [ ] Admin can update order status
- [ ] Profile displays correctly
- [ ] Profile edit works
- [ ] Address CRUD works
- [ ] Password change works

---

## Phase 8: Reviews (with images)

**Duration:** 1 day

### 8.1 Backend — Reviews Module Structure
- [ ] Create `ReviewsModule` (`src/modules/reviews/reviews.module.ts`)
- [ ] Create `ReviewsService` (`src/modules/reviews/reviews.service.ts`)
- [ ] Create `ReviewsController` (`src/modules/reviews/reviews.controller.ts`)
- [ ] Register ReviewsModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 8.2 Backend — Reviews DTOs
- [ ] Create `CreateReviewDto` (rating, comment, imageIds)
- [ ] Add validation (rating 1-5, required fields)
- [ ] Verify: `npm run build` compiles

### 8.3 Backend — ReviewImage Model
- [ ] Add ReviewImage model to schema
- [ ] Add relation to Review
- [ ] Run migration (`npx prisma migrate dev --name add-reviews`)
- [ ] Verify: `npx prisma studio` shows new table

### 8.4 Backend — Create Review Endpoint
- [ ] Implement `create()` in ReviewsService
- [ ] Verify user purchased the product
- [ ] Prevent duplicate reviews
- [ ] Create review in database
- [ ] Add POST `/api/products/:id/reviews` route (protected)
- [ ] Verify: Create review works

### 8.5 Backend — List Reviews Endpoint
- [ ] Implement `findAll()` in ReviewsService
- [ ] Filter by product ID
- [ ] Include images
- [ ] Include user info (name only)
- [ ] Add GET `/api/products/:id/reviews` route (public)
- [ ] Verify: List reviews works

### 8.6 Backend — Delete Review Endpoint
- [ ] Implement `remove()` in ReviewsService
- [ ] Verify user owns the review
- [ ] Delete review images from MinIO
- [ ] Delete review from database
- [ ] Add DELETE `/api/reviews/:id` route (protected)
- [ ] Verify: Delete own review works

### 8.7 Backend — Review Validation
- [ ] Verify user purchased product before reviewing
- [ ] Prevent duplicate reviews per user per product
- [ ] Validate rating is 1-5
- [ ] Verify: Validation works

### 8.8 Frontend — Reviews API (RTK Query)
- [ ] Create reviewsApi (`src/services/reviewsApi.ts`)
- [ ] Add getReviews query
- [ ] Add createReview mutation
- [ ] Add deleteReview mutation
- [ ] Verify: `npm run build` compiles

### 8.9 Frontend — StarRating Component
- [ ] Create StarRating (`src/components/reviews/StarRating.tsx`)
- [ ] Display 5 stars
- [ ] Interactive hover
- [ ] Click to select rating
- [ ] Read-only mode
- [ ] Verify: `npm run build` compiles

### 8.10 Frontend — ReviewCard Component
- [ ] Create ReviewCard (`src/components/reviews/ReviewCard.tsx`)
- [ ] Display user name
- [ ] Display StarRating
- [ ] Display title and comment
- [ ] Display date
- [ ] Delete button (own reviews only)
- [ ] Verify: `npm run build` compiles

### 8.11 Frontend — ReviewImages Component
- [ ] Create ReviewImages (`src/components/reviews/ReviewImages.tsx`)
- [ ] Display review images in grid
- [ ] Click to enlarge (modal)
- [ ] Verify: `npm run build` compiles

### 8.12 Frontend — ReviewForm Component
- [ ] Create ReviewForm (`src/components/reviews/ReviewForm.tsx`)
- [ ] StarRating selector
- [ ] Title input
- [ ] Comment textarea
- [ ] Image upload (optional)
- [ ] Submit button
- [ ] Verify: `npm run build` compiles

### 8.13 Frontend — ReviewList Component
- [ ] Create ReviewList (`src/components/reviews/ReviewList.tsx`)
- [ ] Display list of ReviewCards
- [ ] Empty reviews message
- [ ] Verify: `npm run build` compiles

### 8.14 Frontend — ReviewSection Component
- [ ] Create ReviewSection (`src/components/reviews/ReviewSection.tsx`)
- [ ] Average rating display
- [ ] ReviewForm (if eligible)
- [ ] ReviewList
- [ ] Verify: `npm run build` compiles

### 8.15 Frontend — Integrate Reviews in ProductDetail
- [ ] Add ReviewSection to ProductDetail page
- [ ] Fetch reviews for product
- [ ] Verify: Reviews show on product page

### 8.16 Phase 8 — Full Verification
- [ ] Create review works
- [ ] Review displays on product page
- [ ] Star rating is interactive
- [ ] Only own reviews can be deleted
- [ ] Review images display
- [ ] Cannot review same product twice
- [ ] Must have purchased to review

---

## Phase 9: Admin Dashboard

**Duration:** 2-3 days

### 9.1 Backend — Admin Module Structure
- [ ] Create `AdminModule` (`src/modules/admin/admin.module.ts`)
- [ ] Create `AdminService` (`src/modules/admin/admin.service.ts`)
- [ ] Create `AdminController` (`src/modules/admin/admin.controller.ts`)
- [ ] Register AdminModule in `AppModule`
- [ ] Verify: `npm run build` compiles

### 9.2 Backend — Admin Stats Endpoint
- [ ] Implement `getStats()` in AdminService
- [ ] Count total users
- [ ] Count total products
- [ ] Count total orders
- [ ] Calculate total revenue
- [ ] Count new users this week
- [ ] Count orders this week
- [ ] Count low stock products (stock <= 5)
- [ ] Get recent orders (last 10)
- [ ] Calculate sales by day (revenue per day)
- [ ] Add GET `/api/admin/stats` route (admin only)
- [ ] Verify: Stats endpoint returns all fields

### 9.3 Backend — Admin Orders Endpoint
- [ ] Implement `getAllOrders()` in AdminService
- [ ] Include user info
- [ ] Include order items
- [ ] Add pagination (page, limit)
- [ ] Add filters: status, dateFrom, dateTo (ISO dates)
- [ ] Add GET `/api/admin/orders` route (admin only)
- [ ] Verify: Admin can list all orders with filters

### 9.4 Backend — Admin Products Endpoint
- [ ] Implement `getAllProducts()` in AdminService
- [ ] Include category
- [ ] Include images
- [ ] Add pagination (page, limit)
- [ ] Add filters: search (by name), categoryId, stock ("in_stock" | "out_of_stock" | "low")
- [ ] Add GET `/api/admin/products` route (admin only)
- [ ] Verify: Admin can list all products with filters

### 9.5 Frontend — Admin API Updates
- [ ] Add getStats query to adminApi
- [ ] Add getAllOrders query to adminApi (with status, dateFrom, dateTo filters)
- [ ] Add getAllProducts query to adminApi (with search, categoryId, stock filters)
- [ ] Verify: `npm run build` compiles

### 9.6 Frontend — StatsCards Component
- [ ] Create StatsCards (`src/components/admin/StatsCards.tsx`)
- [ ] Total Users card
- [ ] Total Products card
- [ ] Total Orders card
- [ ] Total Revenue card
- [ ] Verify: `npm run build` compiles

### 9.7 Frontend — SalesChart Component
- [ ] Create SalesChart (`src/components/admin/SalesChart.tsx`)
- [ ] Install `recharts`
- [ ] Line chart for revenue over time
- [ ] Responsive container
- [ ] Verify: `npm run build` compiles

### 9.8 Frontend — RecentOrders Component
- [ ] Create RecentOrders (`src/components/admin/RecentOrders.tsx`)
- [ ] Display last 10 orders
- [ ] Order number, customer, total, status
- [ ] Link to order detail
- [ ] Verify: `npm run build` compiles

### 9.9 Frontend — Dashboard Page
- [ ] Create Dashboard page (`src/pages/admin/Dashboard.tsx`)
- [ ] Fetch stats with adminApi
- [ ] Display StatsCards
- [ ] Display SalesChart
- [ ] Display RecentOrders
- [ ] Verify: Dashboard page loads

### 9.10 Frontend — Admin OrderTable Component
- [ ] Create OrderTable (`src/components/admin/OrderTable.tsx`)
- [ ] Display all order columns
- [ ] Status filter
- [ ] Link to order detail
- [ ] Verify: `npm run build` compiles

### 9.11 Frontend — Admin OrderList Page
- [ ] Create OrderList page (`src/pages/admin/orders/OrderList.tsx`)
- [ ] Fetch orders with adminApi
- [ ] Display OrderTable
- [ ] Add pagination
- [ ] Verify: Order list page loads

### 9.12 Frontend — Admin Order Status Update
- [ ] Add status update to order detail
- [ ] Dropdown for status selection
- [ ] Call updateStatus API
- [ ] Verify: Status update works

### 9.13 Phase 9 — Full Verification
- [ ] Dashboard shows correct stats (all fields)
- [ ] Charts render with data
- [ ] Recent orders display
- [ ] Admin order list works with filters (status, date range)
- [ ] Admin product list works with filters (search, category, stock)
- [ ] Admin can update order status
- [ ] All admin pages responsive

---

## Phase 10: Polish + Responsive

**Duration:** 2-3 days

### 10.1 Frontend — Header Component
- [ ] Create Header (`src/components/layout/Header.tsx`)
- [ ] Logo
- [ ] Navigation links
- [ ] Search bar
- [ ] User menu (login/register or profile/logout)
- [ ] Cart Drawer trigger (opens CartDrawer)
- [ ] Verify: `npm run build` compiles

### 10.2 Frontend — Footer Component
- [ ] Create Footer (`src/components/layout/Footer.tsx`)
- [ ] Company info
- [ ] Quick links
- [ ] Social media links
- [ ] Copyright
- [ ] Verify: `npm run build` compiles

### 10.3 Frontend — MobileMenu Component
- [ ] Create MobileMenu (`src/components/layout/MobileMenu.tsx`)
- [ ] Hamburger button
- [ ] Slide-out menu
- [ ] Navigation links
- [ ] Close button
- [ ] Verify: `npm run build` compiles

### 10.4 Frontend — SearchBar Component
- [ ] Create SearchBar (`src/components/SearchBar.tsx`)
- [ ] Search input
- [ ] Search icon
- [ ] Debounced search
- [ ] Redirect to products page with query
- [ ] Verify: `npm run build` compiles

### 10.5 Frontend — Skeleton Component
- [ ] Create Skeleton (`src/components/ui/Skeleton.tsx`)
- [ ] Animated placeholder
- [ ] Multiple variants (text, card, image)
- [ ] Verify: `npm run build` compiles

### 10.6 Frontend — Spinner Component
- [ ] Create Spinner (`src/components/ui/Spinner.tsx`)
- [ ] Loading animation
- [ ] Size variants
- [ ] Verify: `npm run build` compiles

### 10.7 Frontend — ErrorBoundary Component
- [ ] Create ErrorBoundary (`src/components/ErrorBoundary.tsx`)
- [ ] Catch rendering errors
- [ ] Display fallback UI
- [ ] Retry button
- [ ] Verify: `npm run build` compiles

### 10.8 Frontend — Toast Component
- [ ] Create Toast (`src/components/ui/Toast.tsx`)
- [ ] Success toast (green)
- [ ] Error toast (red)
- [ ] Info toast (blue)
- [ ] Auto-dismiss
- [ ] Manual dismiss
- [ ] Verify: `npm run build` compiles

### 10.9 Frontend — Loading States
- [ ] Add Skeleton to product list page
- [ ] Add Skeleton to product detail page
- [ ] Add Spinner to form submissions
- [ ] Add Spinner to page transitions
- [ ] Verify: Loading states display correctly

### 10.10 Frontend — Error Handling
- [ ] Add ErrorBoundary to App
- [ ] Add error toasts for API failures
- [ ] Add 404 page
- [ ] Verify: Error handling works

### 10.11 Frontend — Responsive Header
- [ ] Mobile: hamburger menu
- [ ] Tablet: condensed nav
- [ ] Desktop: full nav
- [ ] Verify: Header responsive

### 10.12 Frontend — Responsive Product Grid
- [ ] Mobile: 1 column
- [ ] Tablet: 2 columns
- [ ] Desktop: 3-4 columns
- [ ] Verify: Grid responsive

### 10.13 Frontend — Responsive Cart
- [ ] Mobile: full width items
- [ ] Tablet: side by side
- [ ] Desktop: standard layout
- [ ] Verify: Cart responsive

### 10.14 Frontend — Responsive Admin
- [ ] Mobile: collapsible sidebar
- [ ] Tablet: narrow sidebar
- [ ] Desktop: full sidebar
- [ ] Verify: Admin responsive

### 10.15 Frontend — 404 Page
- [ ] Create NotFound page (`src/pages/NotFound.tsx`)
- [ ] Display 404 message
- [ ] Link to home
- [ ] Verify: 404 page works

### 10.16 Frontend — SEO Metadata
- [ ] Add title to index.html
- [ ] Add meta description
- [ ] Add Open Graph tags
- [ ] Verify: SEO metadata present

### 10.17 Documentation
- [ ] Create `frontend/.env.example`
- [ ] Create `backend/.env.example`
- [ ] Create `frontend/README.md` with setup instructions
- [ ] Create `backend/README.md` with setup instructions
- [ ] Verify: Documentation complete

### 10.18 Phase 10 — Full Verification
- [ ] All pages responsive (375px, 768px, 1280px)
- [ ] Loading states work
- [ ] Error handling works
- [ ] Toast notifications work
- [ ] 404 page works
- [ ] No console errors
- [ ] App is production-ready

---

## Final Project Verification

- [ ] Backend compiles without errors
- [ ] Frontend compiles without errors
- [ ] Database migrations applied
- [ ] Seed data present
- [ ] All API endpoints tested
- [ ] All frontend pages tested
- [ ] Auth flow complete
- [ ] Product catalog works
- [ ] Cart functionality works
- [ ] Checkout flow works
- [ ] Order management works
- [ ] Admin dashboard works
- [ ] Reviews system works
- [ ] File upload works
- [ ] Responsive design works
- [ ] Error handling works
- [ ] Loading states work
- [ ] Toast notifications work
