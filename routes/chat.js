const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const FAQ = require('../models/FAQ');
const geminiService = require('../services/geminiService');

// Send a message
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    // Get or create session
    let session = await Session.findOne({ sessionId });
    if (!session) {
      session = new Session({ sessionId });
      await session.save();
    }

    // Add user message to conversation history
    session.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get relevant FAQs
    const faqs = await FAQ.find({ isActive: true });
    const faqContext = faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');

    // Generate AI response
    const context = session.conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const aiResponse = await geminiService.generateResponse(message, faqContext + '\n\nConversation Context:\n' + context);

    // Add AI response to conversation history
    session.conversationHistory.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Check if escalation is needed (simple keyword-based detection)
    const escalationKeywords = ['escalate', 'manager', 'supervisor', 'human', 'agent', 'complaint'];
    const needsEscalation = escalationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword) || aiResponse.toLowerCase().includes('escalate')
    );

    if (needsEscalation) {
      session.isEscalated = true;
      session.escalationReason = 'Customer requested human assistance';
    }

    await session.save();

    res.json({
      success: true,
      response: aiResponse,
      sessionId: sessionId,
      isEscalated: session.isEscalated,
      escalationReason: session.escalationReason
    });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get conversation history
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      conversationHistory: session.conversationHistory,
      isEscalated: session.isEscalated
    });

  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

module.exports = router;

