import React, { useState, useEffect } from 'react';
import { getTrips, addTrip, deleteTrip, Trip } from '../services/api';

// Helper component with dark mode variants
const SectionWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  // Added dark mode classes
  <section className={`bg-glass dark:bg-dark-glass backdrop-blur border border-glass-border dark:border-dark-glass-border rounded-xl shadow-glass dark:shadow-glass-dark p-xl mb-xl relative overflow-hidden transition-all duration-500 ease-in-out hover:shadow-md hover:shadow-primary/30 ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-80 rounded-t-xl"></div>
    {children}
  </section>
);

const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [newTripName, setNewTripName] = useState('');
  const [newTripDescription, setNewTripDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addTripError, setAddTripError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedTrips = await getTrips();
        setTrips(fetchedTrips);
      } catch (err: any) {
        setError('Failed to load trips.');
      } finally {
        setIsLoading(false);
      }
    };
    loadTrips();
  }, []);

  const handleAddTrip = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTripName.trim()) {
      setAddTripError('Trip name cannot be empty.');
      return;
    }
    setIsLoading(true);
    setAddTripError(null);
    setError(null);
    try {
      const added = await addTrip({ name: newTripName, description: newTripDescription || undefined });
      setTrips([...trips, added]);
      setNewTripName('');
      setNewTripDescription('');
    } catch (err: any) {
      setAddTripError(`Failed to add trip: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (id: number | string) => {
    if (!window.confirm(`Are you sure?`)) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteTrip(id);
      setTrips(trips.filter(trip => trip.id !== id));
    } catch (err: any) {
      setError(`Failed to delete trip: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Define base styles for reuse
  const inputClasses = "shadow-sm appearance-none border border-border-default dark:border-dark-border-default rounded-lg w-full py-sm px-md text-text-default dark:text-dark-text-default leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/80 dark:bg-dark-card-bg/80 disabled:opacity-50";
  const labelClasses = "block text-text-muted dark:text-dark-text-muted text-sm font-bold mb-xs";
  const primaryButtonClasses = `w-full bg-gradient-primary hover:opacity-90 text-white font-bold py-sm px-md rounded-lg focus:outline-none focus:shadow-outline flex items-center justify-center transition-opacity duration-300 shadow-md hover:shadow-lg`;
  const dangerButtonClasses = `text-danger dark:text-danger-light hover:text-danger-dark dark:hover:text-danger text-sm font-medium p-xs rounded-md hover:bg-danger-bg dark:hover:bg-danger/20 transition-colors duration-200`;


  return (
    <div>
      {/* Added dark mode text color */}
      <h1 className="text-3xl font-bold text-center my-lg text-primary dark:text-primary-light">Manage Trips</h1>

      {/* Add Trip Form Section */}
      <SectionWrapper>
        {/* Added dark mode text color */}
        <h3 className="text-xl font-semibold mb-md text-center text-primary dark:text-primary-light">Add New Trip</h3>
        <form onSubmit={handleAddTrip}>
          {addTripError && (
            // Error styling already uses theme colors
            <div className="mb-md p-sm bg-danger-bg border border-danger text-danger rounded-lg text-sm">
              <i className="fas fa-exclamation-triangle mr-xs"></i>{addTripError}
            </div>
          )}
          <div className="mb-md">
            <label htmlFor="trip-name" className={labelClasses}>Trip Name:</label>
            <input
              type="text" id="trip-name" value={newTripName} onChange={(e) => setNewTripName(e.target.value)} required
              placeholder="e.g., Business Conference NYC"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>
          <div className="mb-md">
            <label htmlFor="trip-description" className={labelClasses}>Description (Optional):</label>
            <input
              type="text" id="trip-description" value={newTripDescription} onChange={(e) => setNewTripDescription(e.target.value)}
              placeholder="e.g., Q4 Sales Meeting"
              className={inputClasses}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`${primaryButtonClasses} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Adding...' : <><i className="fas fa-plus mr-sm"></i> Add Trip</>}
          </button>
        </form>
      </SectionWrapper>

      {/* Trip List Section */}
      <SectionWrapper>
        {/* Added dark mode text color */}
        <h3 className="text-xl font-semibold mb-md text-center text-primary dark:text-primary-light">Your Trips</h3>
        {/* Added dark mode text color */}
        {isLoading && !trips.length && <p className="text-center text-text-muted dark:text-dark-text-muted">Loading trips...</p>}
        {/* Error styling already uses theme colors */}
        {error && <div className="text-danger bg-danger-bg p-sm rounded-lg mb-md text-center">{error}</div>}
        {/* Added dark mode text color */}
        {!isLoading && trips.length === 0 && !error && (
          <p className="text-center text-text-muted dark:text-dark-text-muted">You haven't added any trips yet.</p>
        )}
        {trips.length > 0 && (
          <ul className="space-y-sm">
            {trips.map((trip) => (
              // Added dark mode border and hover background
              <li key={trip.id} className="flex justify-between items-center p-md border border-border-default dark:border-dark-border-default rounded-lg hover:bg-light-bg dark:hover:bg-dark-light-bg transition-colors duration-200">
                <div>
                  {/* Added dark mode text colors */}
                  <span className="font-medium text-text-default dark:text-dark-text-default">{trip.name}</span>
                  {trip.description && <p className="text-sm text-text-muted dark:text-dark-text-muted">{trip.description}</p>}
                </div>
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  disabled={isLoading}
                  className={`${dangerButtonClasses} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Delete Trip"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionWrapper>
    </div>
  );
};

export default TripsPage;