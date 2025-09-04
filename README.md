
  # Wordnote - Smart Language Learning Platform

Wordnote is a comprehensive language learning platform that combines AI technology, Text-to-Speech, and chatbot capabilities to create an interactive and effective learning experience.

## 🏗️ System Architecture

The Wordnote project is built using a microservices architecture with the following main components:

### 📱 Frontend Applications
- **`wordnote-app/`** - Main React/TypeScript application
  - Modern user interface with Vite
  - Vocabulary learning, flashcards, listening practice
  - Integration with backend APIs

- **`wordnote-web/`** - Web application (in development)
  - Cross-platform web version
  - Multi-device compatibility

### 🔧 Backend Services
- **`wordnote-backend/`** - Main API server
  - RESTful API for applications
  - User data and learning progress management
  - Integration with AI services

### 🤖 AI & Machine Learning
- **`TTS/`** - Advanced TTS Framework
  - Advanced TTS framework with Coqui TTS
  - Custom model training support
  - High-quality audio output

- **`Chatbot/`** - Rasa Chatbot Framework
  - Intelligent chatbot for learning support
  - Natural Language Processing (NLP)
  - Integration with learning system

### 🏢 Infrastructure
- **`Infrastructure/`** - Infrastructure configuration
  - Docker, Kubernetes configurations
  - CI/CD pipelines
  - Monitoring and logging

## 🚀 Key Features

### 📚 Vocabulary Learning
- Smart flashcards with spaced repetition algorithm
- Vocabulary categorization by topic and difficulty
- Multi-language support

### 🎧 Listening Practice
- High-quality Text-to-Speech
- Natural, diverse voice options
- Adjustable speed and pitch

### 📖 Reading Comprehension
- Interactive stories and reading materials
- Vocabulary integration in context
- Diverse reading comprehension exercises

### 🤖 AI Chatbot Support
- 24/7 AI assistant
- Language-related question answering
- Learning method suggestions

### 📊 Statistics and Tracking
- Learning progress tracking
- Strength/weakness analysis
- Improvement recommendations

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Modern build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library

### Backend
- **Python 3.12** - Main language
- **FastAPI** - Web framework
- **Rasa** - Chatbot framework
- **Coqui TTS** - Text-to-Speech

### AI/ML
- **Edge TTS** - Microsoft TTS service
- **Azure Cognitive Services** - Speech services
- **Google TTS** - Google Text-to-Speech
- **Rasa NLU** - Natural Language Understanding

### Infrastructure
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **PostgreSQL** - Database
- **Redis** - Caching

## 🚀 Installation and Setup

### Prerequisites
- Node.js 18+
- Python 3.12+
- Docker (optional)

### Frontend (wordnote-app)
```bash
cd wordnote-app
npm install
npm run dev
```

### Backend API
```bash
cd wordnote-backend
pip install -r requirements.txt
python main.py
```

### Chatbot Service
```bash
cd Chatbot
pip install -r requirements.txt
rasa run --enable-api
```

## 📖 Documentation

- [Frontend Documentation](wordnote-app/README.md)
- [Backend API Documentation](wordnote-backend/README.md)
- [TTS Documentation](TTS/README.md)
- [Chatbot Documentation](Chatbot/README.md)
- [Infrastructure Guide](Infrastructure/README.md)

## 🤝 Contributing

The Wordnote project welcomes contributions from the community. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🔗 Links

- [Figma Design](https://www.figma.com/design/6T5qzOQnCUJbFm5TszFM3I/%E1%BB%A8ng-d%E1%BB%A5ng-h%E1%BB%8Dc-ngo%E1%BA%A1i-ng%E1%BB%AF-WordNote)
- [Documentation](https://wordnote.dev)
- [API Reference](https://api.wordnote.dev/docs)

---

**Wordnote** - Smart, effective, and fun language learning! 🌟
  