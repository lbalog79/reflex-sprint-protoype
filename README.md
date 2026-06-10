# Reflex Sprint - 30-Day Agentic Adoption Sprint Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)](https://react.dev/)
[![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)

A guided builder for managers and team leads who want to drive AI agent adoption through a personalized 30-day sprint. Reflex Sprint empowers leaders to implement change management practices while integrating AI agents into their team workflows.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [The 6 Change Reflexes](#the-6-change-reflexes)
- [The 3 Micro-Practices](#the-3-micro-practices)
- [API Reference](#api-reference)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🚀 Quick Start

Get Reflex Sprint running locally in 3 steps:

```bash
# 1. Clone the repository
git clone https://github.com/lbalog79/reflex-sprint-protoype.git
cd reflex-sprint-protoype

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to see the application.

## ✨ Features

### Core Capabilities

- **Change Reflex Teaching** - Educates leaders on the 6 change reflexes and 3 micro-practices essential for AI adoption
  
- **5-Step Design Wizard** - Interactive guided builder that walks through:
  1. Team context setup
  2. Multi-select focal reflexes per week
  3. Design-your-own custom practices
  4. Evidence and friction logging
  5. Implementation planning

- **30-Day Calendar Grid** - Visual sprint plan overview with weekly milestones and focus areas

- **Multi-Format Exports**
  - PDF generation for sharing and printing
  - Outlook .ics calendar invites for team integration
  - Shareable plan summaries

- **Evidence & Friction Tracking**
  - Weekly win documentation
  - Friction point identification and logging
  - Decision log for implementation choices

- **Conditional Tracking**
  - Dynamic friction log based on identified challenges
  - Smart evidence capture prompted by AI interactions
  - Scale-Stop-Shift decision framework

- **Auto-Generated Leader Evidence Pack** - Comprehensive summary with:
  - Total wins by category
  - Aggregated friction points
  - Implementation decisions
  - Ready-to-share metrics

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 18.3.1 |
| **Language** | TypeScript | 5.5.3 |
| **Build Tool** | Vite | 5.4.6 |
| **Routing** | React Router | 6.26.0 |
| **Styling** | Tailwind CSS | 3.4.13 |
| **Icons** | Lucide React | 0.441.0 |
| **CSS Processing** | PostCSS | 8.4.45 |
| **Autoprefixer** | Autoprefixer | 10.4.20 |

## 📦 Installation

### Prerequisites

- **Node.js** - v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** - v9.0.0 or higher (included with Node.js)
- **Git** - Latest version ([Download](https://git-scm.com/))

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/lbalog79/reflex-sprint-protoype.git
cd reflex-sprint-protoype

# Install dependencies
npm install

# Create environment file (optional - for custom configuration)
cp .env.example .env.local
```

### Environment Variables

The application uses the following environment variables:

- `VITE_APP_NAME` - Application display name (default: "Reflex Sprint Prototype")

Create a `.env.local` file to override these values locally:

```dotenv
VITE_APP_NAME=Reflex Sprint Prototype
```

## 📂 Project Structure

```
reflex-sprint-protoype/
├── public/                 # Static assets
│   ├── favicon.svg        # App favicon
│   └── og-image.png       # Open Graph image
├── src/
│   ├── components/        # React components
│   │   ├── WizardStep.tsx
│   │   ├── CalendarGrid.tsx
│   │   └── ...            # Other reusable components
│   ├── pages/             # Page-level components
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── helpers.ts
│   ├── App.tsx            # Root app component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── .gitignore             # Git ignore rules
├── .env.production        # Production environment variables
├── index.html             # HTML entry point
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md              # This file
```

## 🎯 Usage

### Starting the Application

```bash
npm run dev
```

The application will start in development mode with hot module replacement (HMR) enabled.

### The User Journey

1. **Welcome Screen** - Learn about the Reflex Sprint approach
2. **Design Wizard**
   - Input team context and adoption goals
   - Select focal reflexes for each week (multi-select)
   - Customize practices with "Design-your-own" option
3. **Sprint Review** - Preview your 30-day plan
4. **Export** - Generate PDF or calendar invite
5. **Track Progress** - Log wins, friction, and decisions throughout the sprint
6. **Evidence Pack** - Access aggregated metrics and results

### Key Actions

- **Create Sprint** - Start a new 30-day adoption plan
- **Edit Plan** - Modify focal reflexes and practices
- **Log Evidence** - Record weekly wins and learnings
- **Track Friction** - Document challenges and obstacles
- **Export Plan** - Share via PDF or calendar
- **Generate Report** - Create evidence pack summary

## 🧠 The 6 Change Reflexes

The 6 Change Reflexes are core competencies for leading AI adoption:

1. **Sense Making** - Understanding the purpose and context of AI in your team
2. **Relationship Building** - Establishing trust and collaboration around AI adoption
3. **Experimentation** - Creating safe spaces to test and learn with AI agents
4. **Perspective Taking** - Understanding diverse viewpoints on AI integration
5. **Adaptive Learning** - Continuously improving practices based on feedback
6. **Systemic Thinking** - Viewing AI adoption as an interconnected system

Each reflex builds team capability for successful, sustainable AI integration.

## 🎓 The 3 Micro-Practices

Three practical micro-practices to reinforce the change reflexes:

1. **Weekly Huddle** - 15-minute team check-ins on AI agent adoption progress
   - Share wins and learnings
   - Surface friction points
   - Adjust practices as needed

2. **Friction Log** - Documented tracking of obstacles and challenges
   - Identify patterns in adoption barriers
   - Prioritize solutions
   - Measure improvement over time

3. **Evidence Capture** - Regular documentation of successful outcomes
   - Track measurable improvements
   - Build internal case studies
   - Share wins with stakeholders

## 🔧 API Reference

### Core Data Models

#### Sprint Plan
```typescript
interface SprintPlan {
  id: string;
  teamName: string;
  startDate: Date;
  endDate: Date;
  reflexes: Reflex[];
  weeklyPlans: WeeklyPlan[];
  exportedFormats: ExportFormat[];
}
```

#### Weekly Plan
```typescript
interface WeeklyPlan {
  weekNumber: number;
  focusReflex: Reflex;
  customPractice?: string;
  evidenceLog: Evidence[];
  frictionLog: FrictionEntry[];
}
```

#### Evidence Entry
```typescript
interface Evidence {
  id: string;
  date: Date;
  category: 'win' | 'learning' | 'decision';
  description: string;
  impact: 'high' | 'medium' | 'low';
}
```

## 🚀 Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking (if tsconfig is strict)
npm run type-check
```

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and test locally
3. Commit with clear messages: `git commit -m "feat: add sprint export"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Style

- **TypeScript** - Strict mode enabled for type safety
- **React** - Functional components with hooks
- **Styling** - Tailwind CSS utility classes
- **Icons** - Lucide React for consistent iconography

## 🏗️ Building for Production

### Create a Production Build

```bash
npm run build
```

This generates an optimized build in the `dist/` directory with:
- Code splitting and bundling
- Minification and compression
- Asset optimization
- Source map generation (optional)

### Environment Configuration

Update `.env.production` with your production values:

```dotenv
VITE_APP_NAME=Reflex Sprint
```

### Deploy

The `dist/` folder is ready to deploy to any static hosting provider:

- **Vercel** - Recommended for Vite projects
- **Netlify** - Excellent build and deploy pipeline
- **GitHub Pages** - Free hosting for static sites
- **AWS S3 + CloudFront** - Enterprise solution
- **Traditional Hosting** - Any web server

**Deployment Example (Vercel):**
```bash
npm install -g vercel
vercel
```

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### Reporting Issues
- Use GitHub Issues to report bugs or suggest features
- Include detailed description and reproduction steps
- Add screenshots or screen recordings if helpful

### Making Changes
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with clear commits
4. Test thoroughly with `npm run dev`
5. Push to your branch
6. Open a Pull Request with description of changes

### Coding Guidelines
- Follow existing code style and patterns
- Write TypeScript with strict null checks
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused and reusable
- Test across different screen sizes (responsive design)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Summary:** You are free to use, modify, and distribute this software, including for commercial purposes, as long as you include the original license and copyright notice.

## 💬 Support

### Getting Help

- **Documentation** - Check this README and code comments first
- **GitHub Issues** - Search existing issues or [create a new one](https://github.com/lbalog79/reflex-sprint-protoype/issues)
- **Discussion Board** - [GitHub Discussions](https://github.com/lbalog79/reflex-sprint-protoype/discussions) for questions and ideas

### Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 3000
```

**Node modules issues?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build fails?**
```bash
npm run build
npm run preview
```

### Contact

For direct inquiries, reach out via:
- GitHub: [@lbalog79](https://github.com/lbalog79)
- Email: Check GitHub profile for contact information

---

**Last Updated:** June 2026
**Version:** 1.0.0
**Status:** Active Development

Made with ❤️ for leaders driving AI adoption
