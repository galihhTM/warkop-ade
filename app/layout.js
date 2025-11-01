// app/layout.js
import { Saira } from "next/font/google";
import { Miltonian } from "next/font/google";
import "./globals.css";

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
});

const miltonian = Miltonian({
  variable: "--font-miltonian",
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Warkop Ade",
  description: "Warkop dengan suasana hangat dan tawa canda",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={` ${saira.variable} ${miltonian.variable} antialiased scroll-smooth bg-white`}>
        {children}
      </body>
    </html>
  );
}