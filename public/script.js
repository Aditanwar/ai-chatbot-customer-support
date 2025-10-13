class ChatBot {
    constructor() {
        this.sessionId = null;
        this.isTyping = false;
        this.initializeEventListeners();
        this.createNewSession();
    }

    initializeEventListeners() {
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const newSessionBtn = document.getElementById('newSessionBtn');
        const dismissEscalation = document.getElementById('dismissEscalation');

        // Send message on Enter key
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Send message on button click
        sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // New session button
        newSessionBtn.addEventListener('click', () => {
            this.createNewSession();
        });

        // Dismiss escalation notice
        dismissEscalation.addEventListener('click', () => {
            document.getElementById('escalationNotice').style.display = 'none';
        });

        // Auto-resize input
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = messageInput.scrollHeight + 'px';
        });
    }

    async createNewSession() {
        try {
            const response = await fetch('/api/session/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: 'anonymous' })
            });

            const data = await response.json();
            
            if (data.success) {
                this.sessionId = data.sessionId;
                document.getElementById('sessionId').textContent = this.sessionId.substring(0, 8) + '...';
                this.clearChat();
                this.addBotMessage("Hello! I'm your AI customer support assistant. I'm here to help you with any questions you might have. What can I assist you with today?");
            } else {
                console.error('Failed to create session:', data.error);
            }
        } catch (error) {
            console.error('Error creating session:', error);
            this.addBotMessage("I'm having trouble connecting. Please refresh the page and try again.");
        }
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();

        if (!message || this.isTyping) return;

        // Add user message to chat
        this.addUserMessage(message);
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            const response = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    message: message
                })
            });

            const data = await response.json();
            this.hideTypingIndicator();

            if (data.success) {
                // Add bot response
                this.addBotMessage(data.response);

                // Check for escalation
                if (data.isEscalated) {
                    this.showEscalationNotice(data.escalationReason);
                }
            } else {
                this.addBotMessage("I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team directly.");
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addBotMessage("I'm sorry, but I'm having trouble connecting. Please check your internet connection and try again.");
        }
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = this.createMessageElement('user', message);
        chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = this.createMessageElement('bot', message);
        chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    createMessageElement(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = this.formatMessage(content);

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.getCurrentTime();

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);

        return messageDiv;
    }

    formatMessage(content) {
        // Simple formatting for better readability
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    showTypingIndicator() {
        this.isTyping = true;
        document.getElementById('typingIndicator').style.display = 'inline-block';
        document.getElementById('sendButton').disabled = true;
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        document.getElementById('typingIndicator').style.display = 'none';
        document.getElementById('sendButton').disabled = false;
    }

    showEscalationNotice(reason) {
        const escalationNotice = document.getElementById('escalationNotice');
        const reasonText = reason ? `Reason: ${reason}` : '';
        escalationNotice.querySelector('p').innerHTML = 
            `Our AI assistant has determined that your query requires human assistance. ${reasonText} A support agent will be with you shortly.`;
        escalationNotice.style.display = 'block';
    }

    clearChat() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize the chat bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ChatBot();
});