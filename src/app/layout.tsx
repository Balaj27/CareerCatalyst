"use client";

import { AuthProvider } from './lib/auth-context'; // Your AuthContext
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './lib/store'; // Import your Redux store
import type { ReactNode } from 'react';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>  {/* Wrap the app in the Redux Provider */}
          <AuthProvider>  {/* Wrap the app in the AuthProvider */}
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
