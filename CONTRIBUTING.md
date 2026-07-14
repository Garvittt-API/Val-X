# Contributing to ValX

Thank you for your interest in contributing to ValX! This document provides guidelines and information for contributors.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Git](https://git-scm.com/)
- [VALORANT](https://playvalorant.com/) client (for testing)

## Development Setup

1. **Fork the repository**
   
   Click the "Fork" button on the GitHub repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Val-X.git
   cd Val-X
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run Tauri in development mode** (optional, requires VALORANT client)
   ```bash
   npm run tauri dev
   ```

## Branch Naming

Use descriptive branch names with the following prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Example: `feature/overlay-customization`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements

**Examples:**
```
feat(overlay): add opacity customization
fix(dashboard): correct rank display for Radiant players
docs(readme): update installation instructions
```

## Pull Request Process

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them following the commit message format

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub

### PR Requirements

- [ ] Clear, descriptive title
- [ ] Description of changes made
- [ ] Related issue linked (if applicable)
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No console errors in browser
- [ ] UI changes tested in browser
- [ ] Responsive design verified (if applicable)

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #issue_number

## How Has This Been Tested?
Describe the tests you ran

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings
```

## Code Style

### TypeScript/React

- Use TypeScript for all new files
- Prefer functional components with hooks
- Use descriptive variable and function names
- Keep components small and focused
- Extract reusable logic into custom hooks

### Tailwind CSS

- Use utility classes over custom CSS
- Follow the existing color palette in `tailwind.config.ts`
- Use the glass/glow utility classes for consistency
- Maintain responsive design

### Rust (Backend)

- Follow standard Rust naming conventions
- Use meaningful error messages
- Add comments for complex logic
- Handle errors gracefully

## Project Structure

```
ValX/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # UI components
│   │   ├── dashboard/      # Dashboard view
│   │   ├── match/          # Live match & agent select
│   │   ├── overlay/        # In-game overlay
│   │   ├── search/         # Player search
│   │   ├── history/        # Match history
│   │   └── shared/         # Reusable components
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript definitions
├── src-tauri/              # Backend (Rust)
│   └── src/
│       ├── auth.rs         # Lockfile authentication
│       ├── fetcher.rs      # API data fetching
│       ├── orchestrator.rs # Main event loop
│       └── websocket.rs    # Presence tracking
└── public/                 # Static assets
```

## Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template
3. Provide detailed reproduction steps
4. Include screenshots if applicable
5. Share console errors/logs

## Requesting Features

1. Check existing issues/discussions
2. Use the feature request template
3. Explain the use case clearly
4. Consider implementation complexity

## Getting Help

- Open an issue for bugs or questions
- Start a discussion for general topics
- Review existing documentation

## Code of Conduct

Be respectful and inclusive. We're here to build something cool together!

---

Thank you for contributing to ValX! 🎮
