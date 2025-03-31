import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import apiClient, { setToken, removeToken, getToken } from '../services/api'; // Import API client and token functions

// Define the shape of the user object (matching backend response if possible)
interface User {
  id: string; // Assuming backend uses 'userId' or similar, adjust if needed
  username: string;
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to check for existing session/token on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        console.log("Auth Check: No token found.");
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log("Auth Check: Token found, verifying...");
      try {
        // Verify token by attempting to fetch protected data (e.g., trips)
        // The request interceptor in api.ts automatically adds the token header.
        // If this succeeds, the token is valid. We need user info though.
        // A dedicated '/auth/me' endpoint would be better.
        // For now, assume login response stored user info or we decode token (less secure).
        // Let's simulate fetching user data based on a valid token for now.
        // In a real app, you'd have an endpoint like /api/auth/me
        // const response = await apiClient.get('/auth/me'); // Ideal endpoint
        // setUser(response.data.user);

        // --- Simulation using token decode (less secure, better to have /me endpoint) ---
        // Decode JWT to get user info (requires jwt-decode library: npm install jwt-decode @types/jwt-decode)
        // import { jwtDecode } from 'jwt-decode'; // Import if using decode
        // const decoded: { userId: string; username: string; iat: number; exp: number } = jwtDecode(token);
        // Check expiry (optional, backend should verify anyway)
        // if (decoded.exp * 1000 < Date.now()) {
        //   throw new Error("Token expired");
        // }
        // setUser({ id: decoded.userId, username: decoded.username });
        // console.log("Auth Check: Token verified via decode (simulation). User:", decoded.username);
        // --- End Simulation ---

        // --- Simulation assuming login stored user ---
        // This requires storing user details alongside the token, which might not be ideal.
        const storedUser = localStorage.getItem('authUser'); // Example key
        if (storedUser) {
             const parsedUser = JSON.parse(storedUser);
             setUser(parsedUser);
             console.log("Auth Check: Restored user from localStorage (simulation). User:", parsedUser.username);
        } else {
             // If no stored user, but token exists, we might need a /me endpoint
             console.warn("Auth Check: Token exists but no user info found locally. Need /me endpoint or store user on login.");
             removeToken(); // Clean up potentially invalid state
             setUser(null);
        }
        // --- End Simulation ---


      } catch (error: any) {
        console.error("Auth check failed (token invalid or API error):", error.message);
        removeToken(); // Remove invalid token
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      const { token, userId, username: loggedInUsername } = response.data; // Adjust based on actual backend response keys

      if (!token || !userId || !loggedInUsername) {
        throw new Error('Invalid login response from server.');
      }

      setToken(token); // Store token using service function
      const currentUser: User = { id: userId, username: loggedInUsername };
      setUser(currentUser);
      // Simulate storing user details for session restore simulation
      localStorage.setItem('authUser', JSON.stringify(currentUser)); // Example key
      console.log("Login successful via context. User:", loggedInUsername);

    } catch (error) {
      console.error("Context login failed:", error);
      removeToken(); // Ensure token is removed on failed login
      localStorage.removeItem('authUser'); // Clear stored user
      setUser(null);
      throw error; // Re-throw error for component handling
    } finally {
       setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
     setIsLoading(true);
    try {
      // Optional: Call backend logout endpoint if it exists to invalidate session server-side
      // await apiClient.post('/auth/logout');
      console.log("Logging out via context...");
    } catch (error) {
       console.error("Context logout API call failed (continuing client-side logout):", error);
       // Don't stop client-side logout even if API fails
    } finally {
       removeToken(); // Remove token from storage
       localStorage.removeItem('authUser'); // Clear stored user
       setUser(null); // Clear user state
       setIsLoading(false);
       console.log("Client-side logout complete.");
    }
  };

  // Register function
  const register = async (username: string, password: string) => {
     setIsLoading(true);
    try {
      // Call the backend registration endpoint
      await apiClient.post('/auth/register', { username, password });
      console.log("Registration successful via context for:", username);
      // Don't log in automatically here, let user log in separately
    } catch (error: any) {
      console.error("Context registration failed:", error);
      // Check if the error response has specific details (e.g., username taken)
      // Corrected &&
      if (error.response && error.response.data && error.response.data.message) {
         throw new Error(error.response.data.message); // Throw specific message from backend
      }
      throw error; // Re-throw generic error otherwise
    } finally {
       setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children immediately, components handle loading state */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};