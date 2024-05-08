import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import { ErrorBoundary } from './components/error-boundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</React.StrictMode>
);
