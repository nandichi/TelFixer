# TelFixer Website - Claude AI Development Prompt

## PROJECT OVERVIEW

Je bouwt een **volledig functionele e-commerce refurbished elektronics repair & sales platform** voor TelFixer. Dit is een platform waar klanten:
- Kapotte/oude apparaten kunnen inleveren voor reparatie en aankoopbod
- Refurbished apparaten kunnen kopen (telefoons, laptops, tablets, etc.)
- De status van hun reparatiegeval kunnen volgen

De website combineert elementen van:
- **rebuy.nl** (refurbished elektronics marketplace met transparante waardebepaling)
- **telefoonstar.nl** (professionele telefoon reparatie servicecenter)

---

## TECH STACK & ARCHITECTURE

### Frontend
- **Framework**: Next.js 14+ (React)
- **Styling**: Tailwind CSS met custom color theme
- **State Management**: React Context API of Zustand
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Consideer shadcn/ui of custom components
- **File Uploads**: Next.js API routes + client-side handling

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password + OAuth opcional)
- **Real-time**: Supabase Realtime para updates
- **Storage**: Supabase Storage para device images
- **API**: Next.js API Routes (serverless functions)

### Deployment
- **Hosting**: Vercel (optimized for Next.js)
- **Database Hosting**: Supabase Cloud

---

## DESIGN SYSTEM & BRANDING

### Color Palette
```
Primary/Dark Teal: #094543
White/Background: #FFFFFF
Dark Charcoal/Text: #2C3E48
```

### Design Principles
- **Rounded Corners**: Alle buttons, cards, en interactive elements hebben afgeronde hoeken
- **Clean Modern**: Minimalistisch design met duidelijke hierarchy
- **Professioneel**: Inspireert vertrouwen in reparatie & refurbished producten
- **Mobile-First**: Responsive design met focus op mobile experience

---

## CORE FEATURES - CUSTOMER SIDE

### 1. Homepage / Landing Page
- **Hero Section**: Duidelijke value proposition (snelle reparatie, kwaliteit refurbished)
- **Featured Products**: Bestselling refurbished devices showcase
- **Service Explanation**: Hoe TelFixer werkt (3-stap proces)
- **Trust Indicators**: Warranty info, repair quality ratings, customer reviews
- **CTA Buttons**: "Refurbished kopen", "Apparaat inleveren voor reparatie"

### 2. Product Catalog (Refurbished Apparaten)
- **Filter System**: 
  - Category (Telefoons, Laptops, Tablets, Accessoires)
  - Brand (Apple, Samsung, etc.)
  - Price Range
  - Condition Grade (Als nieuw, Zeer goed, Goed, Sterk gebruikt)
  - Storage/Memory variants
- **Product Cards**: 
  - Product image (multiple angles)
  - Name, price, old price (savings highlight)
  - Condition badge
  - Star rating + review count
  - "Add to cart" button
- **Product Detail Page**:
  - Full image gallery
  - Detailed specifications
  - Condition description + what's included
  - Warranty information
  - Customer reviews with ratings
  - "Add to cart" + "Add to wishlist"

### 3. Repair Service (Inlevering apparaten)
- **Sell/Repair Form**:
  - Device type selector (dropdown)
  - Device condition description (text area)
  - Photo upload (device images)
  - Personal info (name, email, phone, address)
  - Preferred contact method
  - Terms & conditions acceptance
- **Submission Confirmation**:
  - Reference number generated
  - Instructions for shipping/delivery
  - Estimated evaluation timeline
- **Order/Repair Tracking**:
  - Track status by reference number
  - Status updates: Received → Evaluated → Offer Made → Accepted/Rejected

### 4. Shopping Cart & Checkout
- **Cart Page**:
  - Product list with quantity adjust
  - Remove items
  - Subtotal, shipping, tax calculation
  - Continue Shopping / Checkout buttons
- **Checkout Flow** (multi-step):
  - Shipping Address
  - Billing Address (same/different)
  - Payment Method (iDEAL, Credit Card, PayPal)
  - Order Review
  - Payment Processing (Stripe/Mollie integration)
- **Order Confirmation**:
  - Order number
  - Estimated delivery date
  - Email confirmation sent
  - Link to order tracking

### 5. User Account / Dashboard
- **Account Management**:
  - Profile info (name, email, address)
  - Password change
  - Saved addresses
- **Order History**:
  - Past purchases
  - Order status
  - Reorder option
- **Repair/Inlevering History**:
  - Submitted devices
  - Current status
  - Offer details (if applicable)
- **Wishlist**:
  - Saved refurbished devices
  - Price drop notifications

### 6. Additional Pages
- **About Us**: Company story, mission, why refurbished
- **FAQ**: Common questions about repair process, refurbished products
- **Contact**: Contact form, phone, email, physical location
- **Warranty & Returns**: Policy information

---

## CORE FEATURES - ADMIN DASHBOARD

### Admin Authentication
- **Secure Login**: Admin panel requires authentication
- **Role-Based Access**: (Optional) Support staff vs full admin

### 1. Product Management
- **Product CRUD**:
  - Add new refurbished products
  - Edit product details (name, price, description, specs)
  - Upload/manage product images (multiple images per product)
  - Set condition grade
  - Bulk price updates
  - Inventory management (stock quantity)
  - Mark products as featured/sale
- **Category Management**:
  - Create/edit/delete product categories
  - Organize products by category

### 2. Repair/Inlevering Management
- **Incoming Submissions**:
  - View all device submissions
  - Filter by status (new, evaluating, offer made, etc.)
  - View photos & details submitted by customers
  - Add evaluation notes
- **Offer Management**:
  - Create/edit/send price offers to customers
  - Track offer status (sent, accepted, rejected)
  - Generate automatic offers based on condition
- **Repair Status Updates**:
  - Update repair status (Received → Evaluating → Offer Made → Accepted/Completed)
  - Send status notifications to customers via email

### 3. Order Management
- **View Orders**:
  - List all orders with filters (date, status, customer)
  - Order details (items, customer, shipping address, payment status)
- **Order Status Updates**:
  - Mark orders as processing, shipped, delivered
  - Generate shipping labels
  - Add tracking numbers
- **Order Analytics**:
  - Total orders, revenue
  - Top-selling products
  - Recent orders summary

### 4. Customer Management
- **Customer Directory**:
  - List all registered customers
  - Customer details (email, phone, addresses, purchase history)
  - Search/filter customers
- **Messages/Support Tickets** (optional):
  - View customer inquiries
  - Mark as resolved/unresolved

### 5. Settings & Configuration
- **Site Settings**:
  - Company info (name, address, phone, email)
  - Shipping settings (costs, zones, estimated delivery times)
  - Tax settings
  - Currency & localization
- **Email Templates** (optional):
  - Order confirmation email template
  - Repair status update templates
  - Offer emails
- **Analytics Dashboard**:
  - Total revenue
  - Orders this month
  - Popular products
  - Repair submissions vs sales ratio

---

## DATABASE SCHEMA (Supabase)

### Core Tables

**users**
```
id, email, password_hash, first_name, last_name, phone, created_at, updated_at
```

**addresses**
```
id, user_id, street, city, postal_code, country, is_default, created_at
```

**products**
```
id, name, category_id, brand, price, original_price, condition_grade, 
description, specifications, stock_quantity, image_urls, warranty_months, 
featured, created_at, updated_at
```

**categories**
```
id, name, slug, description, created_at
```

**device_submissions** (inlevering/repair)
```
id, reference_number, user_id, device_type, condition_description, 
photos_urls, status, evaluation_notes, offered_price, offer_accepted, 
created_at, updated_at
```

**orders**
```
id, order_number, user_id, total_price, shipping_cost, tax, 
status, shipping_address_id, billing_address_id, 
payment_status, payment_method, created_at, updated_at
```

**order_items**
```
id, order_id, product_id, quantity, price_at_purchase, created_at
```

**admins**
```
id, email, password_hash, role, created_at, updated_at
```

---

## KEY FUNCTIONALITY DETAILS

### Image Handling
- Products: Multiple images, thumbnail generation
- Device submissions: Multiple customer photos with upload preview
- Supabase Storage buckets: `products` and `submissions`

### Email Notifications
- Order confirmation to customer
- Repair status updates
- Price offer notifications
- Admin notifications for new submissions

### Search & Filtering
- Product search by name/brand
- Faceted filtering (category, price, condition)
- Admin filters (order status, date range, customer)

### Mobile Responsiveness
- All pages fully responsive
- Mobile-optimized navigation (hamburger menu)
- Touch-friendly buttons and forms
- Mobile checkout optimized

---

## DESIGN & UX GUIDELINES

### Layout Standards
- **Max-width container**: ~1200px for desktop
- **Padding**: Consistent spacing using 16px/8px grid
- **Typography**: Clear hierarchy with system fonts
- **Buttons**: Rounded corners, hover/active states, loading states
- **Forms**: Clear labels, error messages, validation feedback

### Navigation
- **Header**: Logo (left), nav menu (center/right), user account icon (right)
- **Footer**: Links, contact info, social media, copyright
- **Mobile**: Hamburger menu for navigation

### Color Usage
- **Primary (#094543)**: CTAs, active states, highlights
- **White (#FFFFFF)**: Backgrounds, cards
- **Dark (#2C3E48)**: Text, dark mode option
- **Neutrals/Grays**: Borders, secondary elements

---

## ADDITIONAL REQUIREMENTS

### Security
- CSRF protection
- SQL injection prevention (use parameterized queries via Supabase)
- XSS protection (sanitize user inputs)
- Secure password hashing
- Environment variables for sensitive data

### Performance
- Image optimization (next/image)
- Code splitting
- Database query optimization
- Caching strategy for static content

### Testing
- Unit tests for critical functions
- Integration tests for API routes
- E2E tests for checkout flow (optional)

### Documentation
- Code comments for complex logic
- README with setup instructions
- API documentation for custom endpoints

---

## DELIVERY EXPECTATIONS

### Scope - Phase 1 (MVP)
1. Homepage with service explanation
2. Product catalog with filtering
3. Product detail pages
4. Shopping cart & checkout (Stripe/Mollie)
5. Device submission form
6. User registration & login
7. Order tracking (basic)
8. Admin dashboard (product & order management)
9. Email notifications (basic)

### Scope - Future Phases (Nice to Have)
- Advanced analytics dashboard
- Customer reviews & ratings system
- Wishlist with price notifications
- Admin bulk operations
- Custom offer generation algorithm
- Live chat support
- Mobile app

---

## NOTES FOR DEVELOPER

- Keep the code modular and maintainable
- Use TypeScript for type safety
- Follow Next.js best practices (app router, server components where possible)
- Implement proper error handling and logging
- Use environment variables for configuration
- Create reusable components and hooks
- Document API endpoints
- Test all database queries thoroughly
- Consider security implications for each feature
- Optimize images and assets for web

---

**Version**: 1.0  
**Created**: January 2026  
**Client**: TelFixer (Ivan)  
**Developer**: [Your Name]