'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import AuthProvider from '../components/AuthProvider';
import '../app/globals.css';
import { Inter, Merriweather, Fira_Code, Roboto_Slab } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-merriweather' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira' });
const robotoSlab = Roboto_Slab({ subsets: ['latin'], variable: '--font-roboto-slab' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable} ${firaCode.variable} ${robotoSlab.variable}`}>
      <head>
        <title>Rezmé - AI Resume Builder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased text-surface-900 bg-surface-50 min-h-screen">
        <Provider store={store}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
