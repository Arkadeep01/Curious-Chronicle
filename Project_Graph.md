# Curious Chronicle Project Graph

This file is generated from the project root (`.`). It gives a visual map of how the Django backend and React frontend are connected.

## Root Structure

```mermaid
flowchart TD
    ROOT["Curious_Chronicle/"] --> BACKEND["backend/<br/>Django API"]
    ROOT --> FRONTEND["frontend/<br/>React + Vite app"]
    ROOT --> VENV[".venv_Chrono/<br/>Python virtual environment"]
    ROOT --> README["README.md"]
    ROOT --> GUIDE["frontend/Guide.md<br/>frontend file guide"]
    ROOT --> FGRAPH["Frontend_Graph.md<br/>frontend-only graph"]

    BACKEND --> DJANGO_PROJECT["backend/backend/<br/>Django project config"]
    BACKEND --> API_APP["backend/api/<br/>Chronicle API app"]
    BACKEND --> DB["db.sqlite3"]
    BACKEND --> MANAGE["manage.py"]
    BACKEND --> REQS["requirements.txt"]

    FRONTEND --> SRC["frontend/src/"]
    FRONTEND --> HTML["frontend/index.html"]
    FRONTEND --> PKG["package.json"]
```

## Frontend Flow

```mermaid
flowchart TD
    HTML["frontend/index.html<br/>div#root"] --> MAIN["src/main.jsx"]
    MAIN --> GLOBAL_CSS["src/index.css"]
    MAIN --> APP["src/App.jsx"]

    APP --> ROUTER["BrowserRouter"]
    ROUTER --> WRAPPER["layouts/MainWrapper.jsx"]
    WRAPPER --> ROUTES["Routes"]

    ROUTES --> CORE["views/core/"]
    ROUTES --> AUTH["views/auth/"]
    ROUTES --> DASHBOARD["views/dashboard/"]
    ROUTES --> PAGES["views/pages/"]

    CORE --> HOME["index.jsx"]
    CORE --> DETAILS["Details.jsx"]
    CORE --> CATEGORY["Category.jsx"]
    CORE --> SEARCH["Search.jsx"]

    AUTH --> REGISTER["Register.jsx"]
    AUTH --> LOGIN["Login.jsx"]
    AUTH --> LOGOUT["Logout.jsx"]
    AUTH --> FORGOT["ForgotPassword.jsx"]
    AUTH --> CREATE["CreatePassword.jsx"]

    DASHBOARD --> DASH_HOME["Dashboard.jsx"]
    DASHBOARD --> POSTS["Posts.jsx"]
    DASHBOARD --> ADD_POST["AddPost.jsx"]
    DASHBOARD --> EDIT_POST["EditPost.jsx"]
    DASHBOARD --> COMMENTS["Comments.jsx"]
    DASHBOARD --> NOTIFICATIONS["Notifications.jsx"]
    DASHBOARD --> PROFILE["Profile.jsx"]

    PAGES --> ABOUT["About.jsx"]
    PAGES --> CONTACT["Contact.jsx"]

    CORE --> HEADER["partials/header.jsx"]
    CORE --> FOOTER["partials/footer.jsx"]
    AUTH --> HEADER
    AUTH --> FOOTER
    DASHBOARD --> HEADER
    DASHBOARD --> FOOTER
    PAGES --> HEADER
    PAGES --> FOOTER
```

## Frontend Services And State

```mermaid
flowchart TD
    PAGES["React pages"] --> AXIOS["utils/axios.js<br/>basic API client"]
    PAGES --> USE_AXIOS["utils/useAxios.js<br/>auth-aware API client"]
    PAGES --> USER_DATA["plugin/useUserData.js<br/>decode JWT user"]
    PAGES --> TOAST["plugin/toast.js<br/>SweetAlert messages"]
    PAGES --> MOMENT["plugin/moment.js<br/>date formatting"]

    AUTH_PAGES["Auth pages"] --> AUTH_UTIL["utils/auth.js"]
    AUTH_UTIL --> STORE["store/auth.js<br/>Zustand auth store"]
    AUTH_UTIL --> COOKIES["Browser cookies<br/>access_token / refresh_token"]
    USE_AXIOS --> AUTH_UTIL
    USER_DATA --> COOKIES

    AXIOS --> API_BASE["http://127.0.0.1:8000/api/v1/"]
    USE_AXIOS --> API_BASE
```

## Backend Flow

```mermaid
flowchart TD
    MANAGE["manage.py"] --> SETTINGS["backend/settings.py"]
    SETTINGS --> URLS["backend/urls.py"]
    URLS --> API_URLS["api/urls.py"]
    API_URLS --> VIEWS["api/views.py"]
    VIEWS --> SERIALIZERS["api/serializer.py"]
    VIEWS --> MODELS["api/models.py"]
    SERIALIZERS --> MODELS
    MODELS --> DB["db.sqlite3"]
    ADMIN["api/admin.py"] --> MODELS
```

## Frontend To Backend API Map

```mermaid
flowchart LR
    HOME["Home page<br/>core/index.jsx"] --> POST_LIST["GET /api/v1/post/lists/"]
    HOME --> CATEGORY_LIST["GET /api/v1/post/category/list/"]
    HOME --> LIKE["POST /api/v1/post/likes-post/"]
    HOME --> BOOKMARK["POST /api/v1/post/bookmarks/"]

    DETAILS["Details page<br/>core/Details.jsx"] --> POST_DETAIL["GET /api/v1/post/details/:slug/"]
    DETAILS --> COMMENT["POST /api/v1/post/comments/"]

    CATEGORY["Category page<br/>core/Category.jsx"] --> CATEGORY_POSTS["GET /api/v1/post/category/posts/:slug/"]
    SEARCH["Search page<br/>core/Search.jsx"] --> POST_LIST

    LOGIN["Login page"] --> TOKEN["POST /api/v1/user/token/"]
    REGISTER["Register page"] --> USER_REGISTER["POST /api/v1/user/register/"]
    PROFILE["Profile page"] --> USER_PROFILE["GET/PATCH /api/v1/user/profile/:user_id"]
```

## Route Map

```mermaid
flowchart LR
    APP["App.jsx"] --> R1["/ -> core/index.jsx"]
    APP --> R2["/:slug/ -> core/Details.jsx"]
    APP --> R3["/category/:slug/ -> core/Category.jsx"]
    APP --> R4["/search/ -> core/Search.jsx"]

    APP --> R5["/register/ -> auth/Register.jsx"]
    APP --> R6["/login/ -> auth/Login.jsx"]
    APP --> R7["/logout/ -> auth/Logout.jsx"]
    APP --> R8["/forgot-password/ -> auth/ForgotPassword.jsx"]
    APP --> R9["/create-password/ -> auth/CreatePassword.jsx"]

    APP --> R10["/dashboard/ -> dashboard/Dashboard.jsx"]
    APP --> R11["/posts/ -> dashboard/Posts.jsx"]
    APP --> R12["/add-post/ -> dashboard/AddPost.jsx"]
    APP --> R13["/edit-post/:id/ -> dashboard/EditPost.jsx"]
    APP --> R14["/comments/ -> dashboard/Comments.jsx"]
    APP --> R15["/notifications/ -> dashboard/Notifications.jsx"]
    APP --> R16["/profile/ -> dashboard/Profile.jsx"]

    APP --> R17["/about/ -> pages/About.jsx"]
    APP --> R18["/contact/ -> pages/Contact.jsx"]
```

## Design Editing Hotspots

```mermaid
flowchart TD
    DESIGN["Design changes"] --> NAV["Header/navigation<br/>frontend/src/views/partials/header.jsx"]
    DESIGN --> FOOT["Footer<br/>frontend/src/views/partials/footer.jsx"]
    DESIGN --> HOME_DESIGN["Homepage<br/>frontend/src/views/core/index.jsx"]
    DESIGN --> ARTICLE_DESIGN["Article details<br/>frontend/src/views/core/Details.jsx"]
    DESIGN --> CAT_DESIGN["Category page<br/>frontend/src/views/core/Category.jsx"]
    DESIGN --> SEARCH_DESIGN["Search page<br/>frontend/src/views/core/Search.jsx"]
    DESIGN --> AUTH_DESIGN["Login/Register<br/>frontend/src/views/auth/"]
    DESIGN --> DASH_DESIGN["Dashboard<br/>frontend/src/views/dashboard/"]
    DESIGN --> GLOBAL_STYLE["Global layout styles<br/>frontend/src/index.css"]
```
