import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Target, Zap, TrendingUp, BookOpen, Users, Award, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths adapted to your unique learning style and pace.'
    },
    {
      icon: Target,
      title: 'Smart Quizzes',
      description: 'Adaptive quizzes that adjust difficulty based on your performance.'
    },
    {
      icon: Zap,
      title: 'Instant AI Tutor',
      description: 'Get instant help and explanations from our AI tutor anytime, anywhere.'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visual progress tracking with detailed analytics and insights.'
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Students' },
    { icon: BookOpen, value: '50+', label: 'Subjects' },
    { icon: Award, value: '95%', label: 'Success Rate' },
    { icon: Clock, value: '24/7', label: 'Available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {isAuthenticated ? (
                  <>
                    Welcome back,{' '}
                    <span className="gradient-text">{user?.name}</span>!
                  </>
                ) : (
                  <>
                    Welcome to{' '}
                    <span className="gradient-text">AI Study Buddy</span>
                  </>
                )}
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                {isAuthenticated 
                  ? "Ready to continue your learning journey? Let's pick up where you left off!"
                  : "Your personalized AI-powered learning companion that adapts to your unique learning style and helps you achieve your educational goals faster than ever before."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Continue Learning
                    </Link>
                    <Link
                      to="/ai-tutor"
                      className="glass-effect text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                    >
                      Ask AI Tutor
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                    >
                      Start Learning
                    </Link>
                    <Link
                      to="/quiz"
                      className="glass-effect text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200"
                    >
                      Take a Quiz
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose AI Study Buddy?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Experience the future of education with our cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-effect p-6 rounded-xl text-center hover:bg-white hover:bg-opacity-15 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {isAuthenticated 
                ? "Ready to Continue Your Learning Journey?"
                : "Ready to Transform Your Learning?"
              }
            </h2>
            <p className="text-xl text-white/70 mb-8">
              {isAuthenticated
                ? "Keep pushing your boundaries with our AI-powered learning tools"
                : "Join thousands of students who are already experiencing the power of AI-driven education"
              }
            </p>
            <Link
              to={isAuthenticated ? "/dashboard" : "/dashboard"}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 inline-block"
            >
              {isAuthenticated ? "Continue Learning" : "Get Started Now"}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 