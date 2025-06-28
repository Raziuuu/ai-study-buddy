import React, { createContext, useContext, useReducer } from 'react';

const UserContext = createContext();

const initialState = {
  user: {
    name: 'Student',
    level: 'Beginner',
    subjects: ['Mathematics', 'Science', 'English'],
    progress: {
      Mathematics: { completed: 0, total: 10, score: 0 },
      Science: { completed: 0, total: 10, score: 0 },
      English: { completed: 0, total: 10, score: 0 }
    },
    studyTime: 0,
    streak: 0
  },
  currentSubject: 'Mathematics',
  quizHistory: [],
  aiInteractions: []
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        user: {
          ...state.user,
          progress: {
            ...state.user.progress,
            [action.subject]: {
              ...state.user.progress[action.subject],
              completed: action.completed,
              score: action.score
            }
          }
        }
      };
    case 'UPDATE_STUDY_TIME':
      return {
        ...state,
        user: {
          ...state.user,
          studyTime: state.user.studyTime + action.time
        }
      };
    case 'UPDATE_STREAK':
      return {
        ...state,
        user: {
          ...state.user,
          streak: action.streak
        }
      };
    case 'SET_CURRENT_SUBJECT':
      return {
        ...state,
        currentSubject: action.subject
      };
    case 'ADD_QUIZ_RESULT':
      return {
        ...state,
        quizHistory: [...state.quizHistory, action.result]
      };
    case 'ADD_AI_INTERACTION':
      return {
        ...state,
        aiInteractions: [...state.aiInteractions, action.interaction]
      };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 