import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Send, 
  User, 
  Bot, 
  Sparkles
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { callGeminiAPI, testGeminiAPI } from '../config/api';

const AITutor = () => {
  const { state, dispatch } = useUser();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hello! I'm your AI Study Buddy. I'm here to help you with ${state.currentSubject} and any other subjects you're studying. What would you like to learn about today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Create a proper prompt for the real Gemini API
      const prompt = `You are an AI tutor helping a student with ${state.currentSubject}. 

The student asks: "${inputMessage}"

Please provide a helpful, educational response that:
- Directly answers the student's question
- Explains concepts clearly and accurately
- Provides relevant examples when helpful
- Maintains an encouraging and supportive tone
- Keeps the response focused and educational

Respond as a knowledgeable tutor who wants to help the student learn and understand.`;

      console.log('Sending prompt to real Gemini API:', prompt);
      const aiResponse = await callGeminiAPI(prompt, '', state.currentSubject);
      console.log('Received real AI response:', aiResponse);
      
      if (aiResponse && !aiResponse.includes('Error:')) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse,
          suggestions: ["Ask a follow-up question", "Request an example", "Ask for clarification"],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Handle API error
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse || "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment.",
          suggestions: ["Try again", "Check your connection", "Ask a different question"],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I encountered an error while processing your question. Please try again or ask a different question.",
        suggestions: ["Try again", "Ask a different question", "Check your connection"],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsTyping(false);

    // Track AI interaction
    dispatch({
      type: 'ADD_AI_INTERACTION',
      interaction: {
        question: inputMessage,
        response: 'Real AI-generated response',
        subject: state.currentSubject,
        timestamp: new Date().toISOString()
      }
    });
  };

  const testAPI = async () => {
    console.log('Testing Gemini API...');
    const isWorking = await testGeminiAPI();
    if (isWorking) {
      alert('✅ Gemini API is working!');
    } else {
      alert('❌ Gemini API test failed. Check console for available models and details.');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect p-6 rounded-xl mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Study Tutor</h1>
                <p className="text-white/70">Your personalized learning assistant</p>
              </div>
            </div>
            <button
              onClick={testAPI}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm"
            >
              Test API
            </button>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 glass-effect rounded-xl p-6 mb-6 overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : 'bg-white bg-opacity-10 text-white'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-white/70">Suggested follow-ups:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs px-2 py-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-200"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="w-full p-4 pr-12 bg-white bg-opacity-10 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="1"
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-effect p-4 rounded-xl">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>Quick Questions</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              `Explain ${state.currentSubject} basics`,
              "Help me with homework",
              "Give me practice problems",
              "Study tips for exams"
            ].map((quickQuestion, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(quickQuestion)}
                className="text-sm px-3 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all duration-200 text-white"
              >
                {quickQuestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor; 