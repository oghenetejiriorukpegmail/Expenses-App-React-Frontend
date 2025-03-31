import React, { useState } from 'react';
import { updateEnvSettings, ApiSettings } from '../services/api';

const SettingsPage: React.FC = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const settingsToUpdate: ApiSettings = {};
    if (geminiKey.trim()) settingsToUpdate.GEMINI_API_KEY = geminiKey.trim();
    if (openaiKey.trim()) settingsToUpdate.OPENAI_API_KEY = openaiKey.trim();
    if (claudeKey.trim()) settingsToUpdate.CLAUDE_API_KEY = claudeKey.trim();
    if (openrouterKey.trim()) settingsToUpdate.OPENROUTER_API_KEY = openrouterKey.trim();

    if (Object.keys(settingsToUpdate).length === 0) {
      setError('Please enter at least one API key to update.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await updateEnvSettings(settingsToUpdate);
      setSuccessMessage(response.message || 'API keys updated successfully!');
      setGeminiKey(''); setOpenaiKey(''); setClaudeKey(''); setOpenrouterKey('');
    } catch (err: any) {
      setError(`Failed to update keys: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable input component styling with dark mode variants
  const inputClasses = "shadow-sm appearance-none border border-border-default dark:border-dark-border-default rounded-lg w-full py-sm px-md text-text-default dark:text-dark-text-default leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/80 dark:bg-dark-card-bg/80 disabled:opacity-50";
  const labelClasses = "block text-text-muted dark:text-dark-text-muted text-sm font-bold mb-xs";

  return (
    // Apply glass morphism with dark mode variants
    <div className="bg-glass dark:bg-dark-glass backdrop-blur border border-glass-border dark:border-dark-glass-border rounded-xl shadow-glass dark:shadow-glass-dark p-xl max-w-2xl mx-auto relative overflow-hidden">
       <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-80 rounded-t-xl"></div>

      {/* Added dark mode text color */}
      <h2 className="text-2xl font-semibold mb-lg text-center text-primary dark:text-primary-light">API Key Settings</h2>

      {/* Added dark mode variants */}
      <div className="mb-lg p-md bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-lg text-yellow-800 dark:text-yellow-300 text-sm">
        <i className="fas fa-exclamation-triangle mr-sm"></i>
        <strong>Security Warning:</strong> These keys are stored server-side. Ensure server security. Changes might need a server restart. Leave fields blank to keep existing keys.
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error/Success messages with dark mode variants */}
        {error && (
          <div className="mb-md p-sm bg-danger-bg dark:bg-red-900/30 border border-danger dark:border-red-700/50 text-danger dark:text-danger-light rounded-lg text-sm">
            <i className="fas fa-exclamation-triangle mr-xs"></i>{error}
          </div>
        )}
        {successMessage && (
          <div className="mb-md p-sm bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 rounded-lg text-green-700 dark:text-green-300 text-sm">
            <i className="fas fa-check-circle mr-xs"></i>{successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 gap-md">
          {/* Gemini Key */}
          <div>
            <label htmlFor="gemini-key" className={labelClasses}>Gemini API Key:</label>
            <input
              type="password" id="gemini-key" value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter new Gemini key (optional)"
              autoComplete="new-password"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>

          {/* OpenAI Key */}
          <div>
            <label htmlFor="openai-key" className={labelClasses}>OpenAI API Key:</label>
            <input
              type="password" id="openai-key" value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="Enter new OpenAI key (optional)"
              autoComplete="new-password"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>

          {/* Claude Key */}
           <div>
            <label htmlFor="claude-key" className={labelClasses}>Claude API Key:</label>
            <input
              type="password" id="claude-key" value={claudeKey} onChange={(e) => setClaudeKey(e.target.value)}
              placeholder="Enter new Claude key (optional)"
              autoComplete="new-password"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>

           {/* OpenRouter Key */}
           <div>
            <label htmlFor="openrouter-key" className={labelClasses}>OpenRouter API Key:</label>
            <input
              type="password" id="openrouter-key" value={openrouterKey} onChange={(e) => setOpenrouterKey(e.target.value)}
              placeholder="Enter new OpenRouter key (optional)"
              autoComplete="new-password"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="mt-lg">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-bold py-sm px-md rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
          >
            {isLoading ? 'Saving...' : <><i className="fas fa-save mr-sm"></i> Save API Keys</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;