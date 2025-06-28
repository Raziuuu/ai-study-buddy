import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Target,
  Clock,
  Trophy
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Quiz = () => {
  const { state, dispatch } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [difficulty, setDifficulty] = useState('Beginner');

  // AI-generated questions based on subject and difficulty
  const generateQuestions = (subject, level) => {
    const questions = {
      Mathematics: {
        Beginner: [
          {
            question: "What is 2 + 3?",
            options: ["4", "5", "6", "7"],
            correct: 1,
            explanation: "2 + 3 = 5. This is basic addition."
          },
          {
            question: "What is 5 × 4?",
            options: ["15", "20", "25", "30"],
            correct: 1,
            explanation: "5 × 4 = 20. This is basic multiplication."
          },
          {
            question: "What is 10 ÷ 2?",
            options: ["3", "4", "5", "6"],
            correct: 2,
            explanation: "10 ÷ 2 = 5. This is basic division."
          }
        ],
        Intermediate: [
          {
            question: "Solve: 3x + 5 = 14",
            options: ["x = 2", "x = 3", "x = 4", "x = 5"],
            correct: 1,
            explanation: "3x + 5 = 14 → 3x = 9 → x = 3"
          },
          {
            question: "What is the area of a rectangle with length 6 and width 4?",
            options: ["20", "24", "28", "32"],
            correct: 1,
            explanation: "Area = length × width = 6 × 4 = 24"
          }
        ],
        Advanced: [
          {
            question: "Solve: x² - 4x + 4 = 0",
            options: ["x = 2", "x = -2", "x = 0", "x = 4"],
            correct: 0,
            explanation: "x² - 4x + 4 = (x-2)² = 0 → x = 2"
          }
        ]
      },
      Science: {
        Beginner: [
          {
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2", "N2"],
            correct: 0,
            explanation: "H2O is the chemical formula for water."
          },
          {
            question: "Which planet is closest to the Sun?",
            options: ["Venus", "Mars", "Mercury", "Earth"],
            correct: 2,
            explanation: "Mercury is the closest planet to the Sun."
          }
        ],
        Intermediate: [
          {
            question: "What is the atomic number of Carbon?",
            options: ["4", "6", "8", "12"],
            correct: 1,
            explanation: "Carbon has an atomic number of 6."
          }
        ],
        Advanced: [
          {
            question: "What is the speed of light in vacuum?",
            options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"],
            correct: 0,
            explanation: "The speed of light in vacuum is approximately 299,792 km/s."
          }
        ]
      },
      English: {
        Beginner: [
          {
            question: "Which word is a synonym for 'happy'?",
            options: ["Sad", "Joyful", "Angry", "Tired"],
            correct: 1,
            explanation: "'Joyful' is a synonym for 'happy'."
          },
          {
            question: "What is the past tense of 'run'?",
            options: ["Running", "Runned", "Ran", "Runs"],
            correct: 2,
            explanation: "The past tense of 'run' is 'ran'."
          }
        ],
        Intermediate: [
          {
            question: "Identify the figure of speech: 'The wind whispered through the trees.'",
            options: ["Simile", "Metaphor", "Personification", "Alliteration"],
            correct: 2,
            explanation: "This is personification - giving human qualities to the wind."
          }
        ],
        Advanced: [
          {
            question: "What is the literary device used in 'The world is a stage'?",
            options: ["Simile", "Metaphor", "Hyperbole", "Irony"],
            correct: 1,
            explanation: "This is a metaphor - comparing the world to a stage without using 'like' or 'as'."
          }
        ]
      }
    };

    return questions[subject]?.[level] || questions[subject]?.Beginner || [];
  };

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const subjectQuestions = generateQuestions(state.currentSubject, difficulty);
    setQuestions(subjectQuestions);
  }, [state.currentSubject, difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered, quizCompleted]);

  const handleAnswer = (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const isCorrect = answerIndex === questions[currentQuestion]?.correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    // AI adapts difficulty based on performance
    setTimeout(() => {
      if (isCorrect && difficulty === 'Beginner') {
        setDifficulty('Intermediate');
      } else if (!isCorrect && difficulty === 'Advanced') {
        setDifficulty('Intermediate');
      }
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const finalScore = Math.round((score / questions.length) * 100);
    setQuizCompleted(true);
    
    // Update user progress
    dispatch({
      type: 'UPDATE_PROGRESS',
      subject: state.currentSubject,
      completed: state.user.progress[state.currentSubject].completed + 1,
      score: finalScore
    });

    dispatch({
      type: 'ADD_QUIZ_RESULT',
      result: {
        subject: state.currentSubject,
        score: finalScore,
        questions: questions.length,
        date: new Date().toISOString()
      }
    });

    dispatch({
      type: 'UPDATE_STUDY_TIME',
      time: 30 - timeLeft
    });
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(30);
    setQuizCompleted(false);
    setDifficulty('Beginner');
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect p-8 rounded-xl text-center">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Quiz...</h2>
          <p className="text-white/70">AI is preparing your personalized questions</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const finalScore = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-effect p-8 rounded-xl text-center"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Quiz Completed!</h1>
            
            <div className="mb-6">
              <div className="text-6xl font-bold gradient-text mb-2">{finalScore}%</div>
              <p className="text-white/70">You got {score} out of {questions.length} questions correct</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-white/70 text-sm">Correct</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{questions.length - score}</div>
                <div className="text-white/70 text-sm">Incorrect</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={restartQuiz}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5 inline mr-2" />
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-effect p-6 rounded-xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">AI-Powered Quiz</h1>
              <p className="text-white/70">{state.currentSubject} - {difficulty} Level</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{currentQuestion + 1}/{questions.length}</div>
                <div className="text-white/70 text-sm">Question</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{score}</div>
                <div className="text-white/70 text-sm">Score</div>
              </div>
            </div>
          </div>
          
          {/* Timer */}
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5 text-white" />
            <div className="text-white font-semibold">{timeLeft}s</div>
            <div className="w-32 bg-white bg-opacity-20 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-effect p-8 rounded-xl mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-6">{currentQ.question}</h2>
            
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                    isAnswered
                      ? index === currentQ.correct
                        ? 'bg-green-500 bg-opacity-20 border-2 border-green-500'
                        : selectedAnswer === index
                        ? 'bg-red-500 bg-opacity-20 border-2 border-red-500'
                        : 'bg-white bg-opacity-10'
                      : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {isAnswered && index === currentQ.correct && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {isAnswered && selectedAnswer === index && index !== currentQ.correct && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-white font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg"
              >
                <h3 className="text-white font-semibold mb-2">AI Explanation:</h3>
                <p className="text-white/80">{currentQ.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            >
              <span>{currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Quiz; 