"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JSX, useEffect, useState } from "react";
import { backendApi } from "@/lib/api";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

const styles = {
  title: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
  },
  fullWidthButton: {
    width: "100%",
  },
  addServiceCard: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  },
};

export interface Category {
  id: string;
  name: string;
  description: string;
}

// const categories: Category[] = [
//   { id: "home-services", name: "Home Services" },
//   { id: "health-wellness", name: "Health & Wellness" },
//   { id: "education", name: "Education" },
//   { id: "tech-support", name: "Tech Support" },
// ];

export default function Home(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function getCategories() {
      try {
        const result = await backendApi.get<Category[]>("/categories");
        setCategories(result.data);
      } catch (err) {
        toast({
          title: "API Error",
          description: (err as AxiosError).message,
        });
      }
    }

    getCategories();
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Welcome to ServiceHub</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/services/${category.name}`}>
                <Button variant="outline" style={styles.fullWidthButton}>
                  View Services
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
