import './LoginPage.css';
import { initiateOAuth } from '../utils/api';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const handleLogin = async () => {
    try {
      // Redirect to real Google OAuth
      await initiateOAuth();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to initiate login. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern"></div>
      
      <div className="login-container animate-fadeIn">
        <div className="login-card">
          <div className="logo-section">
            <div className="logo-circle">
              <svg viewBox="0 0 100 100" className="logo-icon">
                <circle cx="50" cy="50" r="35" fill="var(--primary)" opacity="0.2"/>
                <path
                  d="M 30 50 Q 50 30, 70 50 Q 50 70, 30 50"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="50" r="8" fill="var(--light)"/>
              </svg>
            </div>
            <h1 className="brand-name">Bill AI</h1>
            <p className="brand-tagline">Powered by Google Gemini</p>
          </div>

          <div className="login-content">
            <h2>Welcome to Bill AI</h2>
            <p className="login-description">
              Experience the power of Google's Gemini AI with secure authentication and real-time responses
            </p>

            <button className="login-button" onClick={handleLogin}>
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            <div className="features-preview">
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Powered by Gemini 2.0</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Vision & Image Analysis</span>
              </div>
              <div className="feature-item">
                <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>Real-time Streaming</span>
              </div>
            </div>
          </div>

          <div className="login-footer">
            <p>🔒 Secure OAuth 2.0 authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
}
