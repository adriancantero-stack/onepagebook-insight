import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  autoRetryIn: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimer: NodeJS.Timeout | null = null;
  private countdownTimer: NodeJS.Timeout | null = null;
  private maxRetries = 2;

  public state: State = {
    hasError: false,
    error: null,
    retryCount: 0,
    autoRetryIn: 3
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0, autoRetryIn: 3 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.startAutoRetry();
  }

  public componentWillUnmount() {
    this.clearTimers();
  }

  private clearTimers() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  private startAutoRetry = () => {
    this.clearTimers();
    
    // Start countdown
    this.countdownTimer = setInterval(() => {
      this.setState(prev => {
        if (prev.autoRetryIn <= 1) {
          this.clearTimers();
          return { ...prev };
        }
        return { ...prev, autoRetryIn: prev.autoRetryIn - 1 };
      });
    }, 1000);

    // Auto retry after countdown
    this.retryTimer = setTimeout(() => {
      this.handleRetry();
    }, 3000);
  };

  private handleRetry = () => {
    this.clearTimers();
    
    if (this.state.retryCount < this.maxRetries) {
      // Try to recover by resetting state
      this.setState(prev => ({ 
        hasError: false, 
        error: null,
        retryCount: prev.retryCount + 1,
        autoRetryIn: 3
      }));
    } else {
      // Max retries reached, go home
      window.location.href = '/home';
    }
  };

  private handleManualReload = () => {
    this.clearTimers();
    window.location.href = '/home';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-lilac-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>Algo deu errado</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>
                  Tentando recuperar automaticamente em {this.state.autoRetryIn}s...
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Tentativa {this.state.retryCount + 1} de {this.maxRetries + 1}
              </p>
              {this.state.error && (
                <details className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  <summary className="cursor-pointer">Detalhes técnicos</summary>
                  <pre className="mt-2 overflow-auto max-h-32">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
              <Button onClick={this.handleManualReload} className="w-full" variant="outline">
                Voltar para a página inicial agora
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
