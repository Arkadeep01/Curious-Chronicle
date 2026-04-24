# 📁 Curious_Chronicle - Project Structure

## ⭐ Important Files
- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📖 **README.md** - Project documentation
- 🔴 📖 **README.md** - Project documentation
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🔵 📝 **CHANGELOG.md** - Change log
- 🔴 📖 **README.md** - Project documentation
- 🔵 📝 **CHANGELOG.md** - Change log
- 🔴 📖 **README.md** - Project documentation
- 🔴 📖 **README.md** - Project documentation
- 🟡 🚫 **.gitignore** - Git ignore rules



### By Category
- **Other**: 6818 files (79.1%)
- **JavaScript**: 1035 files (12.0%)
- **Web**: 322 files (3.7%)
- **Assets**: 203 files (2.4%)
- **Styles**: 117 files (1.4%)
- **Docs**: 104 files (1.2%)
- **React**: 10 files (0.1%)
- **Config**: 9 files (0.1%)
- **DevOps**: 2 files (0.0%)


## 🌳 Directory Structure
```
Curious_Chronicle/
├── 📂 backend/
│   ├── 🔌 api/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 admin.py
│   │   ├── 📄 apps.py
│   │   ├── 📂 migrations/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 0001_initial.py
│   │   │   ├── 📄 0002_category_post_notification_comment_bookmark.py
│   │   │   ├── 📄 0003_alter_category_options_alter_notification_options_and_more.py
│   │   │   └── 📄 0004_post_likes_remove_post_views_post_views.py
│   │   ├── 📄 models.py
│   │   ├── 📄 serializer.py
│   │   ├── 📄 tests.py
│   │   ├── 📄 urls.py
│   │   └── 📄 views.py
│   ├── 📂 backend/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 asgi.py
│   │   ├── 📄 settings.py
│   │   ├── 📄 urls.py
│   │   └── 📄 wsgi.py
│   ├── 📄 db.sqlite3
│   ├── 📄 manage.py
│   ├── 📄 requirements.txt
│   └── 📂 static/
│   │   └── 🖼️ images/
│   │   │   ├── 🖼️ favicon2.png
│   │   │   ├── 🖼️ logo_dark.png
│   │   │   ├── 🖼️ logo_light.png
│   │   │   └── 🖼️ PHOTO.png
├── 📂 frontend/
│   ├── 🟡 🚫 **.gitignore**
│   ├── 📜 eslint.config.js
│   ├── 🌐 index.html
│   ├── 🟡 🔒 **package-lock.json**
│   ├── 🔴 📦 **package.json**
│   ├── 🌐 public/
│   ├── 📁 src/
│   │   ├── 🎨 App.css
│   │   ├── ⚛️ App.jsx
│   │   ├── 🎨 index.css
│   │   ├── 📂 layouts/
│   │   │   ├── ⚛️ MainWrapper.jsx
│   │   │   └── ⚛️ PrivateRoute.jsx
│   │   ├── ⚛️ main.jsx
│   │   ├── 📂 plugin/
│   │   │   ├── 📜 moment.js
│   │   │   ├── 📜 toast.js
│   │   │   └── 📜 useUserData.js
│   │   ├── 📂 store/
│   │   │   └── 📜 auth.js
│   │   ├── 🔧 utils/
│   │   │   ├── 📜 auth.js
│   │   │   ├── 📜 axios.js
│   │   │   ├── 📜 constants.js
│   │   │   └── 📜 useAxios.js
│   │   └── 📂 views/
│   │   │   ├── 📂 auth/
│   │   │   ├── 📂 core/
│   │   │   │   ├── ⚛️ Category.jsx
│   │   │   │   ├── ⚛️ Details.jsx
│   │   │   │   ├── ⚛️ index.jsx
│   │   │   │   └── ⚛️ Search.jsx
│   │   │   ├── 📂 dashboard/
│   │   │   ├── 📄 pages/
│   │   │   └── 📂 partials/
│   │   │   │   ├── ⚛️ footer.jsx
│   │   │   │   └── ⚛️ header.jsx
│   └── 📜 vite.config.js
├── 📄 LICENSE
└── 🔴 📖 **README.md**
```

## 📖 Legend

### File Types

- 🖼️ Assets: PNG images
- 📜 JavaScript: JavaScript files
- 🌐 Web: HTML files
- 🎨 Styles: Stylesheets
- ⚛️ React: React JSX files
- 🚫 DevOps: Git ignore
- ⚙️ Config: JSON files
- 📖 Docs: Markdown files
- 🎨 Assets: SVG images
- ⚙️ Config: XML files


### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
