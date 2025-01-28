import { Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "../hooks/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ServiceHub",
  description: "Book diverse services easily",
};

const styles = {
  layoutWrapper: {
    display: "flex",
    flexDirection: "column" as const,
    minHeight: "100vh",
  },
  main: {
    flexGrow: 1,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <div style={styles.layoutWrapper}>
            <Navigation />
            <main style={styles.main}>{children}</main>
            <Toaster />
            <Footer />
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
