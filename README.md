# AI Customer Support Bot

A sophisticated AI-powered customer support chatbot built with Node.js, Express, MongoDB, and Google's Gemini API. The bot provides intelligent responses, maintains session-based memory, and can escalate complex queries to human agents.

## Features

- 🤖 **AI-Powered Responses**: Uses Google's Gemini API for intelligent, contextual responses
- 💾 **Session Memory**: Maintains conversation context across messages
- 📚 **FAQ Integration**: Pre-loaded with common customer support questions
- 🚨 **Smart Escalation**: Automatically escalates complex queries to human agents
- 💬 **Real-time Chat**: Modern, responsive chat interface
- 🔄 **Session Management**: Create, track, and manage user sessions
- 📊 **MongoDB Storage**: Persistent storage for conversations and sessions

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **AI**: Google Gemini API
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Session Management**: UUID-based sessions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Gemini API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-customer-support-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/customer_support_bot
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Ensure MongoDB is running on `mongodb://localhost:27017`
   - The database `customer_support_bot` will be created automatically

5. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

6. **Seed the FAQ database**
   ```bash
   node scripts/seedFAQs.js
   ```

7. **Start the application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - Start chatting with the AI assistant!

## API Endpoints

### Chat Endpoints

#### Send Message
```http
POST /api/chat/message
Content-Type: application/json

{
  "sessionId": "uuid-string",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI response text",
  "sessionId": "uuid-string",
  "isEscalated": false,
  "escalationReason": null
}
```

#### Get Conversation History
```http
GET /api/chat/history/:sessionId
```

**Response:**
```json
{
  "success": true,
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-01T12:00:00.000Z"
    }
  ],
  "isEscalated": false
}
```

### Session Endpoints

#### Create New Session
```http
POST /api/session/create
Content-Type: application/json

{
  "userId": "optional-user-id"
}
```

#### Get Session Details
```http
GET /api/session/:sessionId
```

#### Update Session Context
```http
PUT /api/session/:sessionId/context
Content-Type: application/json

{
  "context": {
    "key": "value"
  }
}
```

#### End Session
```http
DELETE /api/session/:sessionId
```

## Project Structure

```
ai-customer-support-bot/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles
│   └── script.js          # Frontend JavaScript
├── models/                 # MongoDB models
│   ├── Session.js         # Session model
│   └── FAQ.js             # FAQ model
├── routes/                 # Express routes
│   ├── chat.js            # Chat endpoints
│   └── session.js         # Session endpoints
├── services/               # Business logic
│   └── geminiService.js   # Gemini AI integration
├── scripts/                # Utility scripts
│   └── seedFAQs.js         # FAQ data seeding
├── server.js              # Main server file
├── package.json           # Dependencies
└── README.md              # This file
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/customer_support_bot` |
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

### FAQ Customization

Edit `scripts/seedFAQs.js` to customize the FAQ database:

```javascript
const faqData = [
  {
    question: "Your question here",
    answer: "Your answer here",
    category: "Category",
    keywords: ["keyword1", "keyword2"],
    priority: 1
  }
];
```

## Features Explained

### AI Response Generation
- Uses Google's Gemini API for natural language processing
- Incorporates FAQ knowledge base for accurate responses
- Maintains conversation context for better understanding

### Session Management
- Each user gets a unique session ID
- Conversation history is preserved across messages
- Context is maintained for personalized responses

### Escalation System
- Automatically detects when human intervention is needed
- Keywords like "manager", "supervisor", "human" trigger escalation
- Escalated sessions are flagged for human agents

### FAQ Integration
- Pre-loaded with common customer support questions
- AI uses FAQ data to provide accurate, consistent responses
- Easy to update and maintain

## Development

### Adding New Features

1. **New API Endpoints**: Add routes in the `routes/` directory
2. **Database Models**: Create new models in the `models/` directory
3. **Frontend Features**: Update files in the `public/` directory
4. **AI Enhancements**: Modify `services/geminiService.js`

### Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Test message sending
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-session","message":"Hello"}'
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Gemini API Error**
   - Verify API key is correct
   - Check API quota and limits

3. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on port 3000

### Logs

Check console output for detailed error messages and debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Open an issue on GitHub

---

**Happy Chatting! 🤖💬**

