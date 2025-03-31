import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ReceiptUpload from '../components/ReceiptUpload';
import ExpenseChart from '../components/ExpenseChart';
import ReceiptViewerModal from '../components/ReceiptViewerModal';
import { ExpenseData } from '../components/ExpenseForm';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/api';

type ExpenseStep = 'upload' | 'form';

// Helper component with dark mode variants
const SectionWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  // Added dark mode classes
  <section className={`bg-glass dark:bg-dark-glass backdrop-blur border border-glass-border dark:border-dark-glass-border rounded-xl shadow-glass dark:shadow-glass-dark p-xl mb-xl relative overflow-hidden transition-all duration-500 ease-in-out hover:shadow-md hover:shadow-primary/30 ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-80 rounded-t-xl"></div>
    {children}
  </section>
);


const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);
  const [currentStep, setCurrentStep] = useState<ExpenseStep>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadExpenses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedExpenses = await getExpenses();
        setExpenses(fetchedExpenses);
      } catch (err: any) {
        setError('Failed to load expenses.');
      } finally {
        setIsLoading(false);
      }
    };
    loadExpenses();
  }, []);

  const handleExpenseSubmit = async (data: ExpenseData) => {
    setIsLoading(true);
    setError(null);
    const receiptFile = null; // Placeholder

    try {
      if (editingExpense && data.id) {
        const updated = await updateExpense(data.id, data, receiptFile);
        setExpenses(expenses.map(exp => exp.id === updated.id ? updated : exp));
      } else {
        const { id, ...addData } = data;
        const added = await addExpense(addData, receiptFile);
        setExpenses([...expenses, added]);
      }
      setEditingExpense(null);
      setCurrentStep('upload');
    } catch (err: any) {
      setError(`Failed to save expense: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExpense = (expense: ExpenseData) => {
    setEditingExpense(expense);
    setCurrentStep('form');
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (err: any) {
      setError(`Failed to delete expense: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewReceipt = (receiptUrl: string) => {
    const backendBaseUrl = 'http://localhost:3000';
    const correctedUrl = receiptUrl.startsWith('/') ? receiptUrl : `/${receiptUrl}`;
    const fullUrl = `${backendBaseUrl}${correctedUrl}`;
    setViewerImageUrl(fullUrl);
    setIsViewerOpen(true);
  };

  const handleReceiptProcessed = (extractedData: any) => {
    setEditingExpense({ ...extractedData, id: undefined });
    setCurrentStep('form');
  };

  const handleCancelForm = () => {
    setEditingExpense(null);
    setCurrentStep('upload');
  }

  const closeViewer = () => {
    setIsViewerOpen(false);
    setViewerImageUrl(null);
  };

  return (
    <div>
      {/* Added dark mode text color */}
      <h1 className="text-3xl font-bold text-center my-lg text-primary dark:text-primary-light">Manage Expenses</h1>

      {/* Added dark mode text color */}
      {isLoading && <div className="text-center p-md text-text-muted dark:text-dark-text-muted">Loading...</div>}
      {/* Error styling already uses theme colors */}
      {error && <div className="bg-danger-bg border border-danger text-danger px-md py-sm rounded relative mb-md" role="alert">{error}</div>}

      {/* Upload/Form Section */}
      <SectionWrapper>
        {currentStep === 'upload' && (
          <ReceiptUpload onReceiptProcessed={handleReceiptProcessed} />
        )}
        {currentStep === 'form' && (
          <ExpenseForm
            key={editingExpense ? editingExpense.id || 'new-from-receipt' : 'new'}
            onSubmit={handleExpenseSubmit}
            initialData={editingExpense}
            onCancel={handleCancelForm}
          />
        )}
      </SectionWrapper>

      {/* Chart Section */}
      {expenses.length > 0 && (
        <SectionWrapper>
           {/* Added dark mode text color */}
           <h2 className="text-2xl font-semibold mb-lg text-center text-primary dark:text-primary-light">
             <i className="fas fa-chart-bar mr-sm"></i>Expense Summary
           </h2>
           {/* TODO: Update ExpenseChart component itself for dark mode theme */}
          <ExpenseChart expenses={expenses} />
        </SectionWrapper>
      )}

      {/* Expense List Section */}
      <SectionWrapper>
         {/* Added dark mode text color */}
         <h2 className="text-2xl font-semibold mb-lg text-center text-primary dark:text-primary-light">
           <i className="fas fa-list mr-sm"></i>Expense History
         </h2>
         {/* TODO: Update ExpenseList component itself for dark mode theme */}
        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
          onViewReceipt={handleViewReceipt}
        />
      </SectionWrapper>

      {/* Receipt Viewer Modal */}
      <ReceiptViewerModal
        isOpen={isViewerOpen}
        onClose={closeViewer}
        imageUrl={viewerImageUrl}
      />
    </div>
  );
};

export default ExpensesPage;