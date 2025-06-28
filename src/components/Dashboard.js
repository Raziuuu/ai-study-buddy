import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  Play, 
  HelpCircle,
  BarChart3,
  Zap,
  FileText
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const { state, dispatch } = useUser();
  const [selectedSubject, setSelectedSubject] = useState(state.currentSubject);

  const quickActions = [
    {
      icon: Play,
      title: 'Start Quiz',
      description: 'Take an adaptive quiz',
      link: '/quiz',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: HelpCircle,
      title: 'AI Tutor',
      description: 'Get instant help',
      link: '/ai-tutor',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: FileText,
      title: 'PDF Study',
      description: 'Upload and study PDFs',
      link: '/pdf-study',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'View Progress',
      description: 'Check your analytics',
      link: '/progress',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recommendations = [
    {
      type: 'quiz',
      subject: 'Mathematics',
      title: 'Algebra Fundamentals',
      difficulty: 'Intermediate',
      estimatedTime: '15 min'
    },
    {
      type: 'study',
      subject: 'Science',
      title: 'Physics Concepts',
      difficulty: 'Beginner',
      estimatedTime: '20 min'
    },
    {
      type: 'practice',
      subject: 'English',
      title: 'Grammar Practice',
      difficulty: 'Advanced',
      estimatedTime: '10 min'
    }
  ];

  const getProgressPercentage = (subject) => {
    const progress = state.user.progress[subject];
    return Math.round((progress.completed / progress.total) * 100);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Advanced': return 'text-red-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {state.user.name}! 👋
          </h1>
          <p className="text-white/70 text-lg">
            Ready to continue your learning journey?
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Study Time</p>
                <p className="text-2xl font-bold text-white">{Math.round(state.user.studyTime / 60)}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">{state.user.streak} days</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Level</p>
                <p className="text-2xl font-bold text-white">{state.user.level}</p>
              </div>
              <Target className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Quizzes Taken</p>
                <p className="text-2xl font-bold text-white">{state.quizHistory.length}</p>
              </div>
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-6">Subject Progress</h2>
              <div className="space-y-4">
                {state.user.subjects.map((subject) => (
                  <div key={subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{subject}</span>
                      <span className="text-white/70 text-sm">
                        {state.user.progress[subject].completed}/{state.user.progress[subject].total}
                      </span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(subject)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Score: {state.user.progress[subject].score}%</span>
                      <span className="text-white/70">{getProgressPercentage(subject)}% Complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="glass-effect p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className="block p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{action.title}</h3>
                          <p className="text-white/70 text-sm">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8"
        >
          <div className="glass-effect p-6 rounded-xl">
            <div className="flex items-center space-x-2 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">AI Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{rec.subject}</span>
                    <span className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-20 ${getLevelColor(rec.difficulty)}`}>
                      {rec.difficulty}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{rec.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">{rec.estimatedTime}</span>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Start →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 