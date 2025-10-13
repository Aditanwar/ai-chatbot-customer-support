const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return;
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateResponse(prompt, context = '') {
    try {
      if (!this.model) {
        console.error('Gemini model not initialized');
        return this.getFallbackResponse(prompt, context);
      }

      // Try to find a matching FAQ first
      const faqMatch = this.findMatchingFAQ(prompt, context);
      if (faqMatch) {
        return faqMatch;
      }

      const fullPrompt = `You are a helpful customer support assistant. Use the following context and FAQ knowledge to provide accurate, helpful responses.

Context: ${context}

Customer Query: ${prompt}

Instructions:
1. If the query can be answered using the provided context, provide a helpful response
2. Be conversational and empathetic
3. If you cannot answer based on the context, politely explain that you need to escalate to a human agent
4. Keep responses concise but informative
5. Always maintain a professional and friendly tone

Response:`;

      console.log('Sending request to Gemini API...');
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = await response.text();
      console.log('Received response from Gemini API');
      return text;
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      
      // Return fallback response
      return this.getFallbackResponse(prompt, context);
    }
  }

  findMatchingFAQ(prompt, context) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Common FAQ patterns
    if (lowerPrompt.includes('password') || lowerPrompt.includes('reset')) {
      return "To reset your password, go to the login page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your email.";
    }
    
    if (lowerPrompt.includes('hours') || lowerPrompt.includes('time') || lowerPrompt.includes('open')) {
      return "Our customer support is available Monday through Friday, 9 AM to 6 PM EST. For urgent matters outside these hours, please email us and we'll respond within 24 hours.";
    }
    
    if (lowerPrompt.includes('track') || lowerPrompt.includes('order') || lowerPrompt.includes('shipping')) {
      return "You can track your order by logging into your account and going to 'My Orders', or by using the tracking number sent to your email. You can also track packages directly on the shipping carrier's website.";
    }
    
    if (lowerPrompt.includes('return') || lowerPrompt.includes('refund')) {
      return "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items like electronics have a 14-day return window. Please contact us before returning items.";
    }
    
    if (lowerPrompt.includes('billing') || lowerPrompt.includes('payment')) {
      return "To update your billing information, log into your account, go to 'Account Settings', then 'Billing Information'. You can update your payment method, billing address, and other billing details there.";
    }
    
    if (lowerPrompt.includes('contact') || lowerPrompt.includes('support') || lowerPrompt.includes('help')) {
      return "You can contact our customer support through this chat, email at support@company.com, or phone at 1-800-SUPPORT. Our support team is available Monday-Friday, 9 AM to 6 PM EST.";
    }
    
    return null;
  }

  getFallbackResponse(prompt, context) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Check for escalation keywords
    const escalationKeywords = ['manager', 'supervisor', 'human', 'agent', 'complaint', 'escalate'];
    if (escalationKeywords.some(keyword => lowerPrompt.includes(keyword))) {
      return "I understand you'd like to speak with a human agent. I'm escalating your request to our support team. A representative will be with you shortly.";
    }
    
    // Default helpful response
    return "I'm here to help! I can assist you with questions about your account, orders, billing, returns, and more. What specific issue can I help you with today?";
  }

  async findBestFAQ(query, faqs) {
    try {
      const prompt = `
Given the following customer query and FAQ database, find the most relevant FAQ entry.

Customer Query: ${query}

FAQ Database:
${faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}\nCategory: ${faq.category}`).join('\n\n')}

Return the most relevant FAQ entry or indicate if no match is found.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error finding FAQ:', error);
      return null;
    }
  }
}

module.exports = new GeminiService();
