import { Routes, Route, Link } from "react-router-dom";

import { Header } from "@/components/Header";
import { ComponentShowcase } from "@/examples/ComponentShowcase";
import { cn } from "@/lib/utils";
import Achievements from "@/pages/Achievements";
import { GroupManagement } from "@/pages/GroupManagement";
import KeyManagement from "@/pages/KeyManagement";
import { AchievementDataProvider } from "@/providers/AchievementDataProvider";

const featureCardClasses = cn(
  "bg-card/80 backdrop-blur-sm rounded-lg p-6",
  "border border-primary/20 hover:border-primary/40",
  "transition-all duration-300 hover:scale-105",
  "hover:shadow-lg hover:shadow-primary/10",
  "animate-pulse-border"
);

const linkClasses = cn(
  "text-primary hover:text-primary/70 transition-colors",
  "focus:outline-none focus:ring-2 focus:ring-primary",
  "focus:ring-offset-2 focus:ring-offset-background",
  "rounded inline-flex items-center group"
);

function HomePage() {
  return (
    <>
      <title>Achievement Tracker</title>
      <meta
        content="Welcome to your achievement tracker! Team up with friends and keep track of your adventures together."
        name="description"
      />
      <meta content="hsl(var(--primary))" name="theme-color" />
      <main className="relative z-10 bg-background text-foreground">
        <div className="container mx-auto py-8">
          <div className="text-center mb-12 animate-float">
            {/* Logo */}
            <div className="logo-container mb-6">
              <img alt="Achievement Analytics Interface" className="w-full h-full" src="logo.jpg" />
            </div>
            <h1 className="text-5xl font-bold text-primary mb-4 font-serif tracking-wider">
              Achievement Tracker
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 animate-shimmer"></div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Welcome to your achievement tracker! Team up with friends and keep track of your
              adventures together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={featureCardClasses}>
              <h2 className="text-2xl font-bold text-primary mb-4">Daily Tasks</h2>
              <p className="text-card-foreground mb-4">
                Check your daily goals and get cool rewards!
              </p>
              <Link aria-label="View daily tasks" className={linkClasses} to="/daily">
                View Daily Tasks
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            <div className={featureCardClasses}>
              <h2 className="text-2xl font-bold text-primary mb-4">Collections</h2>
              <p className="text-card-foreground mb-4">Keep track of your awesome gear and items</p>
              <Link aria-label="View collections" className={linkClasses} to="/collections">
                View Collections
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>

            <div className={featureCardClasses}>
              <h2 className="text-2xl font-bold text-primary mb-4">Group Manager</h2>
              <p className="text-card-foreground mb-4">Create and manage your adventuring groups</p>
              <Link aria-label="Manage groups" className={linkClasses} to="/group-management">
                Manage Groups
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function App() {
  return (
    <AchievementDataProvider>
      <Header />
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<GroupManagement />} path="/group-management" />
        <Route element={<KeyManagement />} path="/key-management" />
        <Route element={<Achievements />} path="/achievements" />
        <Route element={<ComponentShowcase />} path="/showcase" />
      </Routes>
    </AchievementDataProvider>
  );
}

export default App;
