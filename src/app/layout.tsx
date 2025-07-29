import '@/app/globals.css';
import { ReactNode } from 'react';
import { DataGridProvider } from '@/contexts/DataGridContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css'
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