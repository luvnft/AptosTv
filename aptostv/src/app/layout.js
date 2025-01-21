import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { WalletProvider } from "./components/web3modal";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "APTV",
  description: "Created by Wizard of Hahz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <Header />
          <div className="main-absolute">{children}</div>
        </WalletProvider>
      </body>
    </html>
  );
}
