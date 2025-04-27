"use client";

import { useState, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";

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
  loginLink: {
    textAlign: "center" as const,
    marginTop: "1rem",
  },
};

export default function RegisterPage(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await authApi.post("/auth/register", {
        username: name,
        password,
      });

      toast({
        title: "Authentication",
        description: "Succesfully signed up",
      });

      router.push("/login");
    } catch {
      toast({
        title: "Sign up Error",
        description: "Error",
      });
    }
  };

  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <Button style={styles.fullWidthButton} type="submit">
            Register
          </Button>
        </form>
        <p style={styles.loginLink}>
          Already have an account? <Link href="/login">Login here</Link>
        </p>
      </CardContent>
    </Card>
  );
}
