Build a full-stack blog platform UI called "Curious Chronicle" with the following pages, components, and features. Use a clean, modern editorial design with an indigo/white content style, subtle shadows, and green/olive accents where useful.

This project currently uses React, React Router, Bootstrap-style utility classes, custom CSS, Zustand auth state, cookie-stored JWT tokens, and Django REST Framework APIs.

---

## Auth Pages

### 1. Register Page (`/register/`)

- Fields: Full Name, Email, Password, Confirm Password
- Submit button: `POST /api/v1/user/register/`
- Payload: `{ full_name, email, password, password2 }`
- On successful registration, the helper logs the user in, then the current UI redirects to `/login/`
- Backend registration creates:
  - a `User` row
  - a matching `Profile` row through the `post_save` signal
- Link to Login page

### 2. Login Page (`/login/`)

- Fields: Email, Password
- Submit: `POST /api/v1/user/token/`
- On success:
  - store `access_token` and `refresh_token` in cookies
  - store decoded user/token state in Zustand
  - decode JWT to extract `user_id`, `full_name`, `email`, `username`, and other claims
- Link to Forgot Password

### 3. Forgot Password Page (`/forgot-password/`)

- Field: Email
- Submit: `POST /api/v1/user/password-reset/`
- Show success message: `"Password reset email sent"`

### 4. Create New Password Page (`/create-password`)

- Reads query params: `?otp=...&uid=...&token=...`
- Fields: New Password
- Submit: `POST /api/v1/user/password-change/`
- Payload: `{ otp, uid, password, token }`

---

## Public Pages

### 5. Home / Blog Feed (`/`)

- Fetch all active posts: `GET /api/v1/post/lists/`
- Fetch categories: `GET /api/v1/post/category/list/`
- Display posts with: cover image, title, category, author profile info, date, and view count
- Category links use slug-based routes:
  - UI route: `/category/{slug}/`
  - API: `GET /api/v1/post/category/posts/{category_slug}/`

### 6. Stories Page (`/stories`)

- Fetch active posts: `GET /api/v1/post/lists/`
- Display:
  - trending stories using `TrendingSection`
  - latest stories
  - all stories

### 7. Post Detail Page (`/post/{slug}/`)

- Fetch: `GET /api/v1/post/details/{slug}/`
- Show: cover image, title, category, tags, author info, description/body, view count, like count
- Like button: `POST /api/v1/post/likes-post/`
- Like payload: `{ user_id, post_id }`
- Bookmark button: `POST /api/v1/post/bookmarks/`
- Bookmark payload: `{ user_id, post_id }`
- Comments:
  - show existing comments from post data
  - add comment with `POST /api/v1/post/comments/`
  - comment payload: `{ post_id, name, email, comment }`

---

## User Profile Page

### Profile Settings (`/profile/`)

- The frontend route is currently `/profile/`
- The page gets `user_id` from the decoded JWT via `useUserData()`
- Fetch: `GET /api/v1/user/profile/{user_id}/`
- Display/edit:
  - avatar/image
  - full_name
  - bio
  - about
  - country
  - facebook
  - twitter
- Update: `PATCH /api/v1/user/profile/{user_id}/`
- Uses `multipart/form-data` when uploading an image

---

## Author Dashboard

Dashboard pages use the decoded JWT user id from `useUserData()`. The frontend currently uses these routes:

- Dashboard: `/dashboard/`
- My Posts: `/posts/`
- Create Post: `/addpost/`
- Edit Post: `/edit-post/{id}/`
- Comments: `/comments/`
- Notifications: `/notifications/`
- Profile: `/profile/`

### Dashboard Home (`/dashboard/`)

- Stats API: `GET /api/v1/author/dashboard/stats/{user_id}/`
- Display:
  - Total Views
  - Total Posts
  - Total Likes
  - Total Bookmarks

### My Posts (`/posts/`)

- Fetch: `GET /api/v1/author/dashboard/post-list/{user_id}/`
- Table/card list should show: Title, Category, Status, Date
- Delete: `DELETE /api/v1/author/dashboard/post-detail/{user_id}/{post_id}/`

### Create Post (`/addpost/`)

- Form fields:
  - Title
  - Content/editor body for writing, preview, and published description
  - Category dropdown from `GET /api/v1/post/category/list/`
  - Tags
  - Cover Image with preview
  - Status: Draft, Scheduled, Active/Public
- Preview route: `/preview/`
- Submit: `POST /api/v1/author/dashboard/post-create/`
- Backend payload currently used:
  - `user_id`
  - `title`
  - `slug`
  - `image`
  - `description` from the frontend content/editor body
  - `tags`
  - `category` as category id
  - `post_status`
- Note: the frontend `content` field is submitted as backend `description`; there is no separate subtitle field in the create-post UI.
- Backend post creation attaches `profile` automatically from the user profile.

### Edit Post (`/edit-post/{id}/`)

- Pre-fill form: `GET /api/v1/author/dashboard/post-detail/{user_id}/{post_id}/`
- Submit: `PATCH /api/v1/author/dashboard/post-detail/{user_id}/{post_id}/`
- Uses the same backend fields as Create Post.

### Comments (`/comments/`)

- Fetch: `GET /api/v1/author/dashboard/comment-list/{user_id}/`
- Show: post title, commenter name, email, comment text, reply if any
- Reply submit: `POST /api/v1/author/dashboard/reply-comment/`
- Reply payload: `{ comment_id, reply }`

### Notifications (`/notifications/`)

- Fetch unseen: `GET /api/v1/author/dashboard/noti-list/{user_id}/`
- Show: post title, type, date
- Mark as seen: `POST /api/v1/author/dashboard/noti-mark-seen/`
- Payload: `{ noti_id }`

---

## Shared Components

- Navbar/Header:
  - Logo: "Curious Chronicle"
  - Stories link
  - Shows Login/Register links when unauthenticated
  - Shows profile dropdown when Zustand auth state has a valid access token
  - Dropdown links: Profile, Logout
- `TrendingSection` lives in `frontend/src/components/TrendingSection.jsx`
- `Preview` lives in `frontend/src/components/Preview.jsx`
- Toast notifications are used for API success/error responses
- Loading states should be shown for async fetches
- Protected behavior should check valid auth state/tokens, not only the visual profile icon

---

## Design System

- Primary color: Indigo `#4F46E5`
- Accent: Olive green `#84923A`
- Background: White / Light gray `#F9FAFB`
- Sidebar/dashboard accent: Dark indigo `#1E1B4B`
- Typography: clean sans-serif
- Rounded cards with subtle shadows
- Status badges:
  - Active/Public: green
  - Draft: yellow/neutral
  - Disabled: red

---

## Technical Notes

- Base API URL in frontend axios: `http://127.0.0.1:8000/api/v1/`
- Backend docs may also refer to: `http://localhost:8000/api/v1/`
- JWT auth:
  - access token cookie: `access_token`
  - refresh token cookie: `refresh_token`
  - Zustand persisted store: `auth-storage`
- Token refresh endpoint: `POST /api/v1/user/token/refresh/`
- Refresh payload: `{ refresh }`
- Decoded JWT should provide `user_id`; frontend may safely fall back to `id`
- Image URLs are served from Django media, usually under `http://127.0.0.1:8000/media/`
- Use React Router for routing
- Use Zustand for auth state and decoded JWT user info
- Clear both cookies and Zustand auth state on logout
