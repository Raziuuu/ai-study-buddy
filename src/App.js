import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import AITutor from './components/AITutor';
import PDFStudy from './components/PDFStudy';
import Progress from './components/Progress';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="App min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/quiz" element={
                <ProtectedRoute requireAuth={true}>
                  <Quiz />
                </ProtectedRoute>
              } />
              <Route path="/ai-tutor" element={
                <ProtectedRoute requireAuth={true}>
                  <AITutor />
                </ProtectedRoute>
              } />
              <Route path="/pdf-study" element={
                <ProtectedRoute requireAuth={true}>
                  <PDFStudy />
                </ProtectedRoute>
              } />
              <Route path="/progress" element={
                <ProtectedRoute requireAuth={true}>
                  <Progress />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App; 