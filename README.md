# AI Study Buddy 🧠

A modern, AI-powered learning platform that provides personalized education through intelligent tutoring, adaptive quizzes, and document analysis.

## ✨ Features

- **🤖 AI-Powered Learning**: Personalized learning paths adapted to your unique style
- **📚 Smart Quizzes**: Adaptive quizzes that adjust difficulty based on performance
- **💬 Instant AI Tutor**: Get help and explanations from our AI tutor anytime
- **📊 Progress Tracking**: Visual progress tracking with detailed analytics
- **📄 PDF Study Assistant**: Upload documents for AI-powered analysis and summaries
- **🔐 User Authentication**: Secure signup/login with profile management
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd ai-study-buddy

# Install dependencies
npm install

# Start development server
npm start
```

### Build for Production
```bash
npm run build
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy the build folder to your hosting service
```

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **AI Integration**: Google Gemini API
- **Authentication**: Local storage with React Context
- **Deployment**: Vercel-ready configuration

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Auth.js         # Authentication modal
│   ├── Navbar.js       # Navigation bar
│   ├── Home.js         # Landing page
│   ├── Dashboard.js    # User dashboard
│   ├── AITutor.js      # AI chat interface
│   ├── Quiz.js         # Quiz component
│   ├── PDFStudy.js     # Document analysis
│   ├── Progress.js     # Progress tracking
│   └── UserProfile.js  # User profile management
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── UserContext.js  # User data management
└── config/
    └── api.js          # API configuration
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎯 Usage

1. **Sign Up/Login**: Create an account or sign in
2. **AI Tutor**: Ask questions and get instant AI-powered responses
3. **Take Quizzes**: Test your knowledge with adaptive quizzes
4. **Upload Documents**: Analyze PDFs and text files for study materials
5. **Track Progress**: Monitor your learning journey with detailed analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@aistudybuddy.com or create an issue in the repository.

---

**Made with ❤️ for better education**

**🚀 Ready for deployment on Vercel!** 