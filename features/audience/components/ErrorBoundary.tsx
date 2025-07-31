import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Screen } from "@/components/shared/Screen/Screen";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class AudienceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Audience page error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Screen heading={this.props.fallbackTitle || "Error"}>
          <div className="flex flex-col justify-center items-center py-16">
            <div className="bg-red-100 mb-4 p-4 rounded-full w-16 h-16">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
              Something went wrong
            </h3>
            <p className="mb-6 max-w-md text-gray-600 text-center">
              We encountered an error while loading this audience. Please try
              refreshing the page.
            </p>
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-red-50 mt-6 p-4 border border-red-200 rounded-lg max-w-2xl">
                <h4 className="font-medium text-red-900 text-sm">
                  Error Details (Development Only)
                </h4>
                <pre className="mt-2 overflow-auto text-red-800 text-xs">
                  {this.state.error.message}
                </pre>
              </div>
            )}
          </div>
        </Screen>
      );
    }

    return this.props.children;
  }
}
