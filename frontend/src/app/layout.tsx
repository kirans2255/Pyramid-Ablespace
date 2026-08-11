import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const metadata: Metadata = {
  title: 'Pyramid - Task Management System',
  description: 'Full Stack Task Management System built with Next.js, Tailwind CSS, NestJS, and MongoDB.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '700917885820-1b7l3lrc2925nbdn129760totjiu6sfa.apps.googleusercontent.com';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
