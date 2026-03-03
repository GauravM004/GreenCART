Project Overview — QuickCart (Online Grocery / Ecommerce Platform)

QuickCart is a full-stack ecommerce grocery platform built as a production-style advanced monolith, focusing on correctness, performance, security, and real business workflows.

The application is divided into two clearly separated systems:

User-facing website

Admin dashboard

User Website Overview

The user side focuses on product discovery, smooth checkout, and order tracking.

Users authenticate using OAuth 2.0, allowing frictionless login without password management. Once logged in, users can browse products on the landing and product listing pages, apply category-based filters, and view individual product detail pages.

The cart system is globally accessible through:

A navbar cart icon with live item count

A floating cart component (similar to Zomato/Blinkit UX)

Users follow a complete ecommerce workflow:

Browse products

Add items to cart

Enter delivery address

Complete payment via Stripe

View order success confirmation

Track current and previous orders in the My Orders section

Orders have a real lifecycle:

Getting order ready

Out for delivery

Delivered

These statuses are updated by admin actions and synced back to the user interface.

To improve performance, in-memory caching is applied to read-heavy endpoints such as product listings and category pages, reducing repeated database queries. Rate limiting protects sensitive routes like authentication and order creation from abuse.

Admin Dashboard Overview

The admin panel is protected using JWT-based authentication and provides full operational control over the platform.

Admins can:

View a dashboard showing total products, sales, revenue, stock levels, and top-selling items

Manage inventory by:

Adding new products

Updating stock

Toggling product visibility

Upload and manage product images using Cloudinary, storing only optimized image URLs in the database

View all user orders in the Orders Received section

Update order status, which is immediately reflected on the user’s My Orders page

Admin-side APIs are also protected with rate limiting to prevent misuse and accidental overload.

Backend & System Design Highlights

Built as a monolithic Node.js + Express backend

Clean layered architecture (routes → controllers → services → DB)

MongoDB for data storage with proper modeling for users, products, orders, and inventory

Stripe idempotency implemented to ensure:

No duplicate payments

Safe retries on network or webhook failures

In-memory caching for performance optimization

Rate limiting middleware for system protection

Clear separation of concerns between user and admin workflows

The project intentionally avoids premature microservices and instead strengthens the monolith using advanced monolith system-design practices.

What This Project Demonstrates

This project shows that you can:

Build end-to-end real-world features

Think in terms of system evolution

Optimize performance without over-engineering

Protect critical APIs

Handle payments safely

Design admin-to-user data synchronization

One-Line Interview Summary (Very Important)

“QuickCart is a full-stack ecommerce grocery platform built as an advanced monolith, featuring OAuth-based user authentication, JWT-secured admin controls, Stripe payments with idempotency, in-memory caching, rate limiting, inventory management, and a fully synchronized order lifecycle.”