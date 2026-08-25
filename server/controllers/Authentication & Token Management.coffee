Authentication & Token Management

├── JWT Authentication
├── Session Authentication
├── OAuth 2.0
├── Access vs Refresh Tokens
├── Token Storage Strategies
│      ├── Memory
│      ├── localStorage
│      ├── sessionStorage
│      ├── Cookies
│      ├── HttpOnly Cookies
│      ├── Secure Cookies
│      └── SameSite Cookies
├── Token Refresh Flow
├── Token Rotation
├── Token Revocation
├── XSS Protection
├── CSRF Protection
└── Browser Security


#####################

Browser

├── Memory (RAM)
├── Local Storage
├── Session Storage
├── Cookies
└── IndexedDB

######################

| Property          | Purpose                          |
| ----------------- | -------------------------------- |
| HttpOnly          | JS cannot read cookie            |
| Secure            | HTTPS only                       |
| SameSite          | CSRF protection                  |
| Max-Age / Expires | Expiration                       |
| Path              | Which URLs receive the cookie    |
| Domain            | Which domains receive the cookie |


| Storage         | Refresh               | Close Browser         | JS Access                    | Auto Sent to Server |
| --------------- | --------------------- | --------------------- | ---------------------------- | ------------------- |
| Memory          | ❌                     | ❌                     | ✅                            | ❌                   |
| Local Storage   | ✅                     | ✅                     | ✅                            | ❌                   |
| Session Storage | ✅                     | ❌                     | ✅                            | ❌                   |
| Cookie          | Depends on expiration | Depends on expiration | Usually yes, unless HttpOnly | ✅                   |


#######################

HTTP internals

Request

├── URL
├── Method
├── Headers
├── Body
├── Cookies
└── Query Parameters

########################

POST /products/123?page=2 HTTP/1.1
│
├── URL
│     ├── Protocol
│     ├── Domain
│     ├── Port
│     ├── Path
│     └── Query String
│
├── Method
│     └── POST
│
├── Headers
│     ├── Authorization
│     ├── Content-Type
│     ├── Accept
│     ├── Host
│     ├── Origin
│     ├── User-Agent
│     ├── Cookie
│     └── ...
│
├── Body
│     ├── quantity
│     ├── paymentMethod
│     └── address
│
└── Cookies
      ├── refreshToken
      └── theme


######################

| HTTP Request Part                             | Express Access                         |
| --------------------------------------------- | -------------------------------------- |
| Method                                        | `req.method`                           |
| Full URL                                      | `req.originalUrl`                      |
| Path                                          | `req.path`                             |
| Path Parameters                               | `req.params`                           |
| Query Parameters                              | `req.query`                            |
| Headers                                       | `req.headers`                          |
| Body                                          | `req.body`                             |
| Cookies                                       | `req.cookies` (with cookie middleware) |
| IP Address                                    | `req.ip`                               |
| Authenticated User (added by your middleware) | `req.user`                             |
