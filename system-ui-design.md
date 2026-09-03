# E-Commerce UI System Design (Wireframes)

> Companion doc to `system-design.md`. Defines the UI structure, page flows, and
> component composition for all screens so they can be implemented in Penpot
> first, then translated to React (shadcn/ui) with high fidelity.

---

## 1. Scope & Conventions

- Wireframes are schematic — exact spacing/colors resolve at the Penpot stage.
- Every screen lists its **composition** (which components from `system-design.md` §5 it uses).
- Roles: `GUEST`, `CUSTOMER`, `USER`, `ADMIN`.
- Base layout width for desktop frames: **1280px**, tablet: **768px**, mobile: **375px**.
- Currency format: `$` (USD, per Stripe defaults).
- Prices formatted `$1,234.56`; ratings shown as `★ 4.5 (12)`.

---

## 2. Design Tokens (Proposed — confirm in Penpot before coding)

### 2.1 Colors (aligned with shadcn/ui defaults)

| Token      | Suggested (light) | Usage |
|------------|-------------------|-------|
| background | #FFFFFF | App background |
| foreground | #09090B | Text default |
| primary    | #18181B | Buttons, active nav, links |
| primary-foreground | #FAFAFA | Text on primary |
| secondary  | #F4F4F5 | Chip/badge background |
| muted      | #F4F4F5 | Skeleton, dividers, table zebra |
| muted-foreground | #71717A | Secondary text, placeholders |
| accent     | #F4F4F5 | Hover states |
| border     | #E4E4E7 | Inputs, table rows, cards |
| destructive | #DC2626 | Delete actions, error toasts |
| success    | #16A34A | PAID/DELIVERED status |
| warning    | #CA8A04 | PENDING status |
| info       | #2563EB | SHIPPED status, info toasts |

**Dark palette** (applies when `ui.theme = 'dark'`; all other tokens stay constant):

| Token      | Dark value | Notes |
|------------|------------|-------|
| background | #09090B | App background |
| foreground | #FAFAFA | Text default |
| primary    | #FAFAFA | Buttons, links (inverts) |
| primary-foreground | #18181B | Text on primary |
| secondary  | #18181B | Chip/badge background |
| muted      | #18181B | Skeleton, table zebra |
| muted-foreground | #A1A1AA | Secondary text |
| accent     | #27272A | Hover states |
| border     | #27272A | Inputs, cards, dividers |
| destructive / success / warning / info | #EF4444 / #22C55E / #FACC15 / #3B82F6 | Status colors (raised luminance for contrast) |

**Theme control:** toggle in Header (sun/moon icon), persisted to `localStorage`, stored in `ui.theme` slice. Default: `light` (follows `prefers-color-scheme` on first load).

### 2.2 Typography

| Role | Size / Weight | Applies to |
|------|---------------|------------|
| Display | 36–48px / 800 | Hero headline |
| H1 | 30px / 700 | Page titles (Products, Dashboard…) |
| H2 | 24px / 600 | Section headers (Featured Products…) |
| H3 | 18px / 600 | Card titles, form section headers |
| Body | 14px / 400 | Primary text |
| Small | 12px / 400 | Captions, timestamps, badges |
| Button | 14px / 500 | All buttons |

### 2.3 Sizing

| Token | Value |
|-------|-------|
| Spacing scale | 4px grid (4, 8, 12, 16, 24, 32, 48) |
| Radius | `sm` 6px (buttons, inputs), `md` 8px (cards), `lg` 12px (modals), `full` (pills) |
| Card gap | 16px grid gap desktop, 8px mobile |
| Max content width | 1280px centered |
| Header height | 64px (desktop), 56px (mobile) |
| Sidebar width | 240px (desktop), slide-over on mobile |

---

## 3. Layout Shells

### 3.1 Customer App Shell (all customer pages)

```
┌────────────────────────────────────────────────────────────────┐
│ HEADER (sticky, 64px)                                           │
│ ┌─────┐ ┌─────────────────────────────┐     ┌──┐ ┌─────────────┐│
│ │LOGO │ │        SearchBar             │     │🌙│ │  🛒 icon    ││
│ │     │ │ (desktop only, w=420)        │     │  │ │ (badge 3)   ││
│ └─────┘ └─────────────────────────────┘     └──┘ │ 👤 UserMenu ││
│                                     (theme toggle)└─────────────┘│
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                        PAGE CONTENT (max 1280)                 │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ FOOTER                                                        │
│ ┌─────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│ │LOGO     │ │ Quick Links  │ │ Support      │ │ Follow us   │ │
│ │tagline  │ │ Home         │ │ Help Center  │ │ [f][x][in]  │ │
│ │         │ │ Products     │ │ Contact Us   │ ├─────────────┤ │
│ │         │ │ My Orders    │ │ Shipping     │ │ Payment     │ │
│ │         │ │ My Profile   │ │ Returns      │ │ [Visa][MC]  │ │
│ └─────────┘ └──────────────┘ └──────────────┘ └─────────────┘ │
│ Copyright © ecommerce — All rights reserved                    │
└────────────────────────────────────────────────────────────────┘
```

**Composition:** `Layout` → `Header` (Logo, SearchBar, CartIcon+badge, UserMenu, MobileMenu) + `Footer`.

**Header — mobile (375px):**
```
┌────────────────────────────┐
│ [☰] [LOGO]        [🛒 3]  │
└────────────────────────────┘
   ☰ → slide-out MobileMenu:
   ┌────────────────────────┐
   │  Home                  │
   │  Products              │
   │  Search [_________]    │
   │  Login / Register ▾    │
   └────────────────────────┘
```

**UserMenu dropdown (user logged in):**
```
┌──────────────────────┐
│ 👤 Jane Doe (name)   │
│  jane@mail.com       │
│ ───────────────────  │
│ My Profile           │
│ My Orders            │
│ ───────────────────  │
│ Admin Panel  (USER/ADMIN only) │
│ Logout               │
└──────────────────────┘
```

**SearchBar behavior:** type → debounce 300ms → dropdown suggestions → Enter redirects to `/products?search=q`.

### 3.2 Admin Shell

```
┌────────────┬─────────────────────────────────────────────────────┐
│ SIDEBAR    │ ADMIN HEADER                                         │
│ (240px)    │ [☰ tablet]   [Page title]     [User ▾] [View Store] │
│            ├─────────────────────────────────────────────────────┤
│ ▸ Dashboard│                                                     │
│ ▸ Products │                                                     │
│ ▸ Categories│               PAGE CONTENT                         │
│ ▸ Orders   │                                                     │
│ ▸ Users    │                                                     │
│ ─────────  │                                                     │
│ [View Store]                                                      │
│ [Logout]   │                                                     │
└────────────┴─────────────────────────────────────────────────────┘
```

- **Roles:** drawer visible to `USER` + `ADMIN`; **Users** item only for `ADMIN`.
- **Mobile (<768px):** sidebar hidden; hamburger opens slide-over.
- Guards wrap `/admin/*`: `AuthGuard` → `RoleGuard(USER|ADMIN)`.

---

## 4. Route Map

| Route | Page | Roles | Guard |
|-------|------|-------|-------|
| `/` | Home | ALL | none |
| `/products` | Products | ALL | none |
| `/products/:slug` | ProductDetail | ALL | none |
| `/auth/login`, `/auth/register` | Auth | GUEST | redirect away if authed |
| `/cart` | Cart | CUSTOMER+ | AuthGuard |
| `/checkout` | Checkout | CUSTOMER+ | AuthGuard |
| `/order/success` | OrderConfirmation | CUSTOMER+ | AuthGuard |
| `/orders` | Orders | CUSTOMER+ | AuthGuard |
| `/orders/:id` | OrderDetail | CUSTOMER+ (owner) | AuthGuard |
| `/profile` | Profile | CUSTOMER+ | AuthGuard |
| `/admin` | Admin Dashboard | USER+ | AuthGuard + RoleGuard |
| `/admin/products` | ProductList | USER+ | same |
| `/admin/products/:id/edit` | ProductForm | USER+ | same |
| `/admin/products/new` | ProductForm | USER+ | same |
| `/admin/categories` | CategoryList | USER+ | same |
| `/admin/orders` | OrderList | USER+ | same |
| `/admin/users` | UserList | ADMIN | AuthGuard + RoleGuard(ADMIN) |
| `*` | NotFound | ALL | none |

---

## 5. Page Wireframes

### 5.1 Auth — Login (`/auth/login`)

```
┌──────────────────────────────────────────────┐
│                    [LOGO]                     │
│                E-Commerce                    │
│                                              │
│        ┌──────────────────────────────┐      │
│        │  Sign in                     │      │
│        │                              │      │
│        │  Email                       │      │
│        │  [________________________]  │      │
│        │                              │      │
│        │  Password                    │      │
│        │  [________________________]  │      │
│        │  [Forgot password?]   →      │      │
│        │                              │      │
│        │  [    Sign In     ]  (full)  │      │
│        │                              │      │
│        │  No account?  Create one     │      │
│        └──────────────────────────────┘      │
└──────────────────────────────────────────────┘
```

**Composition:** `LoginForm` (centered card, max-w 400px).
**States:** error toast on 401; spinner in button while loading; `401` → "Invalid email or password", `409`/`400` on register → "Email already exists" / "Validation error".

### 5.2 Auth — Register (`/auth/register`)

Same layout as Login.
```
│        ┌──────────────────────────────┐      │
│        │  Create account              │      │
│        │  Name       [____________]   │      │
│        │  Email      [____________]   │      │
│        │  Password   [____________]   │      │
│        │  (min 6 chars)               │      │
│        │  [    Create Account  ]      │      │
│        │  Already have an account? →  │      │
│        └──────────────────────────────┘      │
```
On success: store tokens → redirect `/`.
On failure: inline field errors + error toast.

### 5.3 Home (`/`)

```
┌────────────────────────────────────────────────────────────────┐
│ [HeroBanner — full width, h=420]                                │
│  Fresh finds, fast delivery                      (bg image)     │
│  Headline 36-48px bold                                          │
│  [  Shop Now  ]  [ Browse Categories ]                        │
├────────────────────────────────────────────────────────────────┤
│ CategoryGrid (4/2/1 cols)     Section: "Shop by Category"      │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│ │  IMG    │ │  IMG    │ │  IMG    │ │  IMG    │                │
│ │Electronics│ │Clothing │ │ Books  │ │ Toys    │                │
│ │ (24 items) │ │(18)   │ │ (12)   │ │  (9)   │                │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘                │
├────────────────────────────────────────────────────────────────┤
│ "Featured Products"                       [ View all → ]       │
│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                        │
│ │  IMG  │ │  IMG  │ │  IMG  │ │  IMG  │   ProductGrid          │
│ │Name   │ │Name   │ │Name   │ │Name   │   (4→2→1 cols)         │
│ │$99.99 │ │$15.75 │ │$42.00 │ │$8.95  │                        │
│ │★4.5(12)│ │★5(3) │ │★3.8(21)│ │★4.2(9)│                        │
│ └───────┘ └───────┘ └───────┘ └───────┘                        │
└────────────────────────────────────────────────────────────────┘
```

**Composition:** `HeroBanner` + `CategoryGrid` + `ProductGrid` (`ProductCard`).
**States:** skeleton cards while loading; empty state ("No products yet").
**ProductCard (detail):**
```
┌────────────┐
│  image 1:1  │
│ Name        │
│ $99.99      │
│ ★ 4.5 (12)  │
└────────────┘
```
Card: hover shadow + image zoom; whole card links to `/products/:slug`.
(Image: 200×200 thumb from `products/…`, see §6.3.)

### 5.4 Products (`/products`)

```
┌─────────────┬───────────────────────────────────────────────────┐
│ FilterSidebar│ [SortSelect: Newest ▾]        "124 results"       │
│ (w=260)     │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            │
│             │ │ Card  │ │ Card  │ │ Card  │ │ Card  │            │
│ Category    │ └───────┘ └───────┘ └───────┘ └───────┘            │
│ ☑ Electronics│ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            │
│ ☑ Clothing  │ │       │ │       │ │       │ │       │            │
│ ☐ Books     │ └───────┘ └───────┘ └───────┘ └───────┘            │
│ ☐ Toys      │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            │
│             │ │       │ │       │ │       │ │       │            │
│ Price       │ └───────┘ └───────┘ └───────┘ └───────┘            │
│ $[___] - $[___]  [Apply]  │                                      │
│ Rating: [4 ★] [3 ★] [2 ★] │        Pagination                    │
│ [Clear all filters] │      │   ◀   1  2  3  4 …  ▶   (3 of 10)   │
└─────────────┴───────────────────────────────────────────────────┘
```

**Composition:** `FilterSidebar` + `SortSelect` + `ProductGrid` + `Pagination`.
**Responsive:** mobile → filters collapse behind "Filters" button (drawer).
**Query sync:** URL params drive state (search, categoryId, minPrice, maxPrice, rating, sort, page).
**Sort options:** `newest` (default), `price_asc`, `price_desc`, `popular`.

### 5.5 ProductDetail (`/products/:slug`)

```
┌───────────────────────────────────────────┬─────────────────────┐
│ ImageGallery (w=560)                      │ ProductInfo (w=420) │
│                                           │                     │
│        [     Main Image      ]            │  Top T-Shirt         │
│        [   square 1:1, w=560 ]            │  #tag / category link│
│                                           │                     │
│ [thumb] [thumb] [thumb] [thumb]           │  ★ 4.5  (12 reviews) │
│ (active thumb: border highlight)          │                     │
│                                           │  $99.99              │
│                                           │  Stock: 24 in stock  │
│                                           │  (or: Out of stock)  │
│                                           │                     │
│                                           │  Quantity            │
│                                           │   [−]  2  [+]        │
│                                           │                     │
│                                           │  [  Add to Cart  ]   │
│                                           │                     │
├───────────────────────────────────────────┴─────────────────────┤
│ Description (full width, reads under image column)              │
│  Paragraph…                                                     │
├────────────────────────────────────────────────────────────────┤
│ Reviews:  "Customer Reviews — ★ 4.5 (12)"                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ StarRating [☆☆☆☆☆ interactive]  [Post Review] (auth+eligible)│ │
│  │ ┌────────────────────────────────────────────────────────┐ │
│  │ │ ★★★★★  Jane D.    2026-08-12   🖼️[img][img]             │ │
│  │ │ "Great fit, fast shipping…"                             │ │
│  │ │ (ReviewCard — delete btn on own review)                 │ │
│  │ └────────────────────────────────────────────────────────┘ │
│  └────────────────────────────────────────────────────────────┘ │
│  [Pagination ◀ 1 2 ▶]                                          │
├────────────────────────────────────────────────────────────────┤
│ Related Products (same category)                               │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                            │
│ │ Card │ │ Card │ │ Card │ │ Card │                            │
│ └──────┘ └──────┘ └──────┘ └──────┘                            │
└────────────────────────────────────────────────────────────────┘
```

**Composition:** `ImageGallery`, `ProductInfo`, `QuantitySelector`, `ReviewSection` (`StarRating`, `ReviewForm`, `ReviewList`→`ReviewCard`+`ReviewImages`), `RelatedProducts`.
**Review rules (from spec):** only logged-in users who purchased can review; one review per user per product (`409` otherwise); rating 1–5; ≤5 images.
**Behavior:** Add to Cart → toast + header badge bump; if not authed → redirect login with `next` param.

### 5.6 Cart (`/cart`)

```
┌──────────────────────────────────────────────┬──────────────────┐
│ Cart (3 items)                               │ OrderSummary (w=320)
│                                              │                  │
│ ┌──────────────────────────────────────────┐ │  Subtotal   $149.99
│ │ [IMG] Product A         $25.00  [− 2 +] ✕│ │  Shipping    $10.00
│ ├──────────────────────────────────────────┤ │  Tax         $12.00
│ │ [IMG] Product B         $99.99  [− 1 +] ✕│ │  ──────────      │
│ └──────────────────────────────────────────┘ │  Total       $171.99
│ + update quantity via PATCH /api/cart/:id    │                  │
│ stock exceeded → 409 toast                   │  [ Checkout ]    │
│                                              │  [ Continue shopping ]
├──────────────────────────────────────────────┴──────────────────┤
│ Empty state: [🛒 illustration] "Your cart is empty"              │
│              [ Start shopping ]                                  │
└────────────────────────────────────────────────────────────────┘
```

**Composition:** `CartItem` × n + `OrderSummary`; also `MiniCart` in header.
**MiniCart dropdown (desktop, hover from header cart icon):**
```
     ┌───────────────────────────────┐
     │  Cart (3)                     │
     │  Product A  ×2       $50.00   │
     │  Product B  ×1       $99.99   │
     │  ─────────────────────────    │
     │  Total                $149.99 │
     │  [ View Cart ]  [ Checkout ]  │
     └───────────────────────────────┘
```

**Cart Drawer (slide-over):** header cart icon **click** sets `ui.isCartOpen = true` → right slide-over panel (w=400, full-height). Same components as Cart page, compacted; empty state inside drawer.

```
┌──────────┐
│ PAGE     │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ CONTENT  │ ▓│ 🛒 Cart (3)        ✕ │
│ (dimmed) │ ▓├───────────────────────┤
│          │ ▓│ [IMG] Product A ×2    │
│          │ ▓│       $50.00          │
│          │ ▓│ [IMG] Product B ×1    │
│          │ ▓│       $99.99          │
│          │ ▓├───────────────────────┤
│          │ ▓│ Subtotal     $149.99  │
│          │ ▓│ [  Checkout  ]        │
│          │ ▓│ [ View Cart ]         │
│          │ ▓└───────────────────────┘│
│          │ └───────────────────────  │
└──────────┘
```
Click overlay/✕ → `isCartOpen = false`. On mobile: full-width drawer.

### 5.7 Checkout (`/checkout`)

**Stepper:** `① Address → ② Review & Pay` (progress chips).

```
┌──────────────────────────────────────────────┬──────────────────┐
│ ① Shipping Address  →  ② Review & Pay       │ OrderSummary      │
│                                              │  [IMG] Product A ×2 │
│ AddressForm (from saved addresses + manual)  │  [IMG] Product B ×1 │
│ ┌──────────────────────────────────────────┐ │  Subtotal $149.99   │
│ │ Label: [Home ▾] / [+ New address]        │ │  Shipping $10.00    │
│ │ Line1      [__________________]          │ │  Tax $12.00         │
│ │ Line2      [____________] (optional)     │ │  ─────────────      │
│ │ City [_____] State [____] Zip [____]     │ │  Total $171.99      │
│ │ Country [United States ▾] [✓ set default] │ └────────────────────┘
│ │                                [Continue→]│                      │
│ └──────────────────────────────────────────┘                      │
├───────────────────────────────────────────────────────────────────┤
│ ② Review & Pay — PaymentForm (Stripe Hosted Checkout)            │
│ ┌──────────────────────────────────────────────┐                │
│ │  Payment methods                            │                │
│ │  ◉ Credit/Debit Card (Stripe secure checkout)│                │
│ │  (  Card fields handled by Stripe page )    │                │
│ │    "You'll be redirected to Stripe."        │                │
│ │  [  Pay $171.99  ]   ← POST /checkout/create-session         │
│ │  Test card: 4242 4242 4242 4242                             │
│ └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

**Composition:** `AddressForm` + `PaymentForm` + `OrderSummary` (read-only, always visible on right).
**Flow:** Address → OrderSummary review → `[Pay $..]` → POST `/api/checkout/create-session` → `data.url` → redirect to Stripe hosted checkout → back to `/order/success?session_id=…` (success) or `/cart` (cancel).
**Guard:** cart empty on page load → redirect to `/cart`; Continue disabled until address valid.
**Errors:** `400` cart empty → toast; `422 PAYMENT_FAILED` (Stripe side) → error state on Checkout with retry.

### 5.8 OrderConfirmation (`/order/success`)

```
┌──────────────────────────────────────────────┐
│   ✅  (success icon, large)                   │
│   Thank you for your order!                   │
│   Order #10f2c8ab-…                           │
│   Status: PAID chip                           │
├──────────────────────────────────────────────┤
│  Items:  Product A ×2  $50.00                │
│          Product B ×1  $99.99                │
│  Shipping: $10.00   Tax: $12.00              │
│  Total:  $171.99   (Visa •••• 4242)          │
├──────────────────────────────────────────────┤
│  [ Continue Shopping ]   [ View My Orders ]  │
└──────────────────────────────────────────────┘
```

### 5.9 Orders (`/orders`)

```
┌──────────────────────────────────────────────┐
│  My Orders                                    │
│  [Status filter: [All][PENDING][PAID]… ▾]     │
│ ┌────────────────────────────────────────────┐│
│ │ #10f2c8ab   2026-08-15 [PAID chip] $171.99→││
│ ├────────────────────────────────────────────┤│
│ │ #10f2cab   2026-08-12 [SHIPPED] $44.99  → ││
│ └────────────────────────────────────────────┘│
│  Pagination ◀ 1 2 ▶                            │
│  Empty: "No orders yet" [Start shopping]       │
└──────────────────────────────────────────────┘
```

**Row:** OrderStatusBadge color mapping — PENDING=warning, PAID=success, SHIPPED=info, DELIVERED=success, CANCELLED=destructive.

### 5.10 OrderDetail (`/orders/:id`)

```
┌──────────────────────────────────────────────┐
│  Order #10f2c8ab    [PAID]  (badge, top-right)│
├──────────────────────────────────────────────┤
│  Items                                     │
│  [IMG] Product A ×2  $25.00   → $50.00       │
│  [IMG] Product B ×1  $99.99   → $99.99       │
│ ─────────────────────────────────────────────┤
│  Shipping Address                            │
│    Jane Doe                                  │
│    123 Main St, Springfield, IL 62704, US    │
│ ─────────────────────────────────────────────┤
│  Payment                                     │
│    Visa •••• 4242     $171.99   PAID         │
├──────────────────────────────────────────────┤
│  Total: $171.99                              │
│  [ Review this product ] (if delivered)      │
└──────────────────────────────────────────────┘
```

### 5.11 Profile (`/profile`)

```
┌──────────────────────────────────────────────┐
│  My Profile                        (2-col grid)│
│ ┌──────────────────┐  ┌─────────────────────┐ │
│ │ UserInfo         │  │ PasswordForm        │ │
│ │ [IMG avatar]     │  │ Current [_______]   │ │
│ │ Jane Doe         │  │ New     [_______]   │ │
│ │ jane@mail.com    │  │ Confirm [_______]   │ │
│ │ +1 555 0100      │  │ [Update Password]   │ │
│ │ [Edit Profile]   │  └─────────────────────┘ │
│ └──────────────────┘                           │
│ ┌────────────────────────────────────────────┐ │
│ │ AddressList                                │ │
│ │ [+ Add Address]                            │ │
│ │ ┌────────────────────────────────────────┐ │ │
│ │ │ Default: Home — 123 Main St, Springfield│ │ │
│ │ │          IL 62704       [Edit][Delete] │ │ │
│ │ └────────────────────────────────────────┘ │ │
│ │   Work — 45 Oak Ave, Chicago, IL 60601    │ │
│ │                              [Edit][Delete]│ │
│ └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**Composition:** `UserInfo`, `AddressList` (`AddressForm` modal), `PasswordForm`.
**Avatar upload:** `SingleUpload` (2MB, in-file validation).

### 5.12 Admin — Dashboard (`/admin`)

```
┌────────────────────────────────────────────────────────────────┐
│ Dashboard                                                    │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│ │ Revenue  │ │ Orders   │ │ Users    │ │ Products │          │
│ │ $9,240.00│ │ 12       │ │ 34       │ │ 5        │          │
│ │ +12% ↑   │ │ +3 this wk│ │ 2 new   │ │ 1 low stock│        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├──────────────────────────────┬────────────────────────────────┤
│ SalesChart (recharts line)   │ RecentOrders (last 10)         │
│ ┌──────────────────────────┐ │ ┌────────────────────────────┐ │
│ │  /│   ●          ●        │ │ │ #10f2c8ab [PAID]  $171.99  │ │
│ │ │ |      ●   ●  ●        │ │ │   Jane Doe        2026-08-15│ │
│ │ │ |   ●       ●          │ │ └────────────────────────────┘ │
│ │ └──────────────────────┘ │ │ [View all orders →]           │
│    Jul ▁▂▃▄▅▆ Aug            │ └────────────────────────────┘ │
└──────────────────────────────┴────────────────────────────────┘
```

**Composition:** `StatsCards` ×4 + `SalesChart` + `RecentOrders`.

### 5.13 Admin — Products (`/admin/products`)

```
┌────────────────────────────────────────────────────────────────┐
│  Products                                 [ + New Product ]    │
│  [Search products…]                     [Category ▾][Stock ▾]  │
│ ┌──┬──────────────┬───────┬───────┬──────────┬────────────────┐ │
│ │# │ Name         │ Price │ Stock │ Category │ Actions         │ │
│ ├──┼──────────────┼───────┼───────┼──────────┼────────────────┤ │
│ │1 │ Top T-Shirt  │$99.99 │  24   │ Clothing │ [✏️ Edit] [🗑️]   │ │
│ │2 │ Wireless Buds│$42.00 │   0 ⚠ │Electronics│ [✏️ Edit] [🗑️]  │ │
│ └──┴──────────────┴───────┴───────┴──────────┴────────────────┘ │
│  Pagination ◀ 1 2 ▶   (stock 0 row: red Stock cell)             │
└────────────────────────────────────────────────────────────────┘
```

**Composition:** `ProductTable` + pagination; delete → confirm dialog → toast.

### 5.14 Admin — ProductForm (`/admin/products/new`, `/admin/products/:id/edit`)

```
┌────────────────────────────────────────────────────────────────┐
│ Create Product                              (or "Edit Product") │
│ ┌────────────────────────────┐ ┌──────────────────────────────┐ │
│ │ Name            [________]│ │ Images (≤5)                  │ │
│ │ Description     [________]│ │ [MultiUpload dropzone]       │ │
│ │                 [textarea │ │ ┌────────┐ ┌────────┐ ┌──────┐ │ │
│ │ Price       [$____]       │ │ │  IMG   │ │  IMG   │ │  +   │ │
│ │ Stock       [____]        │ │ │ [✕]    │ │ [✕]    │ │      │ │
│ │ Category    [Select ▾]    │ │ └────────┘ └────────┘ └──────┘ │ │
│ ├────────────────────────────┴──────────────────────────────┤ │
│ │                      [ Save ]    [ Cancel ]                │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Composition:** form + `MultiUpload` (5MB/file, jpg|png|webp).
**Validation:** price ≥ 0, stock ≥ 0, name required; category select required.

### 5.15 Admin — Categories (`/admin/categories`)

```
┌────────────────────────────────────────────────────────────────┐
│  Categories                             [ + New Category ]     │
│ ┌─────────────────────────────────────────────┬───────────────┐│
│ │ Category │ Slug │ Products │ Image │ Actions │               ││
│ │ Electronics│ electronics│ 24 │[IMG] │ [✏️][🗑️]│               │
│ │ Clothing  │ clothing │ 18 │[IMG] │ [✏️][🗑️]│               │
│ └─────────────────────────────────────────────┴───────────────┘│
│ CategoryForm (modal): Name [____]  Image [SingleUpload]        │
│                        [Save] [Cancel]                         │
│  409 → "Category name exists"; delete with products → 409 error│
└────────────────────────────────────────────────────────────────┘
```

**Composition:** `CategoryTable` + modal `CategoryForm` + `SingleUpload`.

### 5.16 Admin — Orders (`/admin/orders`)

```
┌────────────────────────────────────────────────────────────────┐
│  Orders                            [Status: All ▾][Date range] │
│ ┌──────────────┬─────────┬────────┬───────┬───────────────────┐│
│ │ Order        │ Customer│ Total  │ Status│ Actions            ││
│ │ #10f2c8ab    │ Jane Doe│$171.99 │ (▾ status select) │Details││
│ │ #10f2cab     │ John    │$44.99  │ (▾ status select) │Details││
│ └──────────────┴─────────┴────────┴───────┴───────────────────┘│
│  Status dropdown cell → PATCH /api/admin/orders/:id/status      │
│  Invalid transition (e.g. DELIVERED→PENDING) → toast error 400  │
└────────────────────────────────────────────────────────────────┘
```

**Composition:** `OrderTable` (inline `OrderStatus` select) + pagination + detail drawer/page.

### 5.17 Admin — Users (`/admin/users`) — ADMIN only

```
┌────────────────────────────────────────────────────────────────┐
│  Users                                    [Role: All ▾][Search]│
│ ┌──────────┬────────────┬────────┬───────────┬───────────────┐│
│ │ User     │ Email      │ Role   │ Orders    │ Role Selector ││
│ │ Jane Doe │ j@mail.com │ Customer│ 3        │ [Customer ▾]  ││
│ │ Admin1   │ a@mail.com │ ADMIN  │ 12       │ [ADMIN ▾]     ││
│ └──────────┴────────────┴────────┴───────────┴───────────────┘│
│  Pagination ◀ 1 2 ▶                                          │
└────────────────────────────────────────────────────────────────┘
```

**Composition:** `UserTable` + inline `RoleSelector` (PATCH `/api/admin/users/:id/role`).
**Constraint:** cannot promote above your own level; cannot change own role (400 toast).

### 5.18 NotFound (all non-matched routes)

```
┌──────────────────────────────┐
│          404                 │
│    Page not found            │
│  [  Back to Home  ]          │
└──────────────────────────────┘
```

---

## 6. Shared Components

### 6.1 FileUpload

```
SingleUpload                          MultiUpload
┌────────────────────────────┐       ┌──────────────────────────────┐
│ ⬆ Drag & drop or click     │       │ ⬆ Drag & drop or click      │
│ (jpg, png, webp ≤5MB)      │       │ add many (jpeg, png, webp)   │
│ ┌────────┐                 │       │ ┌─────┐ ┌─────┐ ┌─────┐     │
│ │ IMG    │  [Replace][✕]   │       │ │ IMG │ │ IMG │ │ IMG │     │
│ └────────┘                 │       │ └─────┘ └─────┘ └─────┘     │
└────────────────────────────┘       │   progress bar per file      │
                                     └──────────────────────────────┘
```
Upload progress % per file; error toast for invalid type/size (`400`).

### 6.2 Feedback / Loading primitives

| Component | Usage |
|-----------|-------|
| `Skeleton` | Product grids, detail page, tables (pulse animation) |
| `Spinner` | Button submissions, page transitions |
| `Toast` | Success (green), error (red), info (blue); auto-dismiss 3s |
| `ErrorBoundary` | Wraps App; fallback + Retry |

### 6.3 Image Variants (MinIO thumbnail sizes per `system-design.md` §8)

| Context | Size used | Source |
|---------|-----------|--------|
| ProductGrid / ProductCard | 200×200 thumb (srcset 500 for ≤2x) | `products/…` |
| ProductDetail main image | 500×500 | `products/…` |
| ImageGallery thumbnails | 200×200 | `products/…` |
| MiniCart / CartItem / OrderSummary row | 200×200 | `products/…` |
| CategoryGrid / CategoryTable | 300×300 | `categories/…` |
| UserMenu / UserInfo avatar | 100×100 | `avatars/…` |
| ReviewImages / ReviewCard | 200×200 | `reviews/…` |

All images served via `File.url`; `alt` = product/category/user name. Fallback placeholder (`product-placeholder.svg`) when image missing.

### 6.4 Per-Page States Matrix

| Page | Loading | Empty | Error |
|------|---------|-------|-------|
| Home | 8 skeleton cards | — (keeps CategoryGrid) | "Couldn't load products" + Retry, no banner error |
| Products | 8 skeleton cards | "No products match your filters" + Clear filters | toast + Retry |
| ProductDetail | 2-col skeleton | — | 404 view ("Product not found") + Back to products |
| Cart | skeleton rows | "Your cart is empty" + Start shopping | toast + Retry |
| Checkout | spinner on button | redirect to `/cart` | toast (400/422) + stays on page |
| Orders | list skeleton | "No orders yet" + Start shopping | toast + Retry |
| OrderDetail | skeleton | — | redirect `/orders` on 403/404 |
| Profile | skeleton | — | toast + Retry |
| Admin pages (all) | table skeletons | "No records found" | toast + Retry |
| Reviews (product page) | 3 review skeletons | "No reviews yet. Be the first!" | toast only |

---

## 7. Responsive Matrix

| Breakpoint | Grid (products) | Sidebar | Header | Filters |
|------------|-----------------|---------|--------|---------|
| ≥1280 | 4 cols | full | full nav + search | left column |
| 769–1279 | 3 cols | full | condensed nav | left column |
| 641–768 | 2 cols | slide-over | hamburger | drawer (filter button) |
| ≤640 | 1 col  | slide-over | hamburger, search icon modal | drawer |

---

## 8. Penpot Implementation Notes

- One **Board per page**: name = page name (e.g. `Home`, `Products`, `Admin Dashboard`), width 1280 (desktop), plus mobile variants at 375.
- Use **design tokens** (§2) in Penpot tokens catalog so code translation (Tailwind/shadcn) maps 1:1.
- Components (Header, ProductCard, ProductTable…) built as **library components** with variants where applicable (e.g. button: default/loading/disabled; status badge: 5 states).
- Component instance names must match `system-design.md` §5 names (e.g. `FilterSidebar`, `OrderSummary`, `StatsCards`).
- Mark "interactive" parts (dropdowns, modals, drawers) as separate boards/frames stacked on the page board, in `Opacity 30%` off-position.
- Export any raster placeholders directly in Penpot; never hand-pick colors not in the token set.
- Render **dark variants** as paired boards (`Home-Dark`, `Dashboard-Dark`) for the key pages; all tokens from §2.1 dark palette.
- Image placeholders use the thumbnail aspect ratios listed in §6.3 (square 200/300/500).
