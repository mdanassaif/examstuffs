import type { Metadata } from "next";

 
 
import "./globals.css";
import { Kanit } from "next/font/google";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["400" ], // You can specify the weights you need
});


import Navbar from "@/components/Navbar";



export const metadata: Metadata = {
  title: "ExamStuffs",
  description: "Find any topics related materials easily.",
};

 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kanit.className}>
       <Navbar/>
        {children}
    
        </body>
    </html>
  );
}
