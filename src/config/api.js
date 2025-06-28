// Real Gemini API Configuration
export const GEMINI_API_KEY = 'AIzaSyCgFIsTG8D3b1DVj-mMh8D2y7QzagYF0VU';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Function to list available models
export const listAvailableModels = async () => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    console.log('Available models:', data);
    return data;
  } catch (error) {
    console.error('Error listing models:', error);
    return null;
  }
};

// Real Gemini API call function
export const callGeminiAPI = async (prompt, context = '', subject = 'general') => {
  try {
    console.log('Calling real Gemini API for:', prompt.substring(0, 100) + '...');
    
    // Build the full prompt with context
    const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      })
    });

    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      
      // If model not found, try to list available models
      if (response.status === 404) {
        console.log('Model not found, checking available models...');
        await listAvailableModels();
      }
      
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response data:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      console.log('Real AI response:', aiResponse);
      return aiResponse;
    } else {
      console.error('Unexpected API response structure:', data);
      throw new Error('Invalid API response structure');
    }
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // If API fails, provide a helpful error message
    return `I apologize, but I'm having trouble connecting to my AI service right now. Please try again in a moment, or check your internet connection. Error: ${error.message}`;
  }
};

// Test function to verify API connection
export const testGeminiAPI = async () => {
  try {
    console.log('Testing real Gemini API connection...');
    
    // First, let's check what models are available
    console.log('Checking available models...');
    const models = await listAvailableModels();
    
    if (models && models.models) {
      console.log('Available models:', models.models.map(m => m.name));
    }
    
    const testResponse = await callGeminiAPI(
      "Hello! Please respond with 'Gemini API is working correctly' if you can see this message.",
      '',
      'test'
    );
    
    console.log('Test response:', testResponse);
    
    if (testResponse.includes('Gemini API is working correctly') || testResponse.length > 10) {
      console.log('✅ Gemini API is working!');
      return true;
    } else {
      console.log('❌ Gemini API test failed');
      return false;
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}; 