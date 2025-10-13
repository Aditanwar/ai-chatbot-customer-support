const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/Session');

// Create a new session
router.post('/create', async (req, res) => {
  try {
    const sessionId = uuidv4();
    const { userId } = req.body;

    const session = new Session({
      sessionId,
      userId: userId || 'anonymous'
    });

    await session.save();

    res.json({
      success: true,
      sessionId,
      message: 'New session created'
    });

  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session details
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        userId: session.userId,
        isEscalated: session.isEscalated,
        escalationReason: session.escalationReason,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        messageCount: session.conversationHistory.length
      }
    });

  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Update session context
router.put('/:sessionId/context', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { context } = req.body;

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.context = new Map(Object.entries(context));
    await session.save();

    res.json({
      success: true,
      message: 'Session context updated'
    });

  } catch (error) {
    console.error('Error updating session context:', error);
    res.status(500).json({ error: 'Failed to update session context' });
  }
});

// End session
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // In a real application, you might want to archive the session instead of deleting
    await Session.deleteOne({ sessionId });

    res.json({
      success: true,
      message: 'Session ended'
    });

  } catch (error) {
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

module.exports = router;

