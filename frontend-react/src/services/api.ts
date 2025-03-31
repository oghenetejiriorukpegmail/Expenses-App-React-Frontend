import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
// Import ExpenseData type if needed for function signatures
import { ExpenseData } from '../components/ExpenseForm'; // Adjust path if needed

// Define the base URL for the backend API
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if your backend runs on a different port/path

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Token Management ---

const TOKEN_KEY = 'authToken';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// --- Axios Request Interceptor ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      // Let Axios handle Content-Type for FormData
    } else {
       config.headers = config.headers || {};
       config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --- Axios Response Interceptor ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      console.warn('API request unauthorized (401). Token might be invalid.');
      removeToken();
      // Consider triggering a global logout event or redirecting
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// --- API Service Functions ---

// Define Trip type (based on backend)
export interface Trip {
  id: number | string; // Use number or string based on backend ID type
  name: string;
  description?: string | null;
  createdAt?: string; // Optional, depending on backend response
}

// Define Settings type
export interface ApiSettings {
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  CLAUDE_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
}


// Trip Functions
export const getTrips = async (): Promise<Trip[]> => {
  const response = await apiClient.get('/trips');
  return response.data; // Assuming backend returns array of trips
};

export const addTrip = async (tripData: { name: string; description?: string }): Promise<Trip> => {
  const response = await apiClient.post('/trips', tripData);
  return response.data.trip; // Assuming backend returns { message, trip }
};

export const deleteTrip = async (id: number | string): Promise<void> => {
  await apiClient.delete(`/trips/${id}`);
};


// Expense Functions
export const getExpenses = async (): Promise<ExpenseData[]> => {
  const response = await apiClient.get('/expenses');
  return response.data;
};

export const addExpense = async (expenseData: Omit<ExpenseData, 'id'>, receiptFile?: File | null): Promise<ExpenseData> => {
  const formData = new FormData();
  Object.entries(expenseData).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (receiptFile) {
    formData.append('receipt', receiptFile);
  }
  const response = await apiClient.post('/expenses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.expense;
};

export const updateExpense = async (id: string, expenseData: Partial<ExpenseData>, receiptFile?: File | null): Promise<ExpenseData> => {
   const formData = new FormData();
  Object.entries(expenseData).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (receiptFile) {
    formData.append('receipt', receiptFile);
  }
  const response = await apiClient.put(`/expenses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await apiClient.delete(`/expenses/${id}`);
};

// OCR Function
export const processReceiptOCR = async (receiptFile: File, ocrMethod: string = 'builtin', model?: string): Promise<any> => {
  const formData = new FormData();
  formData.append('receipt', receiptFile);
  formData.append('ocrMethod', ocrMethod);
  if (model) {
    formData.append('model', model);
  }
  const response = await apiClient.post('/ocr/process', formData, {
     headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Settings Function
export const updateEnvSettings = async (settings: ApiSettings): Promise<{ message: string }> => {
  const response = await apiClient.post('/update-env', settings);
  return response.data; // Assuming backend returns { message }
};


export default apiClient;