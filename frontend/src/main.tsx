import { createRoot } from 'react-dom/client'
import App from './app/App.tsx';

import '@/styles/reset.scss';
import '@/styles/global.scss';

createRoot(document.getElementById('root')!).render(
   <App />
)
