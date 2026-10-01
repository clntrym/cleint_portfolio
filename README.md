# Minimalist Monochrome Full-Stack Portfolio with Admin CMS & phpMyAdmin Database

A complete, production-ready full-stack personal portfolio website with a private Admin Dashboard and MySQL/phpMyAdmin database. Built with a minimalist black, white, and gray monochrome color palette, inspired by clean typography and developer-first design systems.

---

## Architecture & Technology Stack

- **Frontend:** Vue 3 (Composition API), VueRouter 4, Tailwind CSS (Standalone Engine), Lucide Icons, SweetAlert2
- **Backend:** PHP 8+ (PDO REST API, Prepared Statements, Secure Session Authentication, CSRF/XSS Mitigation)
- **Database:** MySQL / MariaDB via phpMyAdmin (`portfolio_db`)
- **Visual Palette:** Strict Minimalist Monochrome (Black `#09090b`, Charcoal `#18181b`, Grays `#27272a` to `#f4f4f5`, White `#ffffff`)

---

## File Structure Reference

```
portfolio_Cleint/
├── api/                        # PHP Backend REST API
│   ├── auth.php                # Authentication, sessions, password updates
│   ├── education.php           # Education CRUD
│   ├── experience.php          # Experience timeline CRUD
│   ├── messages.php            # Public contact form & admin inbox
│   ├── profile.php             # Profile & biography management
│   ├── projects.php            # Projects catalog CRUD, slug resolution
│   ├── resume.php              # PDF resume upload & download
│   ├── settings.php            # Website settings & preferences
│   ├── skills.php              # Skills & proficiencies CRUD
│   ├── social_links.php        # Social accounts management
│   ├── stats.php               # Overview dashboard metrics
│   └── upload.php              # Secure image upload handler
├── assets/                     # Static media & placeholders
├── config/
│   ├── .htaccess               # Blocks direct web access
│   └── config.php              # Database connection (PDO) & session security
├── css/
│   └── style.css               # Monochrome styling, fonts, custom scrollbars
├── database/
│   └── portfolio_db.sql        # Database schema & initial seed data
├── js/
│   ├── components/             # Reusable UI components
│   │   ├── app-footer.js       # Public footer
│   │   ├── app-icon.js         # Lucide icon renderer
│   │   ├── app-modal.js        # Accessible modal dialog
│   │   ├── app-navbar.js       # Sticky public navbar with mobile drawer
│   │   ├── app-sidebar.js      # Admin CMS sidebar
│   │   ├── app-topbar.js       # Admin top navigation
│   │   ├── confirm-modal.js    # Delete & action confirmation modal
│   │   ├── form-field.js       # Form inputs with validation feedback
│   │   └── status-badge.js     # Monochrome status pills
│   ├── lib/
│   │   ├── alerts.js           # SweetAlert2 monochrome alerts & toasts
│   │   └── api.js              # Centralized Fetch API client
│   ├── vendor/
│   │   └── sweetalert2.all.min.js
│   ├── views/
│   │   ├── admin/              # Private Admin CMS Views
│   │   │   ├── dashboard-page.js
│   │   │   ├── education-page.js
│   │   │   ├── experience-page.js
│   │   │   ├── login-page.js
│   │   │   ├── messages-page.js
│   │   │   ├── profile-page.js
│   │   │   ├── projects-page.js
│   │   │   ├── resume-page.js
│   │   │   ├── settings-page.js
│   │   │   ├── skills-page.js
│   │   │   └── social-links-page.js
│   │   ├── public/             # Public Portfolio Views
│   │   │   ├── home-page.js
│   │   │   └── project-detail-page.js
│   │   └── not-found.js        # 404 handler
│   ├── controller.js           # Application root mounting
│   ├── labels.js               # Category options, icons, labels
│   ├── model.js                # Data access services
│   ├── navigation.js           # Smooth scrolling & icon helper
│   ├── router.js               # VueRouter 4 configuration & route guards
│   ├── store.js                # Global reactive state (auth, theme)
│   └── tailwind.config.js      # Tailwind monochrome design tokens
├── uploads/                    # User uploaded assets
│   ├── education/
│   ├── profile/
│   ├── projects/
│   └── resume/
├── Vue.js/vue-app/             # Embedded offline vendor libraries
│   ├── js/ (Vue.js, VueRouter.js, tailwindcss.js)
│   └── resources/ (lucide.min.js, sweetalert2@11.js)
├── .htaccess                   # Apache security directives
├── index.html                  # Single-Page Application entry point
└── README.md
```

---

## Database Setup & phpMyAdmin

1. Start **Apache** and **MySQL** in the **XAMPP Control Panel**.
2. Open your browser and navigate to **phpMyAdmin**:
   ```
   http://localhost/phpmyadmin/
   ```
3. The database `portfolio_db` is already created and populated!
4. If you ever need to recreate or reset the database:
   - Click **Import** in phpMyAdmin.
   - Choose the file [`database/portfolio_db.sql`](file:///c:/xampp/htdocs/portfolio_Cleint/database/portfolio_db.sql).
   - Click **Go**.

---

## Admin Credentials

- **URL:** `http://localhost/portfolio_Cleint/#/admin/login`
- **Username / Email:** `admin` (or `admin@portfolio.com`)
- **Default Password:** `admin123`

> **Note:** Once logged in, navigate to **Settings** -> **Admin Account Security** to update your password to a private password of your choice.

---

## Running the Application

Since the project resides in `C:\xampp\htdocs\portfolio_Cleint`, simply visit in your browser:

- **Public Portfolio:**
  ```
  http://localhost/portfolio_Cleint/
  ```
- **Admin Dashboard:**
  ```
  http://localhost/portfolio_Cleint/#/admin
  ```

---

## Key Features

1. **Monochrome Aesthetic:**
   - Pure black, white, and neutral grays.
   - Built-in theme switcher (Light / Dark mode) in both Public and Admin areas.
2. **Hero & About Section:**
   - Dynamically loaded from `profiles` table.
   - Real-time profile image upload, availability badges, location, career goals.
3. **Skills Section:**
   - Categorized by Frontend, Backend, Database, Tools, etc.
   - Percentage proficiency indicators and Lucide icons.
4. **Projects Management:**
   - Category filtering (All, Web App, FinTech, DevOps, etc.).
   - Card previews and full dedicated pages (`/#/projects/slug`).
   - Image uploader storing files directly in `uploads/projects/`.
   - Technologies tagging, GitHub & Live Preview links.
   - Instant toggle for Published and Featured statuses.
5. **Career & Education:**
   - Timeline display for work history with currently working indicator.
   - Academic records with online certificate verification links.
6. **PDF Resume Manager:**
   - Upload new PDF resume with automatic type validation.
   - Public "Download Resume" CTA button with download counter/stream.
7. **Contact Form & Admin Inbox:**
   - Public contact form with live input validation and honeypot anti-spam.
   - Messages saved in database and instantly reflected in the Admin Inbox.
   - Mark as read/unread, reply via email link, delete message.
