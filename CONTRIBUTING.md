# Contributing to Store Ledger App

Thank you for your interest in contributing to Store Ledger App! We welcome contributions from everyone.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/store-ledger-app.git
   cd store-ledger-app
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ..
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Configure your .env file
   
   # Frontend
   cd ..
   cp .env.example .env
   # Configure your .env file
   ```

4. **Start development servers**
   ```bash
   # Backend (in backend directory)
   npm run dev
   
   # Frontend (in root directory)
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for new frontend code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages
Follow conventional commit format:
```
type(scope): description

Examples:
feat(auth): add OTP verification
fix(products): resolve quantity validation bug
docs(readme): update installation instructions
```

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
npm test
```

### Manual Testing
1. Test authentication flow
2. Test product CRUD operations
3. Test sales functionality
4. Test responsive design
5. Test dark/light mode

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Console errors

## 💡 Feature Requests

For new features:
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity
- Check if similar features exist

## 🔄 Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Use clear title and description
   - Reference related issues
   - Add screenshots for UI changes

## 📋 Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design tested
- [ ] Dark mode compatibility

## 🏗️ Project Structure

```
store-ledger-app/
├── backend/
│   ├── middleware/     # Authentication & error handling
│   ├── models/        # Database models
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   └── server.js      # Entry point
├── src/
│   ├── components/    # React components
│   ├── contexts/      # React contexts
│   ├── services/      # API calls
│   └── types/         # TypeScript definitions
└── docs/             # Documentation
```

## 🎯 Areas for Contribution

### High Priority
- [ ] Unit tests for components
- [ ] Integration tests for API
- [ ] Performance optimizations
- [ ] Accessibility improvements

### Medium Priority
- [ ] Additional SI units
- [ ] Export functionality
- [ ] Advanced filtering
- [ ] Bulk operations

### Low Priority
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Theme customization

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow project guidelines

## 📞 Getting Help

- Open an issue for bugs/features
- Join discussions in issues
- Ask questions in pull requests
- Contact maintainers directly

Thank you for contributing to Store Ledger App! 🎉