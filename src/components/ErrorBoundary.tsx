import { Component, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { type AppError } from "@/types/errors";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
  errorInfo?: React.ErrorInfo;
}

const errorContainerClasses = cn(
  "min-h-screen",
  "bg-gradient-to-b from-slate-900 to-slate-800",
  "flex items-center justify-center p-4"
);

const errorCardClasses = cn(
  "bg-slate-800/90 backdrop-blur-sm rounded-lg p-8",
  "border-2 border-yellow-500/30",
  "max-w-md text-center",
  "shadow-lg shadow-yellow-500/10"
);

const primaryButtonClasses = cn(
  "w-full",
  "bg-gradient-to-r from-yellow-500 to-yellow-600",
  "text-slate-900 px-4 py-2 rounded-md font-medium",
  "hover:from-yellow-400 hover:to-yellow-500",
  "shadow-lg shadow-yellow-500/30",
  "border border-yellow-500/50",
  "transform hover:scale-105 transition-all"
);

const secondaryButtonClasses = cn(
  "w-full",
  "bg-transparent",
  "border-2 border-yellow-500/30",
  "text-yellow-400 px-4 py-2 rounded-md",
  "hover:bg-yellow-500/10 hover:border-yellow-500/50",
  "transform hover:scale-105 transition-all"
);

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Convert to AppError type for consistent error handling
    const appError: AppError = error;

    this.setState({ error: appError, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private getErrorMessage(): string {
    if (!this.state.error) {
      return "We're sorry, but something went wrong. Please try refreshing the page.";
    }

    // For non-Error objects or errors without a message, use the fallback
    if (!this.state.error.message) {
      return "We're sorry, but something went wrong. Please try refreshing the page.";
    }

    return this.state.error.message;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={errorContainerClasses}>
          <div className={errorCardClasses}>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <h2 className="mb-2 text-xl font-bold">Oops! Something went wrong</h2>
              <p className="mb-4 text-muted-foreground">{this.getErrorMessage()}</p>

              <div className="space-y-3 mt-6">
                <button className={primaryButtonClasses} onClick={this.handleReset}>
                  Try Again
                </button>
                <button className={secondaryButtonClasses} onClick={() => window.location.reload()}>
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
