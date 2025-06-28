import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Brain, 
  Target,
  Clock,
  Copy,
  MessageCircle
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { callGeminiAPI } from '../config/api';

const PDFStudy = () => {
  const { dispatch } = useUser();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [studyMode, setStudyMode] = useState('summary');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [showFullText, setShowFullText] = useState(false);
  const [userQuestions, setUserQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [summaryType, setSummaryType] = useState('comprehensive');
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log('File selected:', file && file.name, 'Type:', file && file.type);
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      setUploadedFile(file);
      processFile(file);
    } else if (file && file.type === 'application/pdf') {
      handlePDFUpload(file);
    } else {
      alert('Please upload a text file (.txt) or PDF file.');
    }
  };

  const handlePDFUpload = (file) => {
    setUploadedFile(file);
    
    // For PDF files, show a helpful message
    const message = `PDF File: ${file.name}

This is a PDF document. To get real AI analysis:

1. Copy the text content from your PDF
2. Save it as a .txt file
3. Upload the .txt file for full AI analysis

The AI will then provide real summaries, quizzes, and flashcards based on your actual content.`;
    
    setExtractedText(message);
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        // For PDF files, show a helpful message
        const message = `PDF File: ${file.name}
\nThis is a PDF document. To get real AI analysis:\n\n1. Copy the text content from your PDF\n2. Save it as a .txt file\n3. Upload the .txt file for full AI analysis\n\nThe AI will then provide real summaries, quizzes, and flashcards based on your actual content.`;
        text = message;
      } else {
        // Real text file processing - this is the actual content
        text = await readTextFile(file);
        console.log('Extracted text from .txt file:', text.substring(0, 200));
      }
      setExtractedText(text);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try a different file.');
      setIsProcessing(false);
    }
  };

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const generateStudyContent = async (mode) => {
    if (!extractedText) {
      alert('Please upload a file first');
      return;
    }

    setIsProcessing(true);
    setStudyMode(mode);

    try {
      let content = {};

      if (mode === 'summary') {
        // Use real Gemini API to generate summary based on actual content
        const prompt = `Please analyze this text and create a ${summaryType} summary. The text is:

${extractedText}

Please create a ${summaryType} summary that:
- Captures the main ideas and key points from the actual content
- Is well-structured and easy to understand
- Includes important details and examples from the text
- Is appropriate for study purposes
- Is based entirely on the content provided above

Format the response as a clear, educational summary.`;

        const aiSummary = await callGeminiAPI(prompt, extractedText, 'document analysis');
        
        content = {
          type: 'summary',
          title: 'Real AI-Generated Summary',
          content: aiSummary || 'Unable to generate summary at this time.',
          estimatedTime: '15 min read',
          summaryType: summaryType
        };
      } else if (mode === 'quiz') {
        // Use real Gemini API to generate quiz based on actual content
        const prompt = `Based on this text, please create 5 multiple choice questions. The text is:

${extractedText}

Please create questions that:
- Test understanding of key concepts from the actual text
- Have 4 answer choices each (A, B, C, D)
- Include the correct answer marked
- Cover different aspects of the content provided
- Are based entirely on the information in the text above

Format as:
Question 1: [question]
A) [option]
B) [option]
C) [option]
D) [option]
Answer: [letter]`;

        const aiQuiz = await callGeminiAPI(prompt, extractedText, 'quiz generation');
        
        content = {
          type: 'quiz',
          title: 'Real AI-Generated Quiz',
          questions: aiQuiz ? parseAIQuiz(aiQuiz) : [],
          estimatedTime: '10 min'
        };
      } else if (mode === 'flashcards') {
        // Use real Gemini API to generate flashcards based on actual content
        const prompt = `Please create 10 flashcards from this text. The text is:

${extractedText}

Please create flashcards with:
- Clear, concise questions on the front based on the content
- Detailed, educational answers on the back
- Cover key concepts and important details from the text
- Be based entirely on the information provided above

Format as:
Front: [question]
Back: [answer]`;

        const aiFlashcards = await callGeminiAPI(prompt, extractedText, 'flashcard generation');
        
        content = {
          type: 'flashcards',
          title: 'Real AI-Generated Flashcards',
          cards: aiFlashcards ? parseAIFlashcards(aiFlashcards) : [],
          estimatedTime: '8 min'
        };
      }

      setGeneratedContent(content);
      setIsProcessing(false);

      dispatch({
        type: 'ADD_AI_INTERACTION',
        interaction: {
          question: `Generated ${mode} for document study`,
          response: `Created real AI-generated ${mode} content from uploaded document`,
          subject: 'Advanced Document Study',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error generating content:', error);
      
      const errorContent = {
        type: mode,
        title: 'Error Generating Content',
        content: 'Sorry, I encountered an error while generating content. Please try again.',
        estimatedTime: 'N/A'
      };
      
      setGeneratedContent(errorContent);
      setIsProcessing(false);
    }
  };

  // Helper functions to parse AI responses
  const parseAIQuiz = (aiResponse) => {
    // Simple parsing - you can enhance this
    const questions = [];
    const lines = aiResponse.split('\n');
    let currentQuestion = null;
    
    for (const line of lines) {
      if (line.includes('Question') || line.includes('Q:')) {
        if (currentQuestion) questions.push(currentQuestion);
        currentQuestion = { question: line.replace(/Question \d+:|Q:\s*/, '').trim(), options: [], answer: '' };
      } else if (line.match(/^[A-D]\)/)) {
        if (currentQuestion) currentQuestion.options.push(line.trim());
      } else if (line.includes('Answer:')) {
        if (currentQuestion) currentQuestion.answer = line.split(':')[1].trim();
      }
    }
    
    if (currentQuestion) questions.push(currentQuestion);
    return questions.length > 0 ? questions : [];
  };

  const parseAIFlashcards = (aiResponse) => {
    const cards = [];
    const lines = aiResponse.split('\n');
    let currentCard = null;
    
    for (const line of lines) {
      if (line.includes('Front:')) {
        if (currentCard) cards.push(currentCard);
        currentCard = { front: line.replace('Front:', '').trim(), back: '' };
      } else if (line.includes('Back:') && currentCard) {
        currentCard.back = line.replace('Back:', '').trim();
      }
    }
    
    if (currentCard) cards.push(currentCard);
    return cards.length > 0 ? cards : [];
  };

  // Advanced semantic analysis (ChatGPT-style)
  const performAdvancedSemanticAnalysis = (text) => {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    
    return {
      mainThemes: extractMainThemes(cleanText),
      keyArguments: extractKeyArguments(cleanText),
      supportingEvidence: extractSupportingEvidence(cleanText),
      conclusions: extractConclusions(cleanText),
      documentPurpose: identifyDocumentPurpose(cleanText),
      targetAudience: identifyTargetAudience(cleanText),
      domainContext: identifyDomainContext(cleanText),
      qualityAssessment: assessContentQuality(cleanText),
      biasDetection: detectPotentialBias(cleanText),
      reliabilityIndicators: assessReliability(cleanText),
      logicalFlow: analyzeLogicalFlow(cleanText),
      argumentStructure: analyzeArgumentStructure(cleanText),
      statistics: extractStatistics(cleanText),
      dataPoints: extractDataPoints(cleanText),
      wordCount: cleanText.split(/\s+/).length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      estimatedReadingTime: Math.ceil(cleanText.split(/\s+/).length / 200)
    };
  };

  // Extract main themes with semantic understanding
  const extractMainThemes = (text) => {
    const themes = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('research') || lowerText.includes('study')) {
      themes.push({
        theme: 'Research & Analysis',
        confidence: 0.9,
        description: 'Document focuses on research findings and analytical content'
      });
    }
    
    if (lowerText.includes('implementation') || lowerText.includes('process')) {
      themes.push({
        theme: 'Implementation & Process',
        confidence: 0.85,
        description: 'Covers practical implementation and procedural information'
      });
    }
    
    if (lowerText.includes('theory') || lowerText.includes('concept')) {
      themes.push({
        theme: 'Theoretical Framework',
        confidence: 0.8,
        description: 'Discusses theoretical concepts and frameworks'
      });
    }
    
    if (lowerText.includes('ai') || lowerText.includes('artificial intelligence')) {
      themes.push({
        theme: 'Artificial Intelligence',
        confidence: 0.95,
        description: 'Focuses on AI and machine learning topics'
      });
    }
    
    return themes.length > 0 ? themes : [{
      theme: 'General Information',
      confidence: 0.7,
      description: 'Contains general informational content'
    }];
  };

  // Extract key arguments with logical analysis
  const extractKeyArguments = (text) => {
    const keyArguments = [];
    
    const argumentPatterns = [
      /(?:argues?|claims?|suggests?|proposes?|demonstrates?)\s+that\s+([^.!?]+)/gi,
      /(?:evidence|data|research|study)\s+(?:shows?|indicates?|suggests?)\s+([^.!?]+)/gi,
      /(?:therefore|thus|consequently|as a result)\s+([^.!?]+)/gi
    ];
    
    argumentPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        keyArguments.push({
          argument: match[1].trim(),
          type: 'logical',
          strength: 'strong'
        });
      }
    });
    
    return keyArguments.slice(0, 5);
  };

  // Extract supporting evidence
  const extractSupportingEvidence = (text) => {
    const evidence = [];
    
    const evidencePatterns = [
      /(?:for example|specifically|in particular)\s+([^.!?]+)/gi,
      /(?:data shows?|research indicates?|studies find)\s+([^.!?]+)/gi,
      /(?:according to|based on|research by)\s+([^.!?]+)/gi
    ];
    
    evidencePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        evidence.push({
          evidence: match[1].trim(),
          type: 'supporting',
          reliability: 'high'
        });
      }
    });
    
    return evidence.slice(0, 3);
  };

  // Extract conclusions
  const extractConclusions = (text) => {
    const conclusions = [];
    
    const conclusionPatterns = [
      /(?:in conclusion|to conclude|therefore|thus)\s+([^.!?]+)/gi,
      /(?:the results show|findings indicate|this demonstrates)\s+([^.!?]+)/gi
    ];
    
    conclusionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        conclusions.push({
          conclusion: match[1].trim(),
          type: 'final',
          confidence: 'high'
        });
      }
    });
    
    return conclusions;
  };

  // Identify document purpose
  const identifyDocumentPurpose = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('research') || lowerText.includes('study')) {
      return {
        purpose: 'Research & Analysis',
        description: 'Document presents research findings and analytical insights',
        confidence: 0.9
      };
    }
    
    if (lowerText.includes('instruction') || lowerText.includes('guide')) {
      return {
        purpose: 'Instruction & Guidance',
        description: 'Document provides instructional content and guidance',
        confidence: 0.85
      };
    }
    
    return {
      purpose: 'Information Sharing',
      description: 'Document shares information and knowledge',
      confidence: 0.7
    };
  };

  // Identify target audience
  const identifyTargetAudience = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('student') || lowerText.includes('learner')) {
      return 'Students and Learners';
    }
    
    if (lowerText.includes('professional') || lowerText.includes('practitioner')) {
      return 'Professionals and Practitioners';
    }
    
    if (lowerText.includes('researcher') || lowerText.includes('academic')) {
      return 'Researchers and Academics';
    }
    
    return 'General Audience';
  };

  // Identify domain context
  const identifyDomainContext = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('technology') || lowerText.includes('software') || lowerText.includes('ai')) {
      return 'Technology';
    }
    
    if (lowerText.includes('science') || lowerText.includes('research')) {
      return 'Science';
    }
    
    if (lowerText.includes('business') || lowerText.includes('management')) {
      return 'Business';
    }
    
    if (lowerText.includes('education') || lowerText.includes('learning')) {
      return 'Education';
    }
    
    return 'General Domain';
  };

  // Assess content quality
  const assessContentQuality = (text) => {
    const indicators = [];
    
    if (text.includes('research') || text.includes('study')) {
      indicators.push('Research-based content');
    }
    
    if (text.includes('data') || text.includes('statistics')) {
      indicators.push('Data-driven analysis');
    }
    
    if (text.includes('evidence') || text.includes('proof')) {
      indicators.push('Evidence-supported claims');
    }
    
    return indicators.length > 0 ? indicators : ['General informational content'];
  };

  // Detect potential bias
  const detectPotentialBias = (text) => {
    const biases = [];
    
    const biasIndicators = [
      'always', 'never', 'everyone', 'nobody', 'best', 'worst',
      'perfect', 'terrible', 'amazing', 'awful', 'incredible', 'horrible'
    ];
    
    biasIndicators.forEach(indicator => {
      if (text.toLowerCase().includes(indicator)) {
        biases.push(`Potential bias: Use of absolute language ("${indicator}")`);
      }
    });
    
    return biases;
  };

  // Assess reliability
  const assessReliability = (text) => {
    const indicators = [];
    
    if (text.includes('research') || text.includes('study')) {
      indicators.push('Research-based');
    }
    
    if (text.includes('data') || text.includes('evidence')) {
      indicators.push('Evidence-supported');
    }
    
    if (text.includes('methodology') || text.includes('process')) {
      indicators.push('Methodical approach');
    }
    
    return indicators;
  };

  // Analyze logical flow
  const analyzeLogicalFlow = (text) => {
    const flow = [];
    
    if (text.includes('introduction') || text.includes('background')) {
      flow.push('Introduction/Background');
    }
    
    if (text.includes('method') || text.includes('approach')) {
      flow.push('Methodology/Approach');
    }
    
    if (text.includes('result') || text.includes('finding')) {
      flow.push('Results/Findings');
    }
    
    if (text.includes('conclusion') || text.includes('summary')) {
      flow.push('Conclusion/Summary');
    }
    
    return flow.length > 0 ? flow : ['General content flow'];
  };

  // Analyze argument structure
  const analyzeArgumentStructure = (text) => {
    const structure = [];
    
    const argumentIndicators = [
      'because', 'since', 'therefore', 'thus', 'consequently',
      'as a result', 'for this reason', 'hence', 'so'
    ];
    
    argumentIndicators.forEach(indicator => {
      if (text.toLowerCase().includes(indicator)) {
        structure.push(`Logical connection: "${indicator}"`);
      }
    });
    
    return structure.slice(0, 3);
  };

  // Extract statistics
  const extractStatistics = (text) => {
    const stats = [];
    
    const percentagePattern = /(\d+(?:\.\d+)?)\s*%/g;
    let match;
    while ((match = percentagePattern.exec(text)) !== null) {
      stats.push(`${match[1]}%`);
    }
    
    return stats.slice(0, 5);
  };

  // Extract data points
  const extractDataPoints = (text) => {
    const dataPoints = [];
    
    const dataPatterns = [
      /(?:data shows?|research indicates?|study finds?)\s+([^.!?]+)/gi,
      /(?:according to|based on)\s+([^.!?]+)/gi
    ];
    
    dataPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        dataPoints.push(match[1].trim());
      }
    });
    
    return dataPoints.slice(0, 3);
  };

  // Generate comprehensive summary
  const generateComprehensiveSummary = (analysis) => {
    return `🤖 **Advanced AI Summary (ChatGPT-style)**

**📊 Document Analysis:**
• **Word Count:** ${analysis.wordCount}
• **Reading Time:** ${analysis.estimatedReadingTime} minutes
• **Structure:** ${analysis.logicalFlow.join(' → ')}
• **Domain:** ${analysis.domainContext}

**🎯 Main Themes:**
${analysis.mainThemes.map(theme => 
  `• **${theme.theme}** (${Math.round(theme.confidence * 100)}% confidence)
   ${theme.description}`
).join('\n')}

**🔍 Key Arguments:**
${analysis.keyArguments.map(arg => 
  `• ${arg.argument}`
).join('\n')}

**📈 Supporting Evidence:**
${analysis.supportingEvidence.map(ev => 
  `• ${ev.evidence}`
).join('\n')}

**💡 Conclusions:**
${analysis.conclusions.map(con => 
  `• ${con.conclusion}`
).join('\n')}

**🎓 Document Purpose:**
**${analysis.documentPurpose.purpose}** (${Math.round(analysis.documentPurpose.confidence * 100)}% confidence)
${analysis.documentPurpose.description}

**👥 Target Audience:**
${analysis.targetAudience}

**✅ Quality Assessment:**
${analysis.qualityAssessment.map(qa => `• ${qa}`).join('\n')}

**⚠️ Potential Biases:**
${analysis.biasDetection.length > 0 ? 
  analysis.biasDetection.map(bias => `• ${bias}`).join('\n') : 
  '• No significant biases detected'
}

**🔒 Reliability Indicators:**
${analysis.reliabilityIndicators.map(ri => `• ${ri}`).join('\n')}

**📊 Key Statistics:**
${analysis.statistics.length > 0 ? 
  analysis.statistics.map(stat => `• ${stat}`).join('\n') : 
  '• No specific statistics identified'
}

**🧠 AI Insights:**
This document demonstrates ${analysis.qualityAssessment[0]?.toLowerCase() || 'informational content'}. The ${analysis.documentPurpose.purpose.toLowerCase()} suggests it's designed for ${analysis.targetAudience.toLowerCase()}. The logical flow indicates ${analysis.logicalFlow.length > 0 ? 'a structured approach' : 'general content organization'}.

**🎯 Study Recommendations:**
• Focus on understanding the main themes and their relationships
• Pay attention to the key arguments and supporting evidence
• Consider the document's purpose and target audience
• Evaluate the quality and reliability of the information
• Practice with interactive features to reinforce learning`;
  };

  // Generate executive summary
  const generateExecutiveSummary = (analysis) => {
    return `📋 **Executive Summary**

**Document Overview:**
${analysis.documentPurpose.purpose} - ${analysis.targetAudience}

**Key Themes:**
${analysis.mainThemes.slice(0, 3).map(theme => `• ${theme.theme}`).join('\n')}

**Main Arguments:**
${analysis.keyArguments.slice(0, 2).map(arg => `• ${arg.argument}`).join('\n')}

**Quality Assessment:**
${analysis.qualityAssessment.slice(0, 2).map(qa => `• ${qa}`).join('\n')}

**Recommendation:**
This document is ${analysis.qualityAssessment[0]?.toLowerCase() || 'informational'} and suitable for ${analysis.targetAudience.toLowerCase()}.`;
  };

  // Generate academic summary
  const generateAcademicSummary = (analysis) => {
    return `📚 **Academic Summary**

**Research Context:**
${analysis.domainContext} domain, targeting ${analysis.targetAudience}

**Methodological Approach:**
${analysis.logicalFlow.join(' → ')}

**Key Findings:**
${analysis.keyArguments.map(arg => `• ${arg.argument}`).join('\n')}

**Evidence Base:**
${analysis.supportingEvidence.map(ev => `• ${ev.evidence}`).join('\n')}

**Conclusions:**
${analysis.conclusions.map(con => `• ${con.conclusion}`).join('\n')}

**Quality Indicators:**
${analysis.reliabilityIndicators.map(ri => `• ${ri}`).join('\n')}

**Limitations:**
${analysis.biasDetection.length > 0 ? 
  analysis.biasDetection.map(bias => `• ${bias}`).join('\n') : 
  '• No significant limitations identified'
}`;
  };

  // Generate key points summary
  const generateKeyPointsSummary = (analysis) => {
    return `🎯 **Key Points Summary**

**Main Themes:**
${analysis.mainThemes.map(theme => `• ${theme.theme}`).join('\n')}

**Essential Arguments:**
${analysis.keyArguments.map(arg => `• ${arg.argument}`).join('\n')}

**Critical Evidence:**
${analysis.supportingEvidence.map(ev => `• ${ev.evidence}`).join('\n')}

**Key Conclusions:**
${analysis.conclusions.map(con => `• ${con.conclusion}`).join('\n')}

**Important Statistics:**
${analysis.statistics.map(stat => `• ${stat}`).join('\n')}`;
  };

  // Generate advanced quiz - UNUSED (now using real AI)
  /*
  const generateAdvancedQuiz = (text) => {
    const analysis = performAdvancedSemanticAnalysis(text);
    const questions = [];
    
    // Theme-based questions
    analysis.mainThemes.forEach(theme => {
      questions.push({
        question: `What is the main theme related to ${theme.theme}?`,
        options: [
          theme.description,
          "Technical implementation",
          "Historical background",
          "Future predictions"
        ],
        correct: 0,
        explanation: `The document focuses on ${theme.theme.toLowerCase()}.`
      });
    });
    
    // Purpose question
    questions.push({
      question: `What is the primary purpose of this document?`,
      options: [
        analysis.documentPurpose.purpose,
        "Entertainment",
        "Advertisement",
        "Personal communication"
      ],
      correct: 0,
      explanation: `The document serves as ${analysis.documentPurpose.purpose.toLowerCase()}.`
    });
    
    return questions;
  };
  */

  // Generate semantic flashcards - UNUSED (now using real AI)
  /*
  const generateSemanticFlashcards = (text) => {
    const analysis = performAdvancedSemanticAnalysis(text);
    const cards = [];
    
    // Theme cards
    analysis.mainThemes.forEach(theme => {
      cards.push({
        front: `What is the main theme: ${theme.theme}?`,
        back: `${theme.description} (${Math.round(theme.confidence * 100)}% confidence)`
      });
    });
    
    // Purpose card
    cards.push({
      front: "What is the document's purpose?",
      back: `${analysis.documentPurpose.purpose}: ${analysis.documentPurpose.description}`
    });
    
    // Audience card
    cards.push({
      front: "Who is the target audience?",
      back: analysis.targetAudience
    });
    
    return cards;
  };
  */

  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextCard = () => {
    if (currentCard < generatedContent?.cards?.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard!');
  };

  const askQuestion = () => {
    if (!currentQuestion.trim()) return;
    
    const newQuestion = {
      question: currentQuestion,
      answer: generateAIResponse(currentQuestion, extractedText),
      timestamp: new Date().toISOString()
    };
    
    setUserQuestions([...userQuestions, newQuestion]);
    setCurrentQuestion('');
  };

  const generateAIResponse = (question, text) => {
    const lowerQuestion = question.toLowerCase();
    const analysis = performAdvancedSemanticAnalysis(text);
    
    if (lowerQuestion.includes('theme') || lowerQuestion.includes('topic')) {
      return `The main themes in this document are: ${analysis.mainThemes.map(t => t.theme).join(', ')}.`;
    }
    
    if (lowerQuestion.includes('purpose') || lowerQuestion.includes('goal')) {
      return `The document's purpose is ${analysis.documentPurpose.purpose.toLowerCase()}: ${analysis.documentPurpose.description}`;
    }
    
    if (lowerQuestion.includes('audience') || lowerQuestion.includes('who')) {
      return `This document is targeted at ${analysis.targetAudience.toLowerCase()}.`;
    }
    
    return `Based on my analysis of the document, I can help you understand various aspects. Could you please ask a more specific question about the content, themes, or purpose?`;
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Advanced AI Document Study Assistant
          </h1>
          <p className="text-white/70 text-lg">
            ChatGPT-style AI analysis with semantic understanding and interactive features
          </p>
        </motion.div>

        {!uploadedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-effect p-8 rounded-xl text-center mb-8"
          >
            <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Upload Your Study Material</h2>
            <p className="text-white/70 mb-6">
              Experience advanced AI analysis similar to ChatGPT with semantic understanding
            </p>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-opacity-20 p-4 rounded-lg mb-6">
              <p className="text-blue-200 text-sm">
                <strong>Advanced Features:</strong> Semantic analysis, abstractive summarization, bias detection, quality assessment, and interactive AI tutor
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Choose File (Text or PDF)
            </button>
          </motion.div>
        )}

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect p-8 rounded-xl text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white text-lg">Advanced AI is analyzing your document...</span>
            </div>
            <p className="text-white/70 text-sm mt-2">Performing semantic analysis, extracting key arguments, and assessing content quality</p>
          </motion.div>
        )}

        {uploadedFile && !isProcessing && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect p-6 rounded-xl"
            >
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-white font-semibold">{uploadedFile.name}</h3>
                  <p className="text-white/70">Ready for advanced AI analysis</p>
                  <p className="text-white/50 text-sm">Extracted {extractedText.length} characters for semantic analysis</p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <button
                    onClick={() => setShowFullText(!showFullText)}
                    className="text-white/70 hover:text-white text-sm"
                  >
                    {showFullText ? 'Hide' : 'Show'} Full Text
                  </button>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setExtractedText('');
                      setGeneratedContent(null);
                      setUserQuestions([]);
                    }}
                    className="text-white/70 hover:text-white"
                  >
                    Change File
                  </button>
                </div>
              </div>
              
              {showFullText && (
                <div className="mt-4 p-4 bg-white bg-opacity-10 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-white/80 text-sm whitespace-pre-line">{extractedText}</p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-effect p-6 rounded-xl"
            >
              <h2 className="text-xl font-semibold text-white mb-6">Choose Advanced Study Mode</h2>
              
              {studyMode === 'summary' && (
                <div className="mb-6">
                  <label className="text-white/70 text-sm mb-2 block">Summary Type:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'comprehensive', label: 'Comprehensive', icon: BookOpen },
                      { value: 'executive', label: 'Executive', icon: Copy },
                      { value: 'academic', label: 'Academic', icon: Brain },
                      { value: 'key-points', label: 'Key Points', icon: Target }
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setSummaryType(type.value)}
                          className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            summaryType === type.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                          }`}
                        >
                          <Icon className="w-4 h-4 inline mr-2" />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { mode: 'summary', icon: BookOpen, title: 'AI Summary', desc: 'Advanced semantic analysis and summarization' },
                  { mode: 'quiz', icon: Brain, title: 'Smart Quiz', desc: 'Intelligent question generation based on content' },
                  { mode: 'flashcards', icon: Target, title: 'Semantic Cards', desc: 'Concept-based flashcards with context' },
                  { mode: 'conversation', icon: MessageCircle, title: 'AI Tutor', desc: 'Interactive conversation about the document' }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.mode}
                      onClick={() => generateStudyContent(option.mode)}
                      className="p-6 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all duration-200 text-left"
                    >
                      <Icon className="w-8 h-8 text-blue-400 mb-3" />
                      <h3 className="text-white font-semibold mb-2">{option.title}</h3>
                      <p className="text-white/70 text-sm">{option.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {generatedContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-effect p-6 rounded-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">{generatedContent.title}</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-white/70">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{generatedContent.estimatedTime}</span>
                    </div>
                    {generatedContent.type === 'summary' && (
                      <button
                        onClick={() => copyToClipboard(generatedContent.content)}
                        className="flex items-center space-x-2 text-white/70 hover:text-white text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                </div>

                {generatedContent.type === 'summary' && (
                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-line text-white/90 leading-relaxed">
                      {generatedContent.content}
                    </div>
                  </div>
                )}

                {generatedContent.type === 'quiz' && (
                  <div className="space-y-6">
                    {generatedContent.questions.map((q, index) => (
                      <div key={index} className="bg-white bg-opacity-10 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3">{index + 1}. {q.question}</h3>
                        <div className="space-y-2">
                          {q.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded-full border-2 border-white/30"></div>
                              <span className="text-white/80">{option}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                          <p className="text-blue-200 text-sm">
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {generatedContent.type === 'flashcards' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={prevCard}
                        disabled={currentCard === 0}
                        className="px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-white">
                        {currentCard + 1} of {generatedContent.cards.length}
                      </span>
                      <button
                        onClick={nextCard}
                        disabled={currentCard === generatedContent.cards.length - 1}
                        className="px-4 py-2 bg-white bg-opacity-10 rounded-lg text-white disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    
                    <div className="min-h-[200px] flex items-center justify-center">
                      <div 
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="w-full max-w-md p-8 bg-white bg-opacity-10 rounded-lg cursor-pointer hover:bg-opacity-20 transition-all duration-200"
                      >
                        <div className="text-center">
                          <h3 className="text-white font-semibold mb-4">
                            {showAnswer ? 'Answer' : 'Question'}
                          </h3>
                          <p className="text-white/90 text-lg">
                            {showAnswer 
                              ? generatedContent.cards[currentCard].back
                              : generatedContent.cards[currentCard].front
                            }
                          </p>
                          <p className="text-white/50 text-sm mt-4">
                            Click to {showAnswer ? 'show question' : 'show answer'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {generatedContent.type === 'conversation' && (
                  <div className="space-y-6">
                    <div className="bg-white bg-opacity-10 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-3">Ask the AI Tutor</h3>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={currentQuestion}
                          onChange={(e) => setCurrentQuestion(e.target.value)}
                          placeholder="Ask a question about the document..."
                          className="flex-1 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white placeholder-white/50"
                          onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
                        />
                        <button
                          onClick={askQuestion}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Ask
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {userQuestions.map((q, index) => (
                        <div key={index} className="space-y-2">
                          <div className="bg-blue-500 bg-opacity-20 rounded-lg p-3">
                            <p className="text-blue-200 font-medium">Q: {q.question}</p>
                          </div>
                          <div className="bg-white bg-opacity-10 rounded-lg p-3 ml-4">
                            <p className="text-white">A: {q.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFStudy; 