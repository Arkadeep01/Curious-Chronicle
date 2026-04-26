Build a full-stack blog platform UI called "Curious Chronicle" with the following pages, components, and features. Use a clean, modern editorial design — dark navy/indigo sidebar, white content area, with olive/green accents. Use TailwindCSS throughout.

---

## 🔐 AUTH PAGES

### 1. Register Page (`/register`)
- Fields: Full Name, Email, Password, Confirm Password
- Submit button → POST /api/v1/user/register/
- Link to Login page

### 2. Login Page (`/login`)
- Fields: Email, Password
- Submit → POST /api/v1/user/token/
- On success: store access token + refresh token in localStorage
- Decode JWT to extract: full_name, email, username
- Link to Forgot Password

### 3. Forgot Password Page (`/forgot-password`)
- Field: Email
- Submit → POST /api/v1/user/password-reset/
- Show success message: "Password reset email sent"

### 4. Create New Password Page (`/create-password`)
- Reads query params: ?otp=...&uid=...&token=...
- Fields: New Password
- Submit → POST /api/v1/user/password-change/
- Payload: { otp, uid, password, token }

---

## 🌐 PUBLIC PAGES

### 5. Home / Blog Feed (`/`)
- Fetch all active posts → GET /api/v1/post/lists/
- Display posts as cards with: cover image, title, category badge, author avatar + name, date, view count
- Sidebar: Category list → GET /api/v1/post/category/list/
  - Each category shows title, image, post count
  - Clicking filters posts → GET /api/v1/post/category/posts/{category_slug}/

### 6. Post Detail Page (`/post/{slug}`)
- Fetch → GET /api/v1/post/details/{slug}/
- Show: cover image, title, category, tags (as chips), author info (avatar, bio), description/body, view count, like count
- Like button (heart icon) → POST /api/v1/post/likes-post/ with { user_id, post_id }
  - Toggle liked/unliked state
- Bookmark button → POST /api/v1/post/bookmarks/ with { user_id, post_id }
  - Toggle bookmarked/un-bookmarked state
- Comments section below the post:
  - Show existing comments (with reply if any) from post data
  - Add comment form → POST /api/v1/post/comments/ with { post, name, email, comment }

---

## 👤 USER PROFILE PAGE (`/profile/{user_id}`)
- Fetch → GET /api/v1/user/profile/{user_id}
- Display: avatar, full name, bio, about, country, facebook, twitter links
- Edit mode (PUT /api/v1/user/profile/{user_id}):
  - Fields: full_name, bio, about, country, facebook, twitter, image upload

---

## 📊 AUTHOR DASHBOARD (protected, `/dashboard`)

Use a sidebar layout with dark indigo sidebar (matching jazzmin admin theme).

Sidebar links:
- Dashboard (stats overview)
- My Posts
- Comments
- Notifications
- Create Post

### Dashboard Home (`/dashboard`)
- 4 stat cards → GET /api/v1/author/dashboard/stats/{user_id}/
  - 👁 Total Views
  - 📝 Total Posts  
  - ❤️ Total Likes
  - 🔖 Total Bookmarks
- Use icons and large numbers, styled like an analytics dashboard

### My Posts (`/dashboard/posts`)
- Fetch → GET /api/v1/author/dashboard/post-list/{user_id}/
- Table with columns: Title, Category, Status (Active/Draft/Disabled badge), Date
- Each row has Edit and Delete buttons
- Delete → DELETE /api/v1/author/dashboard/post-detail/{user_id}/{post_id}/

### Create Post (`/dashboard/create-post`)
- Form fields:
  - Title (text)
  - Description (rich textarea)
  - Category (dropdown, fetched from /api/v1/post/category/list/)
  - Tags (comma-separated text input)
  - Cover Image (file upload with preview)
  - Status (select: Active / Draft / Disabled)
- Submit → POST /api/v1/author/dashboard/post-create/
- Payload: { user_id, title, image, description, tags, category, post_status }

### Edit Post (`/dashboard/post/{post_id}`)
- Pre-fill form → GET /api/v1/author/dashboard/post-detail/{user_id}/{post_id}/
- Same form as Create Post
- Submit → PATCH /api/v1/author/dashboard/post-detail/{user_id}/{post_id}/

### Comments (`/dashboard/comments`)
- Fetch → GET /api/v1/author/dashboard/comment-list/{user_id}/
- Table: Post title, Commenter name, Email, Comment text, Reply (if any)
- Each row has a "Reply" button → opens inline text area
- Submit reply → POST /api/v1/author/dashboard/reply-comment/ with { comment_id, reply }

### Notifications (`/dashboard/notifications`)
- Fetch unseen → GET /api/v1/author/dashboard/noti-list/{user_id}/
- List of notifications: Post title, Type (Like / Comment / Bookmark), Date
- "Mark as Seen" button per notification → POST /api/v1/author/dashboard/noti-mark-seen/ with { noti_id }
- Show a badge count on the sidebar Notifications link

---

## 🧩 SHARED COMPONENTS

- **Navbar**: Logo ("Curious Chronicle"), nav links (Home, Categories), Login/Register or user avatar dropdown (Profile, Dashboard, Logout)
- **Category Badge**: colored pill with category name
- **Post Card**: image thumbnail, title, category, author avatar + name, date, view count
- **Toast notifications** for all API success/error responses
- **Loading spinners** for all async fetches
- **Protected Route wrapper**: redirect to /login if no token in localStorage

---

## 🎨 DESIGN SYSTEM

- Primary color: Indigo (#4F46E5)
- Accent: Olive green (#84923A)
- Background: White / Light gray (#F9FAFB)
- Sidebar: Dark indigo (#1E1B4B)
- Typography: Inter or similar clean sans-serif
- Rounded cards with subtle shadows
- Status badges: green (Active), yellow (Draft), red (Disabled)

---

## ⚙️ TECHNICAL NOTES

- Base API URL: `http://localhost:8000/api/v1/`
- JWT auth: attach `Authorization: Bearer <access_token>` header on protected requests
- Token refresh: POST /api/v1/user/token/refresh/ with { refresh }
- All image URLs served from `http://localhost:8000/media/`
- Use axios with an interceptor for token attachment and refresh
- Use React Router for all routing
- Use React Context or Zustand for auth state (user info from decoded JWT)