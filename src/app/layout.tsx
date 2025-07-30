import '@/app/globals.css';
import { ReactNode } from 'react';

import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css'
import { DataGridProvider } from '@/contexts/DataGrid/DataGridContext';
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" >
      <body className="bg-background text-foreground m-0">
        <DataGridProvider>
          <ThemeProvider>{children}</ThemeProvider>
          </DataGridProvider>
      </body>
    </html>
  );
}