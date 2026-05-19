import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production you'd send this to Sentry / LogRocket etc.
    console.error("[ErrorBoundary] Caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="glass-card border-0 max-w-md w-full animate-scale-in">
            <CardContent className="pt-8 pb-8 text-center space-y-5">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </div>

              {/* Message */}
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-2">
                  Something went wrong
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  An unexpected error occurred. This has been logged and we'll
                  look into it. Try refreshing to get back to chatting.
                </p>
              </div>

              {/* Error detail (dev only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="text-left">
                  <details className="bg-muted/50 rounded-lg p-3 text-xs font-mono text-destructive">
                    <summary className="cursor-pointer text-muted-foreground mb-2 font-sans text-xs">
                      Error details (dev only)
                    </summary>
                    <p className="break-all">{this.state.error.toString()}</p>
                  </details>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <Button onClick={this.handleReset} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh App
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
