import '@/app/globals.css';
import { ReactNode } from 'react';
import { DataGridProvider } from '@/contexts/DataGridContext';
import './globals.css'
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" >
      <body className="bg-background text-foreground">
        <DataGridProvider>{children}</DataGridProvider>
      </body>
    </html>
  );
}