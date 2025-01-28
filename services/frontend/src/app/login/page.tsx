"use client";

import { useState, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/AuthContext";
import decodeToken from "@/lib/decodeToken";

const styles = {
  card: {
    maxWidth: "28rem",
    margin: "2rem auto",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
  },
  fullWidthButton: {
    width: "100%",
  },
  registerLink: {
    textAlign: "center" as const,
    marginTop: "1rem",
  },
};

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();
  const { setIsAuthenticated, setUserData } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await authApi.post("/auth/login", {
        username: email,
        password,
      });

      const { access_token } = response.data;

      localStorage.setItem("access_token", access_token);
      setIsAuthenticated(true);
      setUserData(
        decodeToken(access_token) as { username: string; id: number }
      );

      toast({
        title: "Authentication",
        description: "Succesfully logged in",
      });

      router.push("/");
    } catch (err) {
      toast({
        title: "Authentication Error",
        description:
          (err as AxiosError).status === 401
            ? "Invalid username or password"
            : (err as AxiosError).message,
      });
    }
  };

  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <Label htmlFor="email">Username</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" style={styles.fullWidthButton}>
            Login
          </Button>
        </form>
        <p style={styles.registerLink}>
          Don&apos;t have an account?{" "}
          <Link href="/register">Register here</Link>
        </p>
      </CardContent>
    </Card>
  );
}
