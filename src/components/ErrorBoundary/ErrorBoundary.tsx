import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactElement | React.ReactElement[];
  onError?: (error: Error) => void;
  fallback?: React.FunctionComponent<{ error: Error }> | React.ComponentClass<{ error: Error }> | null;
}
interface ErrorBoundaryState {
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error?: Error): ErrorBoundaryState {
    return { error: error };
  }

  componentDidCatch(error: Error): void {
    console.log('ErrorBoundary encountered fatal error in render tree', error);
    this.props.onError?.(error);
    if (this.state.error && !this.props.fallback) {
      setTimeout(() => this.setState({ error: undefined }));
    }
  }

  render(): React.ReactNode {
    if (this.state.error) {
      if (!this.props.fallback) {
        return null;
      }

      if (React.isValidElement(this.props.fallback)) {
        return this.props.fallback;
      }

      return React.createElement(this.props.fallback, {
        error: this.state.error,
      });
    }

    return this.props.children;
  }
}
