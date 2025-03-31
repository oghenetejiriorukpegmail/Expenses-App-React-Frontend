import React, { useState, useEffect } from 'react';

// Define an interface for the expense data
export interface ExpenseData {
  id?: string;
  type: string;
  date: string;
  vendor: string;
  location: string;
  tripName: string;
  cost: number | string;
  comments: string;
  receiptUrl?: string;
}

// Define props for the component
interface ExpenseFormProps {
  initialData?: ExpenseData | null;
  onSubmit: (data: ExpenseData) => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [type, setType] = useState(initialData?.type || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [vendor, setVendor] = useState(initialData?.vendor || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [tripName, setTripName] = useState(initialData?.tripName || '');
  const [cost, setCost] = useState<string | number>(initialData?.cost || '');
  const [comments, setComments] = useState(initialData?.comments || '');
  const [expenseId, setExpenseId] = useState(initialData?.id || undefined);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setDate(initialData.date);
      setVendor(initialData.vendor);
      setLocation(initialData.location);
      setTripName(initialData.tripName);
      setCost(initialData.cost);
      setComments(initialData.comments);
      setExpenseId(initialData.id);
    } else {
      setType('');
      setDate(new Date().toISOString().split('T')[0]);
      setVendor('');
      setLocation('');
      setCost('');
      setComments('');
      setExpenseId(undefined);
    }
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const expenseData: ExpenseData = {
      id: expenseId,
      type, date, vendor, location, tripName,
      cost: parseFloat(cost as string) || 0,
      comments,
    };
    onSubmit(expenseData);
  };

  // Define base styles with dark mode variants
  const labelClasses = "block text-text-muted dark:text-dark-text-muted text-sm font-bold mb-xs";
  const inputClasses = "bg-glass dark:bg-dark-glass backdrop-blur border border-glass-border dark:border-dark-glass-border rounded-lg w-full py-sm px-md text-text-default dark:text-dark-text-default leading-tight shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:shadow-md focus:-translate-y-px disabled:opacity-50 placeholder:text-text-light dark:placeholder:text-dark-text-light";
  const readOnlyInputClasses = `${inputClasses} bg-gray-100/70 dark:bg-gray-700/50 cursor-not-allowed`;

  const buttonBaseClasses = "font-bold py-sm px-lg rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center";
  const primaryButtonClasses = `${buttonBaseClasses} bg-gradient-primary text-white hover:opacity-90 active:scale-95`;
  const dangerButtonClasses = `${buttonBaseClasses} bg-gradient-danger text-white hover:opacity-90 active:scale-95`;


  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      {/* Added dark mode text color */}
      <h2 className="text-2xl font-semibold mb-lg text-center text-primary dark:text-primary-light">
        {expenseId ? 'Edit Expense' : 'Add Expense Details'}
      </h2>

      {expenseId && <input type="hidden" value={expenseId} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div>
          <label htmlFor="type" className={labelClasses}>Type:</label>
          <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} required className={inputClasses} placeholder="e.g., Meal, Taxi, Supplies" />
        </div>
        <div>
          <label htmlFor="date" className={labelClasses}>Date:</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className={`${inputClasses} dark:[color-scheme:dark]`} /> {/* Hint for dark date picker */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div>
          <label htmlFor="vendor" className={labelClasses}>Vendor:</label>
          <input type="text" id="vendor" value={vendor} onChange={(e) => setVendor(e.target.value)} className={inputClasses} placeholder="e.g., Starbucks, Uber" />
        </div>
        <div>
          <label htmlFor="location" className={labelClasses}>Location:</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} placeholder="e.g., New York, Airport" />
        </div>
      </div>

      <div>
        <label htmlFor="tripName" className={labelClasses}>Trip Name:</label>
        <input
          type="text" id="tripName" value={tripName} onChange={(e) => setTripName(e.target.value)} required readOnly={!!expenseId}
          className={readOnlyInputClasses}
        />
      </div>

      <div>
        <label htmlFor="cost" className={labelClasses}>Cost:</label>
        <input type="number" id="cost" value={cost} onChange={(e) => setCost(e.target.value)} required step="0.01" className={inputClasses} placeholder="0.00" />
      </div>

      <div>
        <label htmlFor="comments" className={labelClasses}>Additional Comments:</label>
        <textarea
          id="comments" value={comments} onChange={(e) => setComments(e.target.value)} rows={3}
          className={inputClasses}
          placeholder="Add any additional notes here..."
        ></textarea>
      </div>

      <div className="flex items-center justify-between pt-md">
        <button type="submit" className={primaryButtonClasses}>
          <i className="fas fa-save mr-sm"></i> {expenseId ? 'Update Expense' : 'Save Expense'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={dangerButtonClasses}>
            <i className="fas fa-times mr-sm"></i> Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;