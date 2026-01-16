"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Zap,
  ShoppingCart,
  MessageSquare,
  PieChart,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 relative pt-12 pb-16">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto z-10 relative">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-100 mt-4">
            Predict Demand. Minimize Waste. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Master the Market.
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-200">
            The first forecasting tool tailored for Indian MSMEs. We integrate
            standard sales data with
            <span className="text-foreground font-medium"> RBI Repo Rates</span>
            ,<span className="text-foreground font-medium"> CPI Inflation</span>
            , and
            <span className="text-foreground font-medium">
              {" "}
              Seasonal Trends
            </span>{" "}
            to give you the most accurate predictions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-300">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Start Forecasting <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-xl bg-card border border-border text-foreground font-semibold text-lg hover:bg-muted/50 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Hero Visual - Dashboard Mockup */}
        <div className="relative mt-20 max-w-6xl mx-auto perspective-1000">
          <div className="relative bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-500 transform rotate-x-12">
            {/* Dashboard Header Mockup */}
            <div className="h-14 border-b border-zinc-800 flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="h-6 w-32 bg-zinc-900 rounded-md"></div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-8 grid grid-cols-12 gap-6 bg-zinc-950/50 backdrop-blur-sm">
              {/* Left Col - Stats */}
              <div className="col-span-12 md:col-span-3 space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-xs text-zinc-500 mb-2">
                    FORECASTED SALES
                  </div>
                  <div className="text-3xl font-bold text-white">
                    1,240{" "}
                    <span className="text-sm font-normal text-zinc-600">
                      units
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="text-xs text-zinc-500 mb-2">
                    REVENUE POTENTIAL
                  </div>
                  <div className="text-3xl font-bold text-emerald-400">
                    ₹45.2L
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-900/10 border border-red-900/20">
                  <div className="text-xs text-red-400 mb-2">RISK ALERT</div>
                  <div className="text-sm font-medium text-red-300">
                    High inventory waste risk detected for next month.
                  </div>
                </div>
              </div>

              {/* Middle Col - Main Chart */}
              <div className="col-span-12 md:col-span-6 p-6 rounded-xl bg-zinc-900/30 border border-zinc-800">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-sm font-medium text-white">
                    Market Trends vs Policy
                  </div>
                  <div className="flex gap-2">
                    <div className="w-20 h-6 bg-zinc-800 rounded"></div>
                    <div className="w-20 h-6 bg-zinc-800 rounded"></div>
                  </div>
                </div>
                <div className="relative h-64 w-full flex items-end justify-between px-4 gap-2">
                  {[30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 95].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="w-full bg-gradient-to-t from-indigo-500/20 to-indigo-500 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      ></div>
                    )
                  )}
                  {/* Overlay Line */}
                  <svg
                    className="absolute inset-0 w-full h-full p-4 pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,150 C50,140 100,100 150,110 S250,80 300,60 S400,90 500,40"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
                <div className="flex justify-between mt-4 text-xs text-zinc-600">
                  <span>Jan</span>
                  <span>Apr</span>
                  <span>Aug</span>
                  <span>Dec</span>
                </div>
              </div>

              {/* Right Col - AI Chat */}
              <div className="col-span-12 md:col-span-3 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 flex flex-col">
                <div className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  AI Consultant
                </div>
                <div className="flex-1 space-y-3 mb-4">
                  <div className="p-2 rounded-lg bg-zinc-800/50 text-xs text-zinc-300">
                    How will higher Repo Rates affecting my auto sales?
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                    Higher Repo Rates (6.5%+) usually reduce auto loans by ~12%.
                    Consider lowering stock.
                  </div>
                </div>
                <div className="h-8 rounded bg-zinc-800/50"></div>
              </div>
            </div>
          </div>

          {/* Abstract Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[50%] bg-indigo-500/20 blur-[120px] -z-10 rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="container mx-auto px-6 py-12 scroll-mt-28"
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
            Core Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Intelligence at Scale
          </h2>
          <p className="text-muted-foreground text-lg">
            We don't just guess. We analyze macro-economic indicators to give
            you a competitive edge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6 text-emerald-500" />}
            title="Interactive Market Analytics"
            description="Visualize complex market data instantly. Track how RBI Repo Rates and CPI Inflation impact your specific category."
            delay={0}
          />
          <FeatureCard
            icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
            title="Risk & Waste Analysis"
            description="Get proactive alerts when your inventory levels risk becoming dead stock due to market shifts."
            delay={100}
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-indigo-500" />}
            title="Policy Impact Engine"
            description="Our proprietary engine correlates national economic policy data with your local sales trends."
            delay={200}
          />
        </div>
      </section>

      {/* Detailed Feature Showcases */}
      <section
        id="policy"
        className="bg-muted/30 py-24 border-y border-border scroll-mt-28"
      >
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Advanced Simulations & Reports
            </h2>
            <p className="text-lg text-muted-foreground">
              Create detailed "What-If" scenarios. Enter your product details,
              price points, and inventory levels to generate a comprehensive
              forecast report.
            </p>

            <div className="space-y-4">
              {[
                "Category-specific seasonality adjustments",
                "Projected Revenue & Potential Waste calculations",
                "Downloadable insights for stakeholders",
                "Historical accuracy tracking",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Card Mockup */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-card rounded-3xl p-8 shadow-2xl border border-border hover:scale-[1.01] transition-transform duration-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Simulation Report
                  </div>
                  <div className="text-xl font-bold">Banarasi Silk Saree</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                  Valid
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">
                    Projected Revenue
                  </div>
                  <div className="text-2xl font-bold text-green-500">₹8.4L</div>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="text-xs text-muted-foreground mb-1">
                    Potential Waste
                  </div>
                  <div className="text-xl font-bold text-zinc-500">₹12k</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <div className="text-sm font-medium text-indigo-300">
                    Detailed forecast available for wedding season (Nov-Feb).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Showcase */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Chat Mockup */}
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl opacity-50"></div>
            <div className="relative bg-zinc-950 rounded-2xl border border-zinc-800 p-6 shadow-2xl max-w-md mx-auto md:mx-0">
              <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div>
                  <div className="font-bold text-white">
                    Strategic Consultant
                  </div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>{" "}
                    Online
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-3 justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm max-w-[80%]">
                    I have 500 units of Electronics stock. Should I worry about
                    the new Repo Rate hike?
                  </div>
                </div>
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs">
                    AI
                  </div>
                  <div className="bg-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[90%] shadow-lg">
                    <p className="mb-2">Yes, you should be cautious.</p>
                    <p>
                      A Repo Rate hike above 6.5% historically reduces consumer
                      spending on electronics by <strong>15-20%</strong> due to
                      higher EMI costs.
                    </p>
                    <p className="mt-2 text-indigo-300 text-xs">
                      Recommendation: Reduce stock by 100 units or run a
                      clearance sale.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask follow up..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  disabled
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 order-1 md:order-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Talk to your Data
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't just stare at charts. Ask questions. Our AI Strategic
              Consultant understands the nuances of Indian commerce.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-yellow-500 mt-1" />
                <div>
                  <strong className="block text-foreground">
                    Instant Strategy checks
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    Validate your gut feelings with data-backed answers.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ShoppingCart className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <strong className="block text-foreground">
                    Inventory Optimization
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    Know exactly when to restock and when to liquidate.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="bg-muted/30 py-24 border-t border-border scroll-mt-28"
      >
        <div className="container mx-auto px-6 text-center max-w-2xl mb-16">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground">
            Three simple steps to smarter decisions.
          </p>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          <div className="relative flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Input Data</h3>
            <p className="text-muted-foreground">
              Enter your product category, region, and current inventory levels.
            </p>
            <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10 translate-x-1/2"></div>
          </div>

          <div className="relative flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">AI Processing</h3>
            <p className="text-muted-foreground">
              Our model correlates your inputs with real-time RBI data and
              Inflation trends.
            </p>
            <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10 translate-x-1/2"></div>
          </div>

          <div className="relative flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl font-bold mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Strategic Insights</h3>
            <p className="text-muted-foreground">
              Receive a detailed forecast report with "High Risk" alerts and
              actionable advice.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 mb-12">
        <div className="rounded-3xl bg-primary text-primary-foreground p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Stop Guessing. Start Predicting.
            </h2>
            <p className="text-primary-foreground/80 text-xl">
              Join the new wave of data-driven Indian businesses. Reduce waste
              and maximize profits today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-background text-foreground rounded-xl font-bold text-lg hover:bg-background/90 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              A
            </div>
            <span className="font-bold text-xl">Aganya AI</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 Aganya AI Inc. Designed for Indian Startups & MSMEs.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
