import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder data structure
interface DashboardSummary { totalExpenses: number; recentExpensesCount: number; totalTrips: number; }
interface RecentActivity { id: string; type: 'expense' | 'trip'; description: string; timestamp: string; }

// Helper component with dark mode variants
const SectionWrapper: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className = '', title }) => (
  // Added dark mode classes for background, border, shadow
  <section className={`bg-glass dark:bg-dark-glass backdrop-blur border border-glass-border dark:border-dark-glass-border rounded-xl shadow-glass dark:shadow-glass-dark p-lg mb-lg relative overflow-hidden ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-secondary opacity-80 rounded-t-xl"></div>
    {/* Added dark mode text color */}
    {title && <h2 className="text-xl font-semibold mb-md text-primary dark:text-primary-light">{title}</h2>}
    {children}
  </section>
);


const DashboardPage: React.FC = () => {
  // Placeholder data
  const summaryData: DashboardSummary = { totalExpenses: 1234.56, recentExpensesCount: 5, totalTrips: 3 };
  const recentActivity: RecentActivity[] = [
    { id: 'exp1', type: 'expense', description: 'Lunch Meeting', timestamp: '2024-03-30T14:00:00Z' },
    { id: 'trip1', type: 'trip', description: 'Created Trip: NYC Conference', timestamp: '2024-03-29T10:00:00Z' },
    { id: 'exp2', type: 'expense', description: 'Taxi Fare', timestamp: '2024-03-28T18:30:00Z' },
  ];

  const formatTimestamp = (ts: string) => {
    try {
      return new Date(ts).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
    } catch (e) { return ts; }
  }

  return (
    <div>
      {/* Added dark mode text color */}
      <h1 className="text-3xl font-bold text-center my-lg text-primary dark:text-primary-light">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
        {/* Summary Cards - Gradients generally look okay on dark, maybe adjust hover */}
        <div className="bg-gradient-primary text-white p-md rounded-xl shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-xs">Total Expenses</h3>
          <p className="text-3xl font-bold">${summaryData.totalExpenses.toFixed(2)}</p>
        </div>
         <div className="bg-gradient-secondary text-white p-md rounded-xl shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-xs">Recent Expenses (7 days)</h3>
          <p className="text-3xl font-bold">{summaryData.recentExpensesCount}</p>
        </div>
         <div className="bg-gradient-accent text-white p-md rounded-xl shadow-lg flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-xs">Active Trips</h3>
          <p className="text-3xl font-bold">{summaryData.totalTrips}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2">
          <SectionWrapper title="Recent Activity">
            {recentActivity.length > 0 ? (
              <ul className="space-y-sm">
                {recentActivity.map(activity => (
                  // Added dark mode border and text colors
                  <li key={activity.id} className="border-b border-border-default dark:border-dark-border-default pb-sm last:border-b-0">
                    <p className="text-text-default dark:text-dark-text-default">
                      <i className={`fas ${activity.type === 'expense' ? 'fa-receipt text-primary dark:text-primary-light' : 'fa-route text-secondary dark:text-secondary-light'} mr-sm`}></i>
                      {activity.description}
                    </p>
                    <p className="text-xs text-text-muted dark:text-dark-text-muted">{formatTimestamp(activity.timestamp)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-muted dark:text-dark-text-muted">No recent activity.</p>
            )}
          </SectionWrapper>
        </div>

        {/* Quick Actions */}
        <div>
          <SectionWrapper title="Quick Actions">
            <div className="flex flex-col space-y-sm">
              {/* Added dark mode hover states */}
              <Link to="/expenses" className="bg-primary hover:bg-primary-dark dark:hover:bg-primary-light text-white font-bold py-sm px-md rounded-lg text-center transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg">
                <i className="fas fa-plus mr-sm"></i> Add Expense
              </Link>
              <Link to="/trips" className="bg-secondary hover:bg-secondary-dark dark:hover:bg-secondary-light text-white font-bold py-sm px-md rounded-lg text-center transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg">
                 <i className="fas fa-suitcase-rolling mr-sm"></i> Manage Trips
              </Link>
            </div>
          </SectionWrapper>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;