import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Error logged from ErrorBoundary:', error, info);
    this.setState({ errorInfo: info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          {this.state.errorInfo && <details>{this.state.errorInfo.componentStack}</details>}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;