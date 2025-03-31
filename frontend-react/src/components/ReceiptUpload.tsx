import React, { useState, useCallback } from 'react';
import { processReceiptOCR } from '../services/api';

interface ReceiptUploadProps {
  onReceiptProcessed: (extractedData: any) => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ onReceiptProcessed }) => {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setReceiptFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setReceiptFile(file);
        setError(null);
      } else {
        setError('Invalid file type. Please upload an image or PDF.');
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!receiptFile) {
      setError('Please select a receipt file to upload.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const extractedData = await processReceiptOCR(receiptFile, 'builtin');
      if (!extractedData || typeof extractedData !== 'object') {
         throw new Error('Invalid data received from OCR processing.');
      }
      const dataToPass = {
        tripName: 'Default Trip', // Placeholder
        ...extractedData,
        cost: String(extractedData.cost || ''),
      };
      onReceiptProcessed(dataToPass);
    } catch (err: any) {
      let errorMessage = 'Failed to process receipt. Please try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced dropzone styling with dark mode variants
  const dropzoneClass = `border-2 border-dashed rounded-xl p-lg text-center cursor-pointer transition-all duration-300 ease-in-out ${
    dragOver
      ? 'border-primary dark:border-primary-light bg-primary-bg dark:bg-primary/20 scale-105 shadow-lg' // Enhanced drag over state
      : 'border-border-default dark:border-dark-border-default hover:border-primary dark:hover:border-primary-light hover:bg-light-bg dark:hover:bg-dark-light-bg'
  }`;

  // Primary button specific styles (gradient)
  const primaryButtonClasses = `font-bold py-sm px-lg rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center bg-gradient-primary text-white hover:opacity-90 active:scale-95`;


  return (
    <div>
      {/* Added dark mode text color */}
      <h2 className="text-2xl font-semibold mb-lg text-center text-primary dark:text-primary-light">
        <i className="fas fa-receipt mr-sm"></i>Upload Receipt for OCR
      </h2>
      {/* Added dark mode variants */}
      <div className="mb-md p-sm bg-secondary-bg dark:bg-blue-900/30 border border-secondary/20 dark:border-blue-700/50 rounded-lg text-secondary-dark dark:text-blue-300 text-sm text-center">
         <i className="fas fa-info-circle mr-xs"></i> Upload an image or PDF. We'll try to extract the details!
      </div>
      <form onSubmit={handleSubmit}>
        <div
          className={dropzoneClass}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file" id="receipt" accept="image/*,application/pdf"
            onChange={handleFileChange} className="hidden" required={!receiptFile}
          />
          <label htmlFor="receipt" className="cursor-pointer flex flex-col items-center">
            {/* Added dark mode icon color */}
            <i className={`fas fa-cloud-upload-alt text-4xl mb-sm transition-colors duration-300 ${dragOver ? 'text-primary dark:text-primary-light' : 'text-secondary dark:text-secondary-light'}`}></i>
            {/* Added dark mode text colors */}
            <p className={`text-sm transition-colors duration-300 ${dragOver ? 'text-primary-dark dark:text-primary font-semibold' : 'text-text-muted dark:text-dark-text-muted'}`}>
              {dragOver ? 'Drop the file here!' : 'Drag & drop receipt, or click to select'}
            </p>
          </label>
        </div>

        {/* Added dark mode text colors */}
        {receiptFile && (
          <div className="mt-md text-sm text-text-muted dark:text-dark-text-muted text-center">
            Selected: <span className="font-medium text-text-default dark:text-dark-text-default">{receiptFile.name}</span>
          </div>
        )}

        {/* Added dark mode variants */}
        {error && (
          <div className="mt-md p-sm bg-danger-bg dark:bg-red-900/30 border border-danger dark:border-red-700/50 text-danger dark:text-danger-light rounded-lg text-sm text-center">
            <i className="fas fa-exclamation-triangle mr-xs"></i>{error}
          </div>
        )}

        <div className="mt-lg">
          <button
            type="submit"
            className={`${primaryButtonClasses} w-full ${isLoading || !receiptFile ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading || !receiptFile}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-sm h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-sm"></i> Process Receipt
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceiptUpload;