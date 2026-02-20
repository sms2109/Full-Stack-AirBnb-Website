# 🏠 Full-Stack Airbnb Website

A fully functional Airbnb-style booking platform built using **Node.js, Express.js, MongoDB, and EJS** following the **MVC architecture**.  
Users can create listings, upload images, leave reviews, and explore properties with interactive maps.

🌐 **Live Demo:**  
👉 https://full-stack-airbnb-website-1.onrender.com

---

## 🚀 Features

- 🔐 Secure Authentication & Authorization (Passport.js + Sessions)
- 🏡 Create, Edit, Delete Property Listings (Full CRUD)
- 📝 Add & Manage Reviews
- 🗺️ Interactive Maps using Leaflet.js
- ☁️ Image Upload & Storage with Cloudinary
- 📱 Responsive UI using Bootstrap
- 🗂️ Clean MVC Project Structure
- 🛡️ Input Validation & Error Handling

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Express-Session

### Frontend
- EJS (Templating Engine)
- Bootstrap 5
- Leaflet.js

### Cloud Services
- Cloudinary (Image Storage)
- Render (Deployment)

---

## 📁 Project Structure


Full-Stack-Airbnb/
│
├── controllers/              # Route controller logic
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/                   # Mongoose models
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/                   # Express routes
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/                    # EJS templates
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── partials/
│
├── public/                   # Static assets
│   ├── css/
│   ├── js/
│   └── images/
│
├── utils/                    # Utility classes/functions
│   └── ExpressError.js
│
├── init/                     # Database initialization & seeding
│   ├── init.js               # DB connection setup
│   └── index.js              # Seed data execution
│
├── app.js                    # Main Express app
├── cloudConfig.js            # Cloudinary configuration
├── middleware.js             # Custom middleware
├── schema.js                 # Joi validation schemas
├── .gitignore
├── package.json
└── package-lock.json

