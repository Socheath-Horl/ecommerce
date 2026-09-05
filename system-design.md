# E-Commerce System Design (Detailed)

---

## 1. User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **GUEST** | Not logged in | Browse products, view details |
| **CUSTOMER** | Logged in shopper | All guest + cart, checkout, orders, reviews, profile |
| **USER** | Admin portal staff | Dashboard, products, orders, categories (limited) |
| **ADMIN** | Full admin | All user + manage users, full access |

### Role Hierarchy
```
GUEST → CUSTOMER → USER → ADMIN
```

---

## 2. Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(CUSTOMER)
  avatarId  String?
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  avatar     File?    @relation(fields: [avatarId], references: [id])
  cartItems  CartItem[]
  orders     Order[]
  reviews    Review[]
  addresses  Address[]
  files      File[]
}

enum Role {
  GUEST      // Not logged in
  CUSTOMER   // Logged in - can shop, checkout, review
  USER       // Admin portal - limited admin access
  ADMIN      // Full admin - can manage users
}

model Category {
  id       String    @id @default(uuid())
  name     String    @unique
  slug     String    @unique
  imageId  String?
  products Product[]

  image File? @relation(fields: [imageId], references: [id])
}

model Product {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String
  price       Decimal
  stock       Int      @default(0)
  categoryId  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category    Category     @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
  reviews     Review[]
}

model ProductImage {
  id        String  @id @default(uuid())
  productId String
  fileId    String
  order     Int     @default(0)

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  file    File    @relation(fields: [fileId], references: [id])

  @@unique([productId, fileId])
}

model File {
  id          String   @id @default(uuid())
  userId      String?
  originalName String
  fileName    String
  mimeType    String
  size        Int
  bucket      String
  key         String
  url         String
  entityType  String?   // "user" | "product" | "category" | "review"
  entityId    String?
  createdAt   DateTime @default(now())

  user     User?          @relation(fields: [userId], references: [id])
  product  ProductImage[]
  review   ReviewImage[]
}

model CartItem {
  id        String  @id @default(uuid())
  userId    String
  productId String
  quantity  Int     @default(1)
  user      User    @relation(fields: [userId], references: [id])
  product   Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
}

model Order {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  status          OrderStatus @default(PENDING)
  total           Decimal
  shipping        Decimal
  tax             Decimal
  stripeSessionId String?     @unique
  shippingAddress Json
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  items    OrderItem[]
  payments Payment[]
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}
```

**Pricing rule (server-computed, never client-side):**
- `subtotal = Σ (OrderItem.price × quantity)`, where `price` is the **product price at order creation** (snapshot against future price changes; orders are never re-priced)
- `shipping = $5.00` flat, **free when subtotal ≥ $100`
- `tax = subtotal × 0.0825` (state rate, fixed for v1)
- `total = subtotal + shipping + tax`

`Order.shipping`, `Order.tax`, and `Order.total` are written once at creation (`POST /api/orders`) and returned thereafter by every order-reading endpoint. `GET /api/cart` returns the same computation as live estimates so cart and checkout totals can render before the order exists.

model OrderItem {
  id        String  @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

model Payment {
  id          String   @id @default(uuid())
  orderId     String
  stripeId    String   @unique
  amount      Decimal
  currency    String   @default("usd")
  cardBrand   String?
  cardLast4   String?
  status      String
  createdAt   DateTime @default(now())

  order Order @relation(fields: [orderId], references: [id])
}

model Review {
  id        String   @id @default(uuid())
  userId    String
  productId String
  rating    Int
  comment   String?
  createdAt DateTime @default(now())

  user    User           @relation(fields: [userId], references: [id])
  product Product        @relation(fields: [productId], references: [id])
  images  ReviewImage[]

  @@unique([userId, productId])
}

model ReviewImage {
  id       String  @id @default(uuid())
  reviewId String
  fileId   String

  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  file   File   @relation(fields: [fileId], references: [id])

  @@unique([reviewId, fileId])
}

model Address {
  id        String  @id @default(uuid())
  userId    String
  label     String
  line1     String
  line2     String?
  city      String
  state     String
  zip       String
  country   String  @default("US")
  isDefault Boolean @default(false)
  user      User    @relation(fields: [userId], references: [id])
}
```

---

## 3. API Endpoints (Detailed)

---

### 3.1 Auth

#### POST `/api/auth/register`
```typescript
// Request
{
  name: string      // required, min 2 chars
  email: string     // required, valid email, unique
  password: string  // required, min 6 chars
}

// Response 201
{
  success: true,
  data: {
    user: { id, name, email, role: "CUSTOMER" }
    accessToken: string
    refreshToken: string
  }
}

// Errors
400 - Validation error
409 - Email already exists
```

#### POST `/api/auth/login`
```typescript
// Request
{
  email: string     // required
  password: string  // required
}

// Response 200
{
  success: true,
  data: {
    user: { id, name, email, role }
    accessToken: string
    refreshToken: string
  }
}

// Errors
400 - Validation error
401 - Invalid credentials
```

#### POST `/api/auth/refresh`
```typescript
// Request
{
  refreshToken: string  // required
}

// Response 200
{
  success: true,
  data: {
    accessToken: string
    refreshToken: string
  }
}

// Errors
401 - Invalid/expired refresh token
```

#### POST `/api/auth/logout`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  refreshToken: string  // required
}

// Response 200
{
  success: true,
  message: "Logged out successfully"
}

// Errors
401 - Unauthorized
```

#### PATCH `/api/auth/password`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  currentPassword: string  // required
  newPassword: string      // required, min 6 chars
}

// Response 200
{
  success: true,
  message: "Password updated successfully"
}

// Errors
400 - Validation error
401 - Unauthorized
401 - Current password incorrect
```

---

### 3.2 Products

#### GET `/api/products`
```typescript
// Query Params
?search=string        // search by name
?categoryId=string    // filter by category
?minPrice=number      // min price
?maxPrice=number      // max price
?rating=number        // min rating
?page=number          // default 1
?limit=number         // default 12, max 50
?sort=string          // "price_asc" | "price_desc" | "newest" | "popular"

// Response 200
{
  success: true,
  data: [{
    id, name, slug, price, images[0], stock,
    category: { id, name, slug },
    _avg: { rating: number },
    _count: { reviews: number }
  }],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

#### GET `/api/products/:slug`
```typescript
// Response 200
{
  success: true,
  data: {
    id, name, slug, description, price, images, stock,
    category: { id, name, slug },
    reviews: [{
      id, rating, comment, createdAt,
      user: { id, name, avatar }
    }],
    _avg: { rating: number },
    _count: { reviews: number }
  }
}

// Errors
404 - Product not found
```

#### POST `/api/products` (Admin)
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Request
{
  name: string
  description: string
  price: number
  categoryId: string
  stock: number
  imageIds: string[]    // max 5 file IDs (upload files first via /api/files/upload)
}

// Response 201
{
  success: true,
  data: {
    id, name, slug, description, price, stock, categoryId, createdAt,
    images: [{ id, url, order }]
  }
}

// Errors
400 - Validation error
401 - Unauthorized
403 - Not admin portal user
404 - File not found
```

#### PATCH `/api/products/:id` (Admin)
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Request
{
  name?: string
  description?: string
  price?: number
  categoryId?: string
  stock?: number
  imageIds?: string[]   // replace all images with these
}

// Response 200
{
  success: true,
  data: {
    id, name, slug, description, price, stock, categoryId, updatedAt,
    images: [{ id, url, order }]
  }
}

// Errors
400 - Validation error
401 - Unauthorized
403 - Not admin portal user
404 - Product not found
404 - File not found
```

#### DELETE `/api/products/:id` (Admin)
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Response 200
{
  success: true,
  message: "Product deleted successfully"
}

// Errors
401 - Unauthorized
403 - Not admin portal user
404 - Product not found
```

#### GET `/api/categories`
```typescript
// Response 200
{
  success: true,
  data: [{
    id, name, slug, image,
    _count: { products: number }
  }]
}
```

#### POST `/api/categories` (Admin)
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Request
{
  name: string       // required, unique
  fileId?: string    // optional, upload file first via /api/files/upload
}

// Response 201
{
  success: true,
  data: { id, name, slug, image: { id, url } }
}

// Errors
400 - Validation error
401 - Unauthorized
403 - Not admin portal user
409 - Category name exists
404 - File not found
```

#### PATCH `/api/categories/:id` (Admin)
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Request
{
  name?: string
  fileId?: string
}

// Response 200
{
  success: true,
  data: { id, name, slug, image: { id, url }, updatedAt }
}

// Errors
400 - Validation error
401 - Unauthorized
403 - Not admin portal user
404 - Category not found
404 - File not found
409 - Name already exists
```

#### DELETE `/api/categories/:id` (Admin)
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Response 200
{
  success: true,
  message: "Category deleted"
}

// Errors
401 - Unauthorized
403 - Not admin portal user
404 - Category not found
409 - Category has products
```

---

### 3.3 Cart

#### GET `/api/cart`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  data: {
    items: [{
      id,
      quantity,
      product: { id, name, slug, price, images[0], stock }
    }],
    subtotal: number,
    shipping: number,   // estimate (same pricing rule as order creation)
    tax: number,        // estimate
    total: number       // subtotal + shipping + tax
  }
}

// Errors
401 - Unauthorized
```

#### POST `/api/cart`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  productId: string  // required
  quantity: number   // required, min 1
}

// Response 201
{
  success: true,
  data: {
    id,
    quantity,
    product: { id, name, slug, price, images[0] }
  }
}

// Errors
400 - Validation error
401 - Unauthorized
404 - Product not found
409 - Item already in cart (use PATCH)
```

#### PATCH `/api/cart/:id`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  quantity: number  // required, min 1
}

// Response 200
{
  success: true,
  data: {
    id,
    quantity,
    product: { id, name, price, images[0] }
  }
}

// Errors
400 - Validation error
401 - Unauthorized
403 - Not cart owner
404 - Cart item not found
409 - Stock exceeded
```

#### DELETE `/api/cart/:id`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  message: "Item removed from cart"
}

// Errors
401 - Unauthorized
403 - Not cart owner
404 - Cart item not found
```

#### DELETE `/api/cart`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  message: "Cart cleared"
}

// Errors
401 - Unauthorized
```

---

### 3.4 Orders

#### POST `/api/orders`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country: string
  }
}

// Response 201
{
  success: true,
  data: {
    id,
    status: "PENDING",
    total,
    shipping,   // snapshot, computed at creation (delta: extends Order model)
    tax,        // snapshot, computed at creation
    shippingAddress,
    items: [{
      id, quantity, price,
      product: { id, name, images[0] }
    }],
    createdAt
  }
}

// Errors
400 - Validation error
400 - Cart is empty
401 - Unauthorized
```

#### GET `/api/orders`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Query Params
?page=number
?limit=number
?status=OrderStatus

// Response 200
{
  success: true,
  data: [{
    id, status, total, shipping, tax, createdAt,
    items: [{ quantity, product: { name, images[0] } }]
  }],
  pagination: { page, limit, total, totalPages }
}

// Errors
401 - Unauthorized
```

#### GET `/api/orders/:id`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  data: {
    id, status, total, shipping, tax, shippingAddress, createdAt,
    items: [{
      id, quantity, price,
      product: { id, name, slug, images[0] }
    }],
    payment: {
      cardBrand: string
      cardLast4: string
    }
  }
}

// Errors
401 - Unauthorized
403 - Not order owner
404 - Order not found
```

#### PATCH `/api/admin/orders/:id/status` (Admin)
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Request
{
  status: OrderStatus  // PENDING | PAID | SHIPPED | DELIVERED | CANCELLED
}

// Response 200
{
  success: true,
  data: {
    id, status, updatedAt
  }
}

// Errors
400 - Invalid status transition
401 - Unauthorized
403 - Not admin portal user
404 - Order not found
```

**Legal status transitions (enforced by `400 Invalid status transition`):**
```
PENDING   → PAID | CANCELLED
PAID      → SHIPPED | CANCELLED
SHIPPED   → DELIVERED | CANCELLED
DELIVERED → (terminal)
CANCELLED → (terminal)
```
`PENDING → PAID` is normally applied by the Stripe webhook, not the admin endpoint.

---

### 3.5 Checkout

#### POST `/api/checkout/create-session`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  orderId: string  // order created via POST /api/orders (status PENDING)
}

// Response 200
{
  success: true,
  data: {
    orderId: string
    sessionId: string
    url: string  // Stripe checkout URL
  }
}

// Errors
401 - Unauthorized
400 - Order not found or not PENDING
```

#### POST `/api/webhook/stripe`
```typescript
// Headers
Stripe-Signature: string  // Stripe webhook signature

// Request
// Stripe event object (checkout.session.completed)

// Response 200
// Updates order status to PAID

// Errors
400 - Invalid signature
```

---

### 3.6 Reviews

#### GET `/api/products/:id/reviews`
```typescript
// Query Params
?page=number
?limit=number

// Response 200
{
  success: true,
  data: [{
    id, rating, comment, createdAt,
    user: { id, name, avatar },
    images: [{ id, url }]
  }],
  _avg: { rating: number },
  _count: { reviews: number },
  pagination: { page, limit, total, totalPages }
}
```

#### POST `/api/products/:id/reviews`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  rating: number     // required, 1-5
  comment?: string   // optional, max 500 chars
  imageIds?: string[] // optional, upload files first via /api/files/upload, max 5
}

// Response 201
{
  success: true,
  data: {
    id, rating, comment, createdAt,
    user: { id, name, avatar },
    images: [{ id, url }]
  }
}

// Errors
400 - Validation error
401 - Unauthorized
403 - Not purchased (order must be PAID/DELIVERED and contain the product)
404 - Product not found
404 - File not found
409 - Already reviewed this product
```

> **Purchase gate:** `POST /api/products/:id/reviews` verifies the authenticated user has a `PAID` or `DELIVERED` order containing the product before accepting a review; otherwise `403`.

#### DELETE `/api/reviews/:id`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  message: "Review deleted"
}

// Errors
401 - Unauthorized
403 - Not review owner or admin
404 - Review not found
```

---

### 3.7 Admin

#### GET `/api/admin/stats`
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Response 200
{
  success: true,
  data: {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    totalProducts: number
    newUsersThisWeek: number
    ordersThisWeek: number
    lowStockProducts: number   // products with stock ≤ 5
    recentOrders: [{
      id, total, status, createdAt,
      user: { name }
    }],
    salesByDay: [{
      date: string
      revenue: number
    }]
  }
}

// Errors
401 - Unauthorized
403 - Not admin portal user
```

#### GET `/api/admin/products`
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Query Params
?search=string          // search by name
?categoryId=string      // filter by category
?stock=string           // "in_stock" | "out_of_stock" | "low" (low = stock ≤ 5)
?page=number
?limit=number

// Response 200
{
  success: true,
  data: [{
    id, name, slug, description, price, stock,
    category: { id, name, slug },
    images: [{ id, url, order }],
    createdAt, updatedAt
  }],
  pagination: { page, limit, total, totalPages }
}

// Errors
401 - Unauthorized
403 - Not admin portal user
```

#### GET `/api/admin/orders`
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: USER | ADMIN

// Query Params
?status=OrderStatus
?dateFrom=string   // ISO date
?dateTo=string     // ISO date
?page=number
?limit=number

// Response 200
{
  success: true,
  data: [{
    id, status, total, shipping, tax, createdAt,
    user: { id, name, email },
    items: [{ quantity, product: { name, images[0] } }]
  }],
  pagination: { page, limit, total, totalPages }
}

// Errors
401 - Unauthorized
403 - Not admin portal user
```

#### GET `/api/admin/users`
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: ADMIN  // Only ADMIN can manage users

// Query Params
?page=number
?limit=number
?search=string
?role=Role   // filter by role

// Response 200
{
  success: true,
  data: [{
    id, name, email, role, createdAt,
    _count: { orders: number }
  }],
  pagination: { page, limit, total, totalPages }
}

// Errors
401 - Unauthorized
403 - Not admin
```

#### PATCH `/api/admin/users/:id/role`
```typescript
// Headers
Authorization: Bearer <accessToken>
Role: ADMIN  // Only ADMIN can change roles

// Request
{
  role: Role  // CUSTOMER | USER | ADMIN
}

// Response 200
{
  success: true,
  data: {
    id, name, email, role
  }
}

// Errors
400 - Cannot promote above your level
401 - Unauthorized
403 - Not admin
404 - User not found
```

---

### 3.8 Users

#### GET `/api/users/me`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  data: {
    id, name, email, phone, avatar, role, createdAt,
    addresses: [{ id, label, line1, city, state, zip, isDefault }]
  }
}

// Errors
401 - Unauthorized
```

#### PATCH `/api/users/me`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  name?: string
  phone?: string
  avatarId?: string   // upload file first via /api/files/upload
}

// Response 200
{
  success: true,
  data: {
    id, name, email, phone,
    avatar: { id, url }
  }
}

// Errors
400 - Validation error
401 - Unauthorized
404 - File not found
```

#### POST `/api/users/me/address`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  label: string      // "Home", "Work", etc.
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country?: string   // default "US"
  isDefault?: boolean
}

// Response 201
{
  success: true,
  data: {
    id, label, line1, line2, city, state, zip, country, isDefault
  }
}

// Errors
400 - Validation error
401 - Unauthorized
```

#### PATCH `/api/users/me/address/:id`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  label?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  isDefault?: boolean
}

// Response 200
{
  success: true,
  data: {
    id, label, line1, line2, city, state, zip, country, isDefault
  }
}

// Errors
400 - Validation error
401 - Unauthorized
403 - Not address owner
404 - Address not found
```

#### DELETE `/api/users/me/address/:id`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  message: "Address deleted"
}

// Errors
401 - Unauthorized
403 - Not address owner
404 - Address not found
```

---

### 3.9 Files

#### POST `/api/files/upload`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request (multipart/form-data)
file: File           // required, max 5MB
entityType?: string  // "user" | "product" | "category" | "review"
entityId?: string    // ID of entity to link

// Response 201
{
  success: true,
  data: {
    id,
    originalName,
    fileName,
    mimeType,
    size,
    url,
    entityType,
    entityId,
    createdAt
  }
}

// Errors
400 - Validation error (file type/size)
401 - Unauthorized
404 - Entity not found
```

#### POST `/api/files/upload/multiple`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request (multipart/form-data)
files: File[]        // required, max 5 files, max 5MB each
entityType?: string
entityId?: string

// Response 201
{
  success: true,
  data: [{
    id, originalName, fileName, mimeType, size, url, entityType, entityId
  }]
}

// Errors
400 - Validation error
401 - Unauthorized
```

#### GET `/api/files`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Query Params
?entityType=string   // filter by entity type
?entityId=string     // filter by entity ID
?page=number
?limit=number

// Response 200
{
  success: true,
  data: [{
    id, originalName, fileName, mimeType, size, url, entityType, entityId, createdAt
  }],
  pagination: { page, limit, total, totalPages }
}

// Errors
401 - Unauthorized
```

#### GET `/api/files/:id`
```typescript
// Response 200
{
  success: true,
  data: {
    id, originalName, fileName, mimeType, size, url, entityType, entityId, createdAt
  }
}

// Errors
404 - File not found
```

#### DELETE `/api/files/:id`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  message: "File deleted"
}

// Errors
401 - Unauthorized
403 - Not file owner or admin
404 - File not found
```

#### PATCH `/api/files/:id/link`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Request
{
  entityType: string  // "user" | "product" | "category" | "review"
  entityId: string    // ID of entity to link
}

// Response 200
{
  success: true,
  data: {
    id, entityType, entityId
  }
}

// Errors
400 - Validation error
401 - Unauthorized
403 - Not file owner or admin
404 - File not found
404 - Entity not found
```

#### PATCH `/api/files/:id/unlink`
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response 200
{
  success: true,
  data: {
    id, entityType: null, entityId: null
  }
}

// Errors
401 - Unauthorized
403 - Not file owner or admin
404 - File not found
```

---

## 4. Frontend State Structure

### Redux Store
```typescript
{
  auth: {
    user: { id, name, email, role, avatar }
    accessToken: string
    refreshToken: string
    isAuthenticated: boolean
  },
  cart: {
    items: [{ productId, name, price, image, quantity }]
    total: number
  },
  ui: {
    isCartOpen: boolean
    isMobileMenuOpen: boolean
    theme: 'light' | 'dark'
  }
}
```

### Token Storage Strategy
```
Access Token:  In-memory (Redux state) - cleared on refresh
Refresh Token: localStorage - persists across sessions

Why:
- Access token in memory = secure (not accessible via XSS)
- Refresh token in localStorage = persistent (user stays logged in)
- On app load: check localStorage for refresh token → get new access token
```

### RTK Query Endpoints
```typescript
authApi:        login, register, logout, refresh, changePassword
productsApi:    getProducts, getProduct, createProduct, updateProduct, deleteProduct
categoriesApi:  getCategories, createCategory, updateCategory, deleteCategory
cartApi:        getCart, addToCart, updateCartItem, removeFromCart, clearCart
ordersApi:      createOrder, getOrders, getOrder
reviewsApi:     getProductReviews, createReview, deleteReview
adminApi:       getStats, getUsers
usersApi:       getProfile, updateProfile, addAddress, updateAddress, deleteAddress
filesApi:       uploadFile, uploadMultiple, getFiles, getFile, deleteFile, linkFile, unlinkFile
```

---

## 5. Component Tree

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   ├── SearchBar
│   │   ├── CartIcon (with badge)
│   │   ├── UserMenu (dropdown)
│   │   └── MobileMenu
│   ├── Sidebar (admin only)
│   └── Footer
│
├── Pages
│   ├── Home
│   │   ├── HeroBanner
│   │   ├── CategoryGrid
│   │   └── ProductGrid
│   │
│   ├── Products
│   │   ├── FilterSidebar
│   │   ├── SortSelect
│   │   ├── ProductGrid
│   │   └── Pagination
│   │
│   ├── ProductDetail
│   │   ├── ImageGallery
│   │   ├── ProductInfo
│   │   ├── QuantitySelector
│   │   ├── ReviewSection
│   │   └── RelatedProducts
│   │
│   ├── Cart
│   │   ├── CartItem
│   │   └── OrderSummary
│   │
│   ├── Checkout
│   │   ├── AddressForm
│   │   ├── PaymentForm (Stripe)
│   │   └── OrderSummary
│   │
│   ├── Profile
│   │   ├── UserInfo
│   │   ├── AddressList
│   │   └── PasswordForm
│   │
│   ├── Orders
│   │   ├── OrderList
│   │   └── OrderDetail
│   │
│   └── Auth
│       ├── LoginForm
│       └── RegisterForm
│
├── Components
│   ├── FileUpload
│   │   ├── SingleUpload
│   │   └── MultiUpload
│   ├── ImageGallery
│   ├── Pagination
│   └── SearchBar
│
└── Admin
    ├── Dashboard
    │   ├── StatsCards
    │   ├── SalesChart
    │   └── RecentOrders
    ├── ProductManagement
    │   └── ProductTable
    ├── CategoryManagement
    │   └── CategoryTable
    ├── OrderManagement
    │   └── OrderTable
    └── UserManagement
        └── UserTable
```

---

## 6. Build Phases

| Phase | Features | Est. Time | Dependencies |
|-------|----------|-----------|--------------|
| **1** | Project setup, DB schema, Auth + Password, MinIO | 2-3 days | — |
| **2** | User Management (Admin: list, roles) | 1-2 days | Phase 1 |
| **3** | Products + Categories CRUD | 2-3 days | Phase 2 |
| **4** | File upload service + entity linking | 1 day | Phase 2, 3 |
| **5** | Cart functionality | 1-2 days | Phase 3 |
| **6** | Checkout + Stripe | 2-3 days | Phase 5 |
| **7** | Orders + Profile | 2 days | Phase 6 |
| **8** | Reviews (with images) | 1 day | Phase 3, 4 |
| **9** | Admin Dashboard | 2-3 days | Phase 7 |
| **10** | Polish + Responsive | 2-3 days | All |

**Total: ~16-22 days**

---

## 7. API Standards

### Response Format
```typescript
// Success
{
  success: true
  data: T
  message?: string
}

// Error
{
  success: false
  error: {
    code: string        // "VALIDATION_ERROR", "NOT_FOUND", etc.
    message: string     // Human-readable message
    details?: any       // Additional error info
  }
}

// Paginated
{
  success: true
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### Status Codes
| Code | Usage |
|------|-------|
| 200 | Success |
| 201 | Created |
| 204 | Deleted (no content) |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict |
| 422 | Unprocessable entity |
| 500 | Server error |

---

## 8. File Storage Strategy

### Storage: MinIO (S3-compatible)

### Bucket Structure
```
ecommerce/
├── products/       # Product images
├── avatars/        # User avatars
├── categories/     # Category images
├── reviews/        # Review reference images
└── thumbnails/     # Generated thumbnails
```

### Product Images
```
Bucket: ecommerce
Key: products/{productId}/{filename}
URL: {MINIO_ENDPOINT}/{bucket}/products/{productId}/{filename}

Limits:
- Max 5MB per image
- Max 5 images per product
- Types: jpg, jpeg, png, webp
- Thumbnails: 200x200, 500x500 (auto-generated)
```

### User Avatars
```
Bucket: ecommerce
Key: avatars/{userId}/{filename}
URL: {MINIO_ENDPOINT}/{bucket}/avatars/{userId}/{filename}

Limits:
- Max 2MB
- Types: jpg, jpeg, png, webp
- Thumbnail: 100x100 (auto-generated)
```

### Category Images
```
Bucket: ecommerce
Key: categories/{filename}
URL: {MINIO_ENDPOINT}/{bucket}/categories/{filename}

Limits:
- Max 2MB
- Types: jpg, jpeg, png, webp
- Thumbnail: 300x300 (auto-generated)
```

### Review Images
```
Bucket: ecommerce
Key: reviews/{reviewId}/{filename}
URL: {MINIO_ENDPOINT}/{bucket}/reviews/{reviewId}/{filename}

Limits:
- Max 5MB per image
- Max 5 images per review
- Types: jpg, jpeg, png, webp
- Thumbnail: 200x200 (auto-generated)
```

### NestJS MinIO Config
```typescript
// minio.config.ts
{
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
}

// Bucket policy (public read)
{
  Version: '2012-10-17',
  Statement: [{
    Effect: 'Allow',
    Principal: { AWS: ['*'] },
    Action: ['s3:GetObject'],
    Resource: ['arn:aws:s3:::ecommerce/*']
  }]
}
```

### Upload Service
```typescript
// upload.service.ts
async uploadFile(
  file: Express.Multer.File,
  userId: string,
  entityType?: string,
  entityId?: string
): Promise<File> {
  // Build folder path based on entity type
  let folder = 'uploads';
  if (entityType === 'product') folder = 'products';
  else if (entityType === 'avatar') folder = 'avatars';
  else if (entityType === 'category') folder = 'categories';
  else if (entityType === 'review') folder = 'reviews';

  // For review images, include entityId in path
  const key = entityId 
    ? `${folder}/${entityId}/${uuid()}${extname(file.originalname)}`
    : `${folder}/${uuid()}${extname(file.originalname)}`;
  
  await this.minioClient.putObject(
    'ecommerce',
    key,
    file.buffer,
    file.size,
    { 'Content-Type': file.mimetype }
  );

  const url = `${this.minioEndpoint}/ecommerce/${key}`;

  return this.prisma.file.create({
    data: {
      userId,
      originalName: file.originalname,
      fileName: `${uuid()}${extname(file.originalname)}`,
      mimeType: file.mimetype,
      size: file.size,
      bucket: 'ecommerce',
      key,
      url,
      entityType,
      entityId,
    }
  });
}

async deleteFile(fileId: string): Promise<void> {
  const file = await this.prisma.file.findUnique({ where: { id: fileId } });
  if (!file) throw new NotFoundException('File not found');

  await this.minioClient.removeObject(file.bucket, file.key);
  await this.prisma.file.delete({ where: { id: fileId } });
}

async linkToEntity(fileId: string, entityType: string, entityId: string): Promise<File> {
  return this.prisma.file.update({
    where: { id: fileId },
    data: { entityType, entityId }
  });
}
```

### Environment Variables
```bash
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=ecommerce
MINIO_USE_SSL=false
```

### Local MinIO Setup
```bash
# Download MinIO (Windows)
# https://min.io/docs/minio/windows/index.html

# Start MinIO server
minio server /data --console-address ":9001"

# Access Console
# http://localhost:9001
# Login: minioadmin / minioadmin

# Create bucket via console or mc client
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/ecommerce
mc anonymous set public local/ecommerce
```

---

## 9. Security Config

### CORS
```typescript
{
  origin: [
    'http://localhost:5173',
    'https://yourdomain.com'
  ],
  credentials: true
}
```

### Rate Limiting
```
Auth routes:   5 req / 15 min (per IP)
Cart/Orders:   30 req / 1 min (per user)
Products GET:  100 req / 1 min (per IP)
Admin routes:  60 req / 1 min (per user)
```

### Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Input Validation
- `class-validator` for DTOs
- Sanitize HTML in user input
- Validate query params

---

## 10. Error Handling

### Error Codes
| Code | HTTP | Description |
|------|------|-------------|
| VALIDATION_ERROR | 400 | Invalid input |
| UNAUTHORIZED | 401 | No/invalid token |
| FORBIDDEN | 403 | Wrong permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Duplicate |
| STOCK_EXCEEDED | 409 | Out of stock |
| PAYMENT_FAILED | 422 | Stripe error |
| INTERNAL_ERROR | 500 | Server error |

### Prisma Errors
```typescript
P2002 -> ConflictException('Already exists')
P2025 -> NotFoundException('Not found')
P2003 -> BadRequestException('Invalid reference')
```

---

## 11. Environment Variables

### Backend (.env)
```bash
PORT=3000
API_PREFIX=api
DATABASE_URL="postgresql://user:pass@localhost:5432/ecommerce"
JWT_SECRET=your-secret-key
JWT_EXPIRATION=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRATION=7d
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_SUCCESS_URL=http://localhost:5173/order/success?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=http://localhost:5173/cart
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=ecommerce
MINIO_USE_SSL=false
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

---

## 12. Testing Strategy

### Backend (NestJS)
| Type | Tool | Scope |
|------|------|-------|
| Unit | Jest | Services, utils, guards |
| Integration | Jest + Supertest | Controllers, endpoints |
| E2E | Jest + Supertest | Full API flows |

### Frontend (React)
| Type | Tool | Scope |
|------|------|-------|
| Unit | Vitest | Components, hooks, utils |
| Integration | Vitest + RTL | Component interactions |
| E2E | Playwright | Critical user flows |

### Key Test Cases
```
Auth:      register, login, refresh, logout, invalid credentials
Roles:     GUEST→CUSTOMER, USER admin access, ADMIN user management
Products:  CRUD, filter, search, pagination
Cart:      add, update, remove, stock limits
Orders:    create, payment webhook, status transitions
Reviews:   CRUD, image upload
Admin:     role-based access, dashboard stats, user role management
Files:     upload, delete, link/unlink to entities
```
