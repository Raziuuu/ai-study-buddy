import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award,
  BarChart3,
  Clock,
  BookOpen,
  Brain
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Progress = () => {
  const { state } = useUser();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');

  const getProgressPercentage = (subject) => {
    const progress = state.user.progress[subject];
    return Math.round((progress.completed / progress.total) * 100);
  };

  const getAverageScore = () => {
    const subjects = Object.values(state.user.progress);
    const totalScore = subjects.reduce((sum, subject) => sum + subject.score, 0);
    return Math.round(totalScore / subjects.length);
  };

  const getTotalStudyTime = () => {
    return Math.round(state.user.studyTime / 60);
  };

  const getQuizAccuracy = () => {
    if (state.quizHistory.length === 0) return 0;
    const totalScore = state.quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
    return Math.round(totalScore / state.quizHistory.length);
  };

  // Chart data for progress over time
  const progressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Study Time (hours)',
        data: [2, 3, 1.5, 4, 2.5, 3.5, 2],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Quiz Score (%)',
        data: [75, 85, 70, 90, 80, 88, 82],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const subjectProgressData = {
    labels: state.user.subjects,
    datasets: [
      {
        label: 'Completion %',
        data: state.user.subjects.map(subject => getProgressPercentage(subject)),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const scoreDistributionData = {
    labels: ['90-100%', '80-89%', '70-79%', '60-69%', 'Below 60%'],
    datasets: [
      {
        data: [30, 40, 20, 8, 2],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
          padding: 20,
        },
      },
    },
  };

  const recentQuizzes = state.quizHistory.slice(-5).reverse();

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
            Your Learning Progress
          </h1>
          <p className="text-white/70 text-lg">
            Track your performance and see how you're improving
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Average Score</p>
                <p className="text-2xl font-bold text-white">{getAverageScore()}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
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
                <p className="text-white/70 text-sm">Total Study Time</p>
                <p className="text-2xl font-bold text-white">{getTotalStudyTime()}h</p>
              </div>
              <Clock className="w-8 h-8 text-green-400" />
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
                <p className="text-white/70 text-sm">Quiz Accuracy</p>
                <p className="text-2xl font-bold text-white">{getQuizAccuracy()}%</p>
              </div>
              <Award className="w-8 h-8 text-yellow-400" />
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
                <p className="text-white/70 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">{state.user.streak} days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Progress Over Time Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-effect p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Progress Over Time</h2>
              <div className="flex space-x-2">
                {['week', 'month', 'year'].map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedTimeframe === timeframe
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <Line data={progressData} options={chartOptions} />
          </motion.div>

          {/* Subject Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Subject Progress</h2>
            <Bar data={subjectProgressData} options={chartOptions} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Score Distribution</h2>
            <Doughnut data={scoreDistributionData} options={doughnutOptions} />
          </motion.div>

          {/* Recent Quiz Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="lg:col-span-2 glass-effect p-6 rounded-xl"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Recent Quiz Results</h2>
            <div className="space-y-4">
              {recentQuizzes.length > 0 ? (
                recentQuizzes.map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white bg-opacity-10 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{quiz.subject}</h3>
                        <p className="text-white/70 text-sm">
                          {new Date(quiz.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{quiz.score}%</div>
                      <div className="text-white/70 text-sm">{quiz.questions} questions</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70">No quiz results yet. Start learning to see your progress!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* AI Interactions Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 glass-effect p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold text-white mb-6">AI Tutor Interactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{state.aiInteractions.length}</div>
              <div className="text-white/70">Total Questions Asked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {state.aiInteractions.length > 0 ? Math.round(state.aiInteractions.length / 7) : 0}
              </div>
              <div className="text-white/70">Questions per Week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {state.aiInteractions.length > 0 ? Math.round((state.aiInteractions.length / state.user.subjects.length) * 10) / 10 : 0}
              </div>
              <div className="text-white/70">Avg per Subject</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress; 