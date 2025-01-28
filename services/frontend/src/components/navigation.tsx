"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { JSX } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";

const styles = {
  nav: {
    backgroundColor: "var(--background)",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  },
  content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 0",
  },
  logo: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    textDecoration: "none",
    color: "var(--foreground)",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
};

export function Navigation(): JSX.Element {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.content}>
          <Link href="/" style={styles.logo}>
            ServiceHub
          </Link>
          <div style={styles.navLinks}>
            {isAuthenticated && (
              <Button asChild variant="ghost">
                <Link href="/add-service">Add Service</Link>
              </Button>
            )}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      try {
                        localStorage.removeItem("access_token");
                        setIsAuthenticated(false);
                        router.push("/login");
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
