import React, { useEffect, useState } from 'react'; // Added useEffect, useState
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions, // Import ChartOptions type
  TooltipItem // Import TooltipItem type
} from 'chart.js';
import { ExpenseData } from './ExpenseForm';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExpenseChartProps {
  expenses: ExpenseData[];
}

// Helper function to get theme preference
const getThemePreference = (): 'dark' | 'light' => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  // State to hold the current theme for dynamic option updates
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(getThemePreference());

  // Effect to listen for theme changes (e.g., if toggle is outside this component)
  // This assumes the 'dark' class is added/removed on the <html> element
  useEffect(() => {
     const observer = new MutationObserver((mutationsList) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                setCurrentTheme(getThemePreference());
            }
        }
     });
     observer.observe(document.documentElement, { attributes: true });
     return () => observer.disconnect(); // Cleanup observer on unmount
  }, []);


  // Process expenses data (remains the same)
  const processData = () => {
    const dataByType: { [key: string]: number } = {};
    expenses.forEach(expense => {
      const type = expense.type || 'Uncategorized';
      const cost = Number(expense.cost) || 0;
      dataByType[type] = (dataByType[type] || 0) + cost;
    });
    const labels = Object.keys(dataByType);
    const data = Object.values(dataByType);

    // Define colors - could potentially pull from Tailwind config if needed
    const lightColors = [
        'rgba(79, 70, 229, 0.6)', 'rgba(14, 165, 233, 0.6)', 'rgba(249, 115, 22, 0.6)',
        'rgba(239, 68, 68, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(107, 114, 128, 0.6)'
    ];
    const darkColors = [ // Example darker/more vibrant colors for dark mode
        'rgba(99, 102, 241, 0.7)', 'rgba(56, 189, 248, 0.7)', 'rgba(251, 146, 60, 0.7)',
        'rgba(248, 113, 113, 0.7)', 'rgba(251, 191, 36, 0.7)', 'rgba(156, 163, 175, 0.7)'
    ];
    const lightBorders = [
        'rgba(79, 70, 229, 1)', 'rgba(14, 165, 233, 1)', 'rgba(249, 115, 22, 1)',
        'rgba(239, 68, 68, 1)', 'rgba(245, 158, 11, 1)', 'rgba(107, 114, 128, 1)'
    ];
     const darkBorders = [ // Example darker/more vibrant colors for dark mode
        'rgba(99, 102, 241, 1)', 'rgba(56, 189, 248, 1)', 'rgba(251, 146, 60, 1)',
        'rgba(248, 113, 113, 1)', 'rgba(251, 191, 36, 1)', 'rgba(156, 163, 175, 1)'
    ];

    return {
      labels,
      datasets: [
        {
          label: 'Expenses by Type',
          data,
          backgroundColor: currentTheme === 'dark' ? darkColors : lightColors,
          borderColor: currentTheme === 'dark' ? darkBorders : lightBorders,
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = processData();

  // Define chart options dynamically based on theme
  const options: ChartOptions<'bar'> = { // Add type ChartOptions<'bar'>
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize height
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: currentTheme === 'dark' ? '#f9fafb' : '#1f2937', // Dark/Light text color
        }
      },
      title: {
        display: true,
        text: 'Expense Breakdown by Type',
        color: currentTheme === 'dark' ? '#f9fafb' : '#1f2937', // Dark/Light text color
      },
      tooltip: {
         backgroundColor: currentTheme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(0, 0, 0, 0.8)', // Dark/Light tooltip bg
         titleColor: '#ffffff', // White title for both
         bodyColor: '#ffffff', // White body for both
         callbacks: {
             label: function(context: TooltipItem<'bar'>) { // Use TooltipItem type
                 let label = context.dataset.label || '';
                 if (label) { label += ': '; }
                 if (context.parsed.y !== null) {
                     label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                 }
                 return label;
             }
         }
      }
    },
     scales: {
        y: {
            beginAtZero: true,
            ticks: {
                color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280', // Dark/Light tick color
                callback: function(value) {
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value));
                }
            },
            grid: {
              color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Dark/Light grid line color
            }
        },
        x: {
             ticks: {
                color: currentTheme === 'dark' ? '#9ca3af' : '#6b7280', // Dark/Light tick color
            },
            grid: {
              color: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', // Dark/Light grid line color
            }
        }
    }
  };

  // Use a key prop that changes with the theme to force re-render with new options
  return <Bar key={currentTheme} options={options} data={chartData} />;
};

export default ExpenseChart;