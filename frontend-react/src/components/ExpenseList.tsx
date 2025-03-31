import React from 'react';
import { ExpenseData } from './ExpenseForm';

interface ExpenseListProps {
  expenses: ExpenseData[];
  onEdit: (expense: ExpenseData) => void;
  onDelete: (id: string) => void;
  onViewReceipt: (receiptUrl: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete, onViewReceipt }) => {
  if (expenses.length === 0) {
    return (
      // Added dark mode variants
      <div className="text-center p-xl border border-border-default dark:border-dark-border-default rounded-lg mt-lg bg-light-bg dark:bg-dark-light-bg">
        <i className="fas fa-receipt text-4xl text-text-light dark:text-dark-text-light mb-md"></i>
        <p className="text-text-muted dark:text-dark-text-muted">No expenses recorded yet.</p>
      </div>
    );
  }

  // Define styles with dark mode variants
  const thClasses = "px-md py-sm text-left text-xs font-medium text-text-muted dark:text-dark-text-muted uppercase tracking-wider";
  const tdClasses = "px-md py-md whitespace-nowrap text-sm";
  const actionButtonBase = "font-medium py-xs px-sm rounded-md transition-colors duration-200 inline-flex items-center text-xs";
  // Added dark mode variants for buttons
  const viewButtonClasses = `${actionButtonBase} text-secondary dark:text-secondary-light hover:text-secondary-dark dark:hover:text-secondary hover:bg-secondary-bg dark:hover:bg-secondary/20`;
  const editButtonClasses = `${actionButtonBase} text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary hover:bg-primary-bg dark:hover:bg-primary/20 mr-sm`;
  const deleteButtonClasses = `${actionButtonBase} text-danger dark:text-danger-light hover:text-danger-dark dark:hover:text-danger hover:bg-danger-bg dark:hover:bg-danger/20`;

  return (
    // Added dark mode variants for container
    <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-dark-card-bg">
      <table className="min-w-full divide-y divide-border-default dark:divide-dark-border-default">
        {/* Added dark mode variants for header */}
        <thead className="bg-light-bg dark:bg-dark-light-bg">
          <tr>
            <th scope="col" className={thClasses}>Type</th>
            <th scope="col" className={thClasses}>Date</th>
            <th scope="col" className={thClasses}>Vendor</th>
            <th scope="col" className={thClasses}>Location</th>
            <th scope="col" className={`${thClasses} text-right`}>Cost</th>
            <th scope="col" className={`${thClasses} text-center`}>Receipt</th>
            <th scope="col" className={`${thClasses} text-center`}>Actions</th>
          </tr>
        </thead>
        {/* Added dark mode variants for body */}
        <tbody className="bg-white dark:bg-dark-card-bg divide-y divide-border-default dark:divide-dark-border-default">
          {expenses.map((expense) => (
            // Added dark mode variants for row hover and text
            <tr key={expense.id} className="hover:bg-light-bg dark:hover:bg-dark-light-bg transition-colors duration-150">
              <td className={`${tdClasses} text-text-default dark:text-dark-text-default font-medium`}>{expense.type}</td>
              <td className={`${tdClasses} text-text-muted dark:text-dark-text-muted`}>{expense.date}</td>
              <td className={`${tdClasses} text-text-muted dark:text-dark-text-muted`}>{expense.vendor || '-'}</td>
              <td className={`${tdClasses} text-text-muted dark:text-dark-text-muted`}>{expense.location || '-'}</td>
              <td className={`${tdClasses} text-text-default dark:text-dark-text-default font-medium text-right`}>
                ${Number(expense.cost || 0).toFixed(2)}
              </td>
              <td className={`${tdClasses} text-center`}>
                {expense.receiptUrl ? (
                  <button onClick={() => onViewReceipt(expense.receiptUrl!)} className={viewButtonClasses}>
                    <i className="fas fa-eye mr-xs"></i> View
                  </button>
                ) : (
                  // Added dark mode variant
                  <span className="text-text-light dark:text-dark-text-light"><i className="fas fa-eye-slash"></i></span>
                )}
              </td>
              <td className={`${tdClasses} text-center`}>
                <button onClick={() => onEdit(expense)} className={editButtonClasses}>
                  <i className="fas fa-edit mr-xs"></i> Edit
                </button>
                <button onClick={() => onDelete(expense.id!)} className={deleteButtonClasses}>
                  <i className="fas fa-trash mr-xs"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;