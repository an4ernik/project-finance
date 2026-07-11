import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './i18n.ts';
import './index.css';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {TooltipProvider} from './components/ui/tooltip.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      staleTime: 1000 * 5 * 60,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
