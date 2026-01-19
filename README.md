# Aganya AI - Market Demand Forecasting Platform

Aganya AI is a comprehensive platform built to help businesses forecast market demand, analyze trends, and simulate various economic scenarios. By leveraging AI models, user-specific data, and macro-economic indicators, it provides actionable insights for strategic decision-making.

**Live Platform:** https://aganya-ai.vercel.app

## Key Features

- **Dashboard**: A centralized command center displaying real-time sales trends, regional performance (Map view), and key economic metrics.
- **Simulations**: Create and run detailed market simulations to predict outcomes based on adjusted variables (price, marketing spend, seasonality).
- **AI Analyst**: An interactive chatbot (Bhrigu) that explains data, answers queries about specific metrics, and provides strategic recommendations and also provide the option to modify the unit and quantity throught chat.
- **Reports**: Detailed breakdown of simulation results with the ability to export findings as PDF.
- **News Integration**: Live market news feed to stay updated with relevant industry developments.

## Project Structure

```bash
frontend/
├── app/
│   ├── dashboard/       # Main analytics dashboard & map visualizations
│   ├── simulations/     # Simulation creation, lists, and detailed reports
│   ├── login/           # User authentication (Login)
│   ├── signup/          # User registration
│   ├── api/             # API fetching points
│   ├── globals.css      # Core styles and Tailwind directives
│   └── page.tsx         # Landing page
├── components/
│   ├── Navbar.tsx       # Main application navigation
│   ├── ChatPanel.tsx    # AI Chatbot interface for analysis
│   ├── NewsWidget.tsx   # Sidebar widget for market news
│   ├── ExportButton.tsx # PDF export functionality
│   └── ...              # Other UI building blocks
├── lib/                 # Utility functions and shared logic
└── public/              # Static assets (images, fonts, icons)
```

## Getting Started

To run the project locally:

1. **Install dependencies:**

   ```bash
   npm install
   or
   bun install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   or
   bun dev
   ```

Open http://localhost:3000 in your browser to view the application.
