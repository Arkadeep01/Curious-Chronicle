# Curious Chronicle

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4+-purple.svg)](https://vitejs.dev/)

A sleek, high-performance blogging platform built for speed, clarity, and modern content creation. Curious Chronicle delivers a distraction-free reading experience while providing creators with powerful tools to share ideas effortlessly. Clean, fast, and built to scale.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure login, registration, password reset, and OTP verification
- **Content Management**: Create, edit, and publish posts with rich text support
- **Categorization**: Organize posts into categories with SEO-friendly slugs
- **Tagging System**: Add tags to posts for better discoverability
- **Comments & Interactions**: Engage readers with threaded comments, likes, and bookmarks
- **Notifications**: Real-time notifications for comments, likes, and updates
- **Search & Discovery**: Powerful search functionality to find content quickly
- **Author Profiles**: Dedicated profiles showcasing author work and statistics

### Dashboard Features
- **Post Management**: Add, edit, delete, and manage all your posts
- **Analytics**: View post views, likes, and engagement metrics
- **Comment Moderation**: Approve, reply, and manage comments
- **Profile Customization**: Update personal information and preferences
- **Notification Center**: Stay updated with all activities

### Public Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **SEO Optimized**: Meta tags, sitemaps, and structured data for better search visibility
- **Social Sharing**: Easy sharing of posts across social platforms
- **About & Contact Pages**: Informational pages for branding and communication

## 🛠 Tech Stack

### Backend
- **Django**: High-level Python web framework
- **Django REST Framework**: Powerful API toolkit for building APIs
- **PostgreSQL/SQLite**: Database options for data storage
- **JWT Authentication**: Secure token-based authentication

### Frontend
- **React**: Declarative UI library for building user interfaces
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API requests
- **React Router**: Declarative routing for React applications

### Deployment
- **Heroku Ready**: Procfile and runtime configuration included
- **Docker Support**: Containerized deployment options

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/curious-chronicle.git
   cd curious-chronicle
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv .venv_chrono
   # Activate virtual environment (Windows)
   .venv_chrono\Scripts\activate
   # Install dependencies
   pip install -r backend/requirements.txt
   # Run migrations
   cd backend
   python manage.py migrate
   # Create superuser
   python manage.py createsuperuser
   # Start development server
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:5173 (or as configured by Vite)

### Configuration

1. **Environment Variables**
   Create a `.env` file in the backend directory with:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   DATABASE_URL=your-database-url
   EMAIL_HOST=your-email-host
   ```

2. **Database**
   The project supports both SQLite (default) and PostgreSQL. Update `settings.py` for your preferred database.

## 📖 Usage

### For Writers
1. Register an account or log in
2. Access the dashboard to create your first post
3. Add categories, tags, and engaging content
4. Publish and share your stories

### For Readers
1. Browse posts by categories or use search
2. Read full articles with distraction-free design
3. Engage by liking, commenting, and bookmarking
4. Follow authors for updates

### API Usage
The backend provides a RESTful API. Key endpoints:
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create a new post (authenticated)
- `GET /api/categories/` - List categories
- `POST /api/auth/login/` - User login

Refer to the API documentation for complete endpoint details.

## 🏗 Project Structure

```
curious-chronicle/
├── backend/                 # Django backend
│   ├── api/                # Main app
│   ├── backend/            # Django settings
│   ├── media/              # User uploaded files
│   ├── static/             # Static files
│   └── templates/          # Email templates
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── views/          # Page components
│   │   ├── store/          # State management
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
└── README.md
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact us through the website

---

Built with ❤️ for storytellers and readers alike.



