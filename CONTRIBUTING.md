# Contributing to Guard Pro

Thank you for your interest in contributing to Guard Pro! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Bun** installed (v1.0+)
2. **Node.js** (v18+)
3. **Git** configured
4. **PostgreSQL** database access (via Supabase)
5. **Flutter** (if working on mobile app)

### Setup

1. **Fork the repository**

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/guard_pro.git
   cd guard_pro
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/guard_pro.git
   ```

4. **Install dependencies**
   ```bash
   bun install
   ```

5. **Set up environment variables**
   - Copy `.env.example` to `.env` (if available)
   - Fill in required environment variables

6. **Set up database**
   ```bash
   bun run db:push
   ```

7. **Start development server**
   ```bash
   bun run dev
   ```

## 🔄 Development Workflow

### Branch Naming

Use descriptive branch names following these patterns:

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/component-name` - Code refactoring
- `docs/documentation-update` - Documentation changes
- `test/test-description` - Test additions/updates

Examples:
- `feature/shift-validation`
- `fix/site-picture-deletion`
- `refactor/auth-components`
- `docs/api-documentation`

### Creating a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create and switch to new branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. **Make your changes** following the coding standards
2. **Test your changes** locally
3. **Run linter and formatter**
   ```bash
   bun run lint
   bun run format
   ```
4. **Ensure TypeScript compiles**
   ```bash
   bunx tsc
   ```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Use explicit types when not obvious
- Avoid `any` type (use `unknown` if necessary)
- Use interfaces for object shapes
- Use type aliases for unions/intersections

### React Components

- Use functional components with hooks
- Use PascalCase for component names
- Extract reusable logic into custom hooks
- Keep components focused and small
- Use TypeScript for props

**Example:**
```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  )
}
```

### File Naming

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Database Schema

- Use Drizzle ORM for all database operations
- Follow existing naming conventions:
  - Tables: singular, snake_case (e.g., `shift_assignment`)
  - Columns: snake_case (e.g., `employee_id`)
  - Enums: descriptive names (e.g., `employeeStatusEnum`)

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use shadcn/ui components when available
- Maintain consistent spacing and colors

### Code Organization

```
src/
├── components/        # React components
│   ├── ui/          # Reusable UI components
│   └── feature/     # Feature-specific components
├── hooks/           # Custom hooks
├── lib/             # Utilities and configurations
├── routes/          # Route components
├── services/        # API services
└── db/              # Database schema
```

## 💾 Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat(auth): add forgot password functionality

Implement forgot password flow with Resend email integration.
Add password reset token generation and validation.

Closes #123

---

fix(storage): delete site pictures from Supabase bucket

Fix issue where site pictures were not being deleted when
sites are removed. Add cleanup function to site deletion handler.

Fixes #456

---

refactor(shifts): improve shift validation logic

Extract validation logic into separate function.
Add company-site relationship validation.

---

docs(readme): update installation instructions

Add Flutter setup steps and environment variable examples.
```

### Commit Best Practices

- Write clear, descriptive commit messages
- Keep commits focused (one logical change per commit)
- Reference issue numbers when applicable
- Test before committing

## 🔍 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run checks**
   ```bash
   bun run lint
   bun run format
   bunx tsc
   bun run test
   ```

3. **Test manually**
   - Test the feature/fix thoroughly
   - Check for edge cases
   - Verify on different screen sizes (if UI change)

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] No console.logs or debug code
- [ ] Tests pass locally
- [ ] Linter passes
- [ ] TypeScript compiles without errors
- [ ] Changes tested in development environment

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Thank you for contributing! 🎉

## 🐛 Reporting Issues

### Bug Reports

Use the issue template and include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**:
  - OS and version
  - Browser/device (if applicable)
  - Node.js/Bun version
- **Additional Context**: Any other relevant information

### Security Issues

**Do NOT** create a public issue for security vulnerabilities. Instead, contact the maintainers privately.

## 💡 Feature Requests

When requesting a feature:

1. Check if it's already in the TODO list
2. Check existing issues to avoid duplicates
3. Provide:
   - Clear description of the feature
   - Use case and motivation
   - Potential implementation approach (if you have ideas)
   - Any relevant examples

## 📚 Additional Resources

- [TanStack Router Docs](https://tanstack.com/router)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## ❓ Questions?

If you have questions:

1. Check existing documentation
2. Search existing issues
3. Create a new issue with the `question` label
4. Reach out to maintainers

---

Thank you for contributing to Guard Pro! Your efforts help make this project better for everyone. 🙏

