import '@/app/globals.css';
import { ReactNode } from 'react';
import { DataGridProvider } from '@/contexts/DataGridContext';
import './globals.css'
import '../lib/i18n';
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" >
      <body className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        <DataGridProvider>{children}</DataGridProvider>
      </body>
    </html>
  );
}