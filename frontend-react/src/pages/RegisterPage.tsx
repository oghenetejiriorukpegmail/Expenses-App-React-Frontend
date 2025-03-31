import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
     if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }
    setError(null);
    try {
      await register(username, password);
      navigate('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  // Reusable input component styling with dark mode variants
  const inputClasses = "shadow-sm appearance-none border border-border-default dark:border-dark-border-default rounded-lg w-full py-sm px-md text-text-default dark:text-dark-text-default leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/80 dark:bg-dark-card-bg/80 disabled:opacity-50";
  const labelClasses = "block text-text-muted dark:text-dark-text-muted text-sm font-bold mb-xs";
  const primaryButtonClasses = `w-full bg-gradient-primary hover:opacity-90 text-white font-bold py-sm px-md rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center transition-opacity duration-300 shadow-md hover:shadow-lg`;


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      {/* Apply glass morphism with dark mode variants */}
      <div className="bg-glass dark:bg-dark-glass backdrop-blur border border-glass-border dark:border-dark-glass-border rounded-xl shadow-glass dark:shadow-glass-dark p-xl max-w-md w-full relative overflow-hidden">
         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-80 rounded-t-xl"></div>

        {/* Added dark mode text color */}
        <h2 className="text-3xl font-bold mb-lg text-center text-primary dark:text-primary-light">Create Account</h2>
        {/* Added dark mode variants */}
        <div className="mb-md p-sm bg-primary-bg dark:bg-blue-900/30 border border-primary/20 dark:border-blue-700/50 rounded-lg text-primary-dark dark:text-blue-300 text-sm">
          <i className="fas fa-user-plus mr-xs"></i> Register to start tracking your expenses.
        </div>
        <form onSubmit={handleSubmit}>
          {/* Added dark mode variants */}
          {error && (
            <div className="mb-md p-sm bg-danger-bg dark:bg-red-900/30 border border-danger dark:border-red-700/50 text-danger dark:text-danger-light rounded-lg text-sm">
              <i className="fas fa-exclamation-triangle mr-xs"></i>{error}
            </div>
          )}
          <div className="mb-md">
            <label htmlFor="register-username" className={labelClasses}>Username:</label>
            <input
              type="text" id="register-username" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3}
              placeholder="Choose a username (min 3 characters)"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>
          <div className="mb-md">
            <label htmlFor="register-password" className={labelClasses}>Password:</label>
            <input
              type="password" id="register-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              placeholder="Choose a password (min 6 characters)"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>
           <div className="mb-lg">
            <label htmlFor="confirm-password" className={labelClasses}>Confirm Password:</label>
            <input
              type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
              placeholder="Re-enter your password"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`${primaryButtonClasses} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                 <>
                  <svg className="animate-spin -ml-1 mr-sm h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-sm"></i> Register
                </>
              )}
            </button>
          </div>
          {/* Added dark mode link color */}
          <p className="text-center mt-md text-sm">
            Already have an account? <Link to="/login" className={`font-medium text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;