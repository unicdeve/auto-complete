import { Component, ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryProps = {
	children: ReactNode;
	fallback?: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error('Error caught by ErrorBoundary:', error, errorInfo);
	}

	render() {
		const { hasError } = this.state;
		const { fallback, children } = this.props;

		if (hasError) {
			return fallback || <div>Something went wrong.</div>;
		}

		return children;
	}
}
