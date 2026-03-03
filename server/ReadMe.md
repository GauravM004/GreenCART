QuickCart | React.js, Node.js, Express.js, RESTful APIs, MongoDB, Stripe, OAuth 2.0, JWT, Cloudinary
i) Built a full-stack ecommerce grocery platform with separate user website and admin dashboard, following a clean monolithic architecture

ii) Implemented OAuth 2.0 authentication for users and JWT-based authentication for admins, ensuring secure role-based access control

iii) Developed a complete purchase lifecycle: [product browsing → cart → address → Stripe payment → order confirmation → order tracking]

iv) Designed an admin-controlled order lifecycle: [Getting order ready → Out for delivery → Delivered with real-time status sync to users order] 

v) Added in-memory caching for read-heavy endpoints like product listings and category pages to reduce database load and improve response time

vi) Integrated rate-limiting middleware on sensitive APIs (user auth, orders, admin actions) to protect the system from abuse and accidental overload

vii)Implemented Stripe payment idempotency to prevent duplicate charges during retries or network failures

viii) Built inventory and stock management features including product creation, stock updates, visibility toggling, and sales analytics

ix) Used Cloudinary for scalable product image uploads, optimization, and CDN-based delivery

x) Deployed the application on Vercel, following production-style API and environment configuration practices