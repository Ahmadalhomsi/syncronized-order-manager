"use client"

import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import SideNavbar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import "./globals.css";
// import { useWebSocket } from "@/hooks/useWebSocket";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  // const { messages } = useWebSocket("ws://localhost:8080");
  const pathname = usePathname();

  // // Check if we're on the customer page
  const isCustomerPage = pathname === '/customer';
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex">
          {!isAuthPage && !isCustomerPage && (
            <SideNavbar />
          )}
          <div className="flex-grow">
            {/* {messages.length > 0 && !isCustomerPage && (
              <div 
                key={messages[0]}
                className="fixed bottom-4 right-4 bg-white p-4 border rounded shadow-lg animate-slide-up"
              >
                <h2 className="font-bold">New Request</h2>
                <p>{messages[0]}</p>
              </div>
            )} */}
            {children}
          </div>
        </div>
        {/* Only render Toaster if not on customer page */}
        {!isCustomerPage && (
          <Toaster
            duration={3000}
            position="bottom-right"
            closeButton
            swipeDirection="right"
            swipeThreshold={50}
          />
        )}
      </body>
    </html>
  );
}