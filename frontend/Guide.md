# Frontend Guide

This guide explains what each frontend file is responsible for, so you can safely modify designs without getting lost.

## Entry Files

### `src/main.jsx`
Starts the React app.

- Finds the HTML element with `id="root"`.
- Renders `<App />`.
- Imports global CSS from `src/index.css`.

Edit this only when changing app-level providers, such as router providers, theme providers, or global context.

### `src/App.jsx`
Controls frontend routing.

- Wraps the app with `BrowserRouter`.
- Wraps routes with `MainWrapper`.
- Defines which page appears for each URL.

Important routes:

- `/` -> `views/core/index.jsx`
- `/:slug/` -> `views/core/Details.jsx`
- `/category/:slug/` -> `views/core/Category.jsx`
- `/search/` -> `views/core/Search.jsx`
- `/register/` -> `views/auth/Register.jsx`
- `/login/` -> `views/auth/Login.jsx`
- `/dashboard/` -> `views/dashboard/Dashboard.jsx`
- `/add-post/` -> `views/dashboard/AddPost.jsx`
- `/profile/` -> `views/dashboard/Profile.jsx`
- `/about/` -> `views/pages/About.jsx`
- `/contact/` -> `views/pages/Contact.jsx`

When adding a new page, create the page file first, import it here, then add a `<Route />`.

### `src/index.css`
Global browser-level styles.

Use this for:

- `html`, `body`, `#root`
- global font setup
- page background
- full-screen layout fixes

Do not put page-specific card/header/footer styles here unless they truly apply everywhere.

### `src/App.css`
Old Vite starter CSS.

This file is not the best place for your Chronicle layout. If imported, rules like `#root { max-width: 1280px; padding: 2rem; }` can stop the app from taking full width.

Use `index.css` for global layout and page/component files for design.

## Layouts

### `src/layouts/MainWrapper.jsx`
Runs before routes render.

Current purpose:

- Calls `setUser()` from `utils/auth.js`.
- Waits for auth check before showing route content.

If the whole app stays blank, check this file because it renders `null` while loading.

### `src/layouts/PrivateRoute.jsx`
Protects pages that should require login.

Current purpose:

- Reads auth state from `store/auth.js`.
- Shows loading text while auth is loading.
- Redirects unauthenticated users to `/login`.

Use this around dashboard routes later if you want dashboard pages to require login.

## Shared Partials

### `src/views/partials/header.jsx`
Top navigation bar.

Edit this when changing:

- logo/name
- navigation links
- navbar spacing
- icons
- desktop/mobile header layout

Important: this file should use `<Link />`, not `<Route />`. Routes belong in `App.jsx`.

### `src/views/partials/footer.jsx`
Footer shown at the bottom of pages.

Edit this when changing:

- newsletter block
- footer columns
- social links
- copyright
- footer spacing/background

## Plugins

### `src/plugin/moment.js`
Small date formatting helper.

Input: a date.  
Output: formatted date like `24 Apr, 2026.`

Use this when you want consistent date display.

### `src/plugin/toast.js`
SweetAlert toast helper.

Use it like:

```js
Toast("success", "Post created");
Toast("error", "Something went wrong");
```

Edit this when changing toast position, duration, or styling.

### `src/plugin/useUserData.js`
Custom hook for reading logged-in user data from JWT cookies.

Current purpose:

- Reads `access_token` from cookies.
- Decodes the JWT.
- Removes expired tokens.
- Returns user data such as `user_id`.

Use this in pages that need the current logged-in user.

## Store

### `src/store/auth.js`
Zustand auth store.

Stores:

- `user`
- `accessToken`
- `refreshToken`
- `loading`

Actions:

- `setAuth`
- `setUser`
- `setTokens`
- `logout`
- `setLoading`
- `isLoggedIn`

Use this when a component needs global auth state.

## Utilities

### `src/utils/axios.js`
Basic Axios instance for API calls.

Base URL:

```js
http://127.0.0.1:8000/api/v1/
```

Use this for public requests like:

- post list
- category list
- post detail
- comments

### `src/utils/useAxios.js`
Authenticated Axios hook.

Current purpose:

- Adds `Authorization: Bearer <token>` when available.
- Refreshes expired access tokens.
- Redirects to `/login` on auth failure.

Use this later for dashboard/private API requests.

### `src/utils/auth.js`
Authentication functions.

Contains:

- `login(email, password)`
- `register(full_name, email, password, password2)`
- `logout()`
- `setUser()`
- `setAuthUser(access, refresh)`
- `getRefreshToken()`
- `isAccessTokenExpired(token)`

Edit this when changing login/register behavior, cookie behavior, or token handling.

### `src/utils/constants.js`
Shared constants.

Should contain values like:

- `API_BASE_URL`
- `SERVER_URL`
- `CLIENT_URL`
- currency/sign constants

Avoid calling hooks or user-data functions directly in this file. Constants should stay simple.

## Core Public Pages

### `src/views/core/index.jsx`
Home page.

Responsible for:

- loading all posts
- loading categories
- showing trending/latest posts
- showing popular posts
- pagination
- like/bookmark actions

Design edits:

- post card layout
- homepage sections
- category preview section
- spacing between homepage blocks

Backend calls used:

- `GET post/lists/`
- `GET post/category/list/`
- `POST post/likes-post/`
- `POST post/bookmarks/`

### `src/views/core/Details.jsx`
Single Chronicle post page.

Responsible for:

- loading one post by slug
- showing title, category, author, content, tags
- showing comments
- submitting a new comment

Design edits:

- article hero section
- author sidebar
- content typography
- comments section
- comment form

Backend calls used:

- `GET post/details/:slug/`
- `POST post/comments/`

### `src/views/core/Category.jsx`
Category page.

Responsible for:

- loading posts for one category slug
- showing category title and article count
- paginating category posts

Design edits:

- category header
- category post card grid
- pagination controls

Backend call used:

- `GET post/category/posts/:slug/`

### `src/views/core/Search.jsx`
Search page.

Responsible for:

- loading posts
- filtering posts by title, author, or category on the frontend
- showing search results

Design edits:

- search input
- result cards
- empty state

Backend call used:

- `GET post/lists/`

## Auth Pages

### `src/views/auth/Register.jsx`
Registration page.

Responsible for:

- full name/email/password form
- password confirmation validation
- calling `register()` from `utils/auth.js`
- navigating after successful registration

Design edits:

- signup card
- input layout
- button style

### `src/views/auth/Login.jsx`
Login page.

Responsible for:

- email/password form
- calling `login()` from `utils/auth.js`
- navigating after successful login

Design edits:

- signin card
- remember/forgot-password area
- button style

### `src/views/auth/Logout.jsx`
Logout page.

Responsible for:

- calling logout behavior
- showing logout UI/confirmation

### `src/views/auth/ForgotPassword.jsx`
Forgot password page.

Responsible for password reset request UI.

### `src/views/auth/CreatePassword.jsx`
Create/reset password page.

Responsible for new password form UI.

## Dashboard Pages

### `src/views/dashboard/Dashboard.jsx`
Author dashboard overview.

Responsible for:

- loading dashboard stats
- recent posts
- recent comments
- notifications

Design edits:

- stat cards
- dashboard grid
- recent activity panels

### `src/views/dashboard/Posts.jsx`
Dashboard post list.

Responsible for:

- loading posts for current user
- searching/sorting posts
- linking to add/edit post pages

Design edits:

- table layout
- post image cells
- action buttons

### `src/views/dashboard/AddPost.jsx`
Create post page.

Responsible for:

- post creation form
- category select
- image upload
- description editor/input
- submit to backend

Design edits:

- form layout
- editor layout
- upload UI

### `src/views/dashboard/EditPost.jsx`
Edit existing post page.

Responsible for:

- loading existing post data
- updating post fields
- submitting edits

Design edits:

- same form design as AddPost
- edit-specific controls

### `src/views/dashboard/Comments.jsx`
Dashboard comment management.

Responsible for:

- listing comments on author posts
- replying to comments

Design edits:

- comment table/list
- reply box

### `src/views/dashboard/Notifications.jsx`
Dashboard notifications.

Responsible for:

- listing notifications
- marking notifications as seen

Design edits:

- notification list
- seen/unseen states

### `src/views/dashboard/Profile.jsx`
User profile page.

Responsible for:

- loading profile
- editing profile fields
- uploading profile image

Design edits:

- profile form
- avatar area
- personal info layout

## Static Pages

### `src/views/pages/About.jsx`
About page.

Edit this for brand story, team, mission, and informational design.

### `src/views/pages/Contact.jsx`
Contact page.

Edit this for contact form, location, email/social links, and contact layout.

## Design Editing Cheat Sheet

### I want to change the top navbar
Edit:

- `src/views/partials/header.jsx`

### I want to change the footer
Edit:

- `src/views/partials/footer.jsx`

### I want full-screen layout/body fixes
Edit:

- `src/index.css`

### I want to change homepage post cards
Edit:

- `src/views/core/index.jsx`

Later, consider creating:

- `src/components/PostCard.jsx`

### I want to change single article design
Edit:

- `src/views/core/Details.jsx`

### I want to change login/register design
Edit:

- `src/views/auth/Login.jsx`
- `src/views/auth/Register.jsx`

### I want to change dashboard design
Edit:

- files inside `src/views/dashboard/`

### I want to change backend API URL
Edit:

- `src/utils/axios.js`
- `src/utils/constants.js`

## Useful Notes

- Keep routes in `App.jsx`.
- Keep navigation links in `header.jsx`.
- Use `Link` from `react-router-dom` for frontend navigation.
- Use `apiInstance` from `utils/axios.js` for simple API calls.
- Use `Toast()` from `plugin/toast.js` for user messages.
- Use `useUserData()` when a page needs the logged-in user id.
- Be consistent with file casing: if the file is `header.jsx`, import `../partials/header`.
