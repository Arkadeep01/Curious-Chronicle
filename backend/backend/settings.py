from pathlib import Path
from datetime import timedelta
from environs import Env
import os 

BASE_DIR = Path(__file__).resolve().parent.parent
env = Env()
env.read_env()

SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", default=True)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])
CSRF_TRUSTED_ORIGINS = [
    "https://curiousChronicle.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOWED_ORIGINS = [
    "https://CuriousChronicle.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
CORS_ALLOW_CREDENTIALS = True

# Application definition
INSTALLED_APPS = [
    "jazzmin",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Custom Apps
    "api",

    # Third Party Apps
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "drf_yasg",
    "anymail",
    "storages",
    "django_ckeditor_5",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

STATIC_URL = "/static/"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
STATICFILES_DIRS = [BASE_DIR / "static",]
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

AUTH_USER_MODEL = 'api.User'
SITE_URL=env("SITE_URL")

REST_FRAMEWORK = {
  'DEFAULT_AUTHENTICATION_CLASSES': (
    'rest_framework_simplejwt.authentication.JWTAuthentication',
  ),
}

ANYMAIL = {
    "MAILERSEND_API_TOKEN": "mlsn.",
}


# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# EMAIL_HOST = env("EMAIL_HOST", "smtp.gmail.com")
# EMAIL_PORT = env.int("EMAIL_PORT", 587)
# EMAIL_USE_TLS = True

# EMAIL_HOST_USER = env("EMAIL_HOST_USER")
# EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")

# DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
# SERVER_EMAIL = EMAIL_HOST_USER
# FROM_EMAIL = EMAIL_HOST_USER


SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=50),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,

    'ALGORITHM': 'HS256',

    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,

    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

    'JTI_CLAIM': 'jti',

    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}


# Custom Admin Settings
JAZZMIN_SETTINGS = {
    "site_title": "Chrono Blog Admin",
    "site_header": "Chrono Blog",
    "site_brand": "Chrono Blog",
    "site_logo": "../../frontend/public/logo.png",
    "site_icon": "images/favicon2.png",

    "welcome_sign": "Welcome to Chrono Blog Dashboard",
    "copyright": "Chrono Blog",

    "topmenu_links": [
        {"name": "Home", "url": "/", "icon": "fas fa-globe", "target": "_blank"},
        {"name": "Dashboard", "url": "admin:index", "icon": "fas fa-tachometer-alt"},
        {"name": "View Site", "url": "/", "icon": "fas fa-external-link-alt", "target": "_blank"},
    ],

    "show_sidebar": True,
    "navigation_expanded": True,

    "order_with_respect_to": [
        "api.User",
        "api.Profile",
        "api.Category",
        "api.Post",
        "api.Comment",
        "api.Bookmark",
        "api.Notification",
        "api.Feedback",
    ],

    "icons": {
        "admin.LogEntry": "fas fa-history",
        "auth": "fas fa-shield-alt",
        "auth.user": "fas fa-user-gear",
        "auth.group": "fas fa-users-gear",
        "api.User": "fas fa-users",
        "api.Profile": "fas fa-id-card-alt",
        "api.Post": "fas fa-newspaper",
        "api.Category": "fas fa-folder-tree",
        "api.Comment": "fas fa-comments",
        "api.Notification": "fas fa-bell",
        "api.Bookmark": "fas fa-bookmark",
        "api.Feedback": "fas fa-envelope-open-text",
    },

    "default_icon_parents": "fas fa-folder-open",
    "default_icon_children": "fas fa-file-lines",
    "related_modal_active": True,

    "custom_js": """
        document.addEventListener('DOMContentLoaded', function() {
            // Enhanced table row hover effect
            document.querySelectorAll('tbody tr').forEach(function(row) {
                row.style.transition = 'background-color 0.2s';
            });

            // Auto-dismiss alerts
            setTimeout(function() {
                document.querySelectorAll('.alert').forEach(function(alert) {
                    alert.style.transition = 'opacity 0.5s';
                    alert.style.opacity = '0';
                    setTimeout(function() { alert.remove(); }, 500);
                });
            }, 5000);
        });
    """,

    "show_ui_builder": True,

    "changeform_format": "vertical_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "accordion",
        "api.Post": "horizontal_tabs",
        "api.Comment": "inline",
        "api.Category": "accordion",
    },

    "actions_sticky_top": True,
    "table_row_actions_on_top": True,
    "enable_themes": True,
    "theme": "minty",
    "dark_mode_theme": "cyborg",
    "use_google_fonts": True,
    "google_font": "Poppins",
}

# Jazzmin Tweaks - Enhanced UI
JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": True,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-teal",
    "accent": "accent-teal",
    "navbar": "navbar-dark navbar-expand elevation-2",
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-teal elevation-3",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    "theme": "minty",
    "default_theme_mode": "system",
    "button_classes": {
        "primary": "btn-teal",
        "secondary": "btn-outline-teal",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    }
}

# Custom Admin CSS
JAZZMIN_CUSTOM_CSS = """
/* Modern Card Styling */
.card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.card-header {
    border-radius: 12px 12px 0 0 !important;
    font-weight: 600;
    padding: 12px 20px;
}

/* Sidebar Enhancement */
.main-sidebar {
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.sidebar {
    transition: all 0.3s;
}

.nav-sidebar .nav-item > .nav-link {
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.2s;
    padding: 10px 12px;
}

.nav-sidebar .nav-item > .nav-link:hover {
    background: rgba(255,255,255,0.15);
    transform: translateX(4px);
}

.nav-sidebar .nav-item > .nav-link.active {
    background: rgba(255,255,255,0.2);
    border-left: 3px solid #fff;
}

/* Table Improvements */
.table {
    border-radius: 8px;
    overflow: hidden;
}

.table thead th {
    border-bottom: 2px solid #20c997;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.5px;
    background: #f8f9fa;
}

.table-hover tbody tr:hover {
    background-color: rgba(32, 201, 151, 0.08);
}

/* Button Enhancements */
.btn {
    border-radius: 8px;
    font-weight: 500;
    padding: 0.5rem 1.2rem;
    transition: all 0.2s;
    border: none;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-primary {
    background: linear-gradient(135deg, #20c997 0%, #199d76 100%);
}

.btn-primary:hover {
    background: linear-gradient(135deg, #199d76 0%, #167a5c 100%);
}

/* Form Improvements */
.form-control, .select2-container--default .select2-selection {
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    transition: border-color 0.2s, box-shadow 0.2s;
    padding: 0.5rem 0.75rem;
}

.form-control:focus, .select2-container--default.select2-container--focus .select2-selection {
    border-color: #20c997;
    box-shadow: 0 0 0 3px rgba(32,201,151,0.15);
}

/* Navbar Enhancement */
.main-header {
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.navbar {
    transition: all 0.3s;
}

/* Welcome Card Styling */
.welcome-card {
    background: linear-gradient(135deg, #20c997 0%, #20a8d8 100%);
    color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(32, 201, 151, 0.3);
}

/* Action Buttons */
.action-buttons .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    margin: 0 2px;
}

/* Smooth Transitions */
a, button, input, select, .nav-link {
    transition: all 0.2s ease;
}

/* Filter Select Styling */
select.form-control {
    border-radius: 6px;
}

/* Search Input Enhancement */
.input-group input.form-control {
    border-radius: 8px 0 0 8px;
}

.input-group button {
    border-radius: 0 8px 8px 0;
}

/* Pagination Styling */
.pagination {
    margin: 0;
}

.page-item .page-link {
    border-radius: 6px;
    margin: 0 2px;
    color: #20c997;
}

.page-item.active .page-link {
    background: linear-gradient(135deg, #20c997 0%, #199d76 100%);
    border-color: #20c997;
}

/* Badge Styling */
.badge {
    padding: 5px 10px;
    border-radius: 6px;
    font-weight: 500;
}

/* Modal Enhancements */
.modal-content {
    border-radius: 12px;
    border: none;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

/* Dropdown Menu */
.dropdown-menu {
    border-radius: 8px;
    border: none;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Toast Notifications */
.toast {
    border-radius: 8px;
}

/* Empty State */
.empty-form-placeholder {
    padding: 40px;
    text-align: center;
    color: #6c757d;
}

/* Fieldset Styling */
fieldset {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}

legend {
    font-size: 0.9rem;
    font-weight: 600;
    color: #20c997;
    padding: 0 10px;
}

/* Dark Mode Enhancements */
[data-theme="dark"] .card {
    background: #2d2d2d;
    color: #e0e0e0;
}

[data-theme="dark"] .table {
    color: #e0e0e0;
}

[data-theme="dark"] .form-control {
    background: #1f1f1f;
    border-color: #404040;
    color: #e0e0e0;
}

[data-theme="dark"] .table thead th {
    background: #252525;
    border-bottom-color: #20c997;
}

[data-theme="dark"] .nav-sidebar .nav-item > .nav-link:hover {
    background: rgba(255,255,255,0.1);
}

[data-theme="dark"] .form-control:focus {
    border-color: #20c997;
    background: #1f1f1f;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #20c997;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #199d76;
}

/* Loading Spinner */
.spinner-border {
    color: #20c997;
}

/* Selection Color */
::selection {
    background: rgba(32, 201, 151, 0.3);
}
"""
