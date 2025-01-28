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
import { JSX, use, useEffect, useState } from "react";
import { backendApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
const styles = {
  title: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
  },
  fullWidthButton: {
    width: "100%",
  },
};

interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  userId?: number;
  username?: string;
}

export default function ServicesPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}): JSX.Element {
  const { categoryId } = use(params);

  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function getServices() {
      try {
        const result = await backendApi.get<Service[]>(
          `/services/category/name/${categoryId}`
        );
        setServices(result.data);
      } catch (err) {
        toast({
          title: "API Error",
          description: (err as AxiosError).message,
        });
      }
    }

    getServices();
  }, [categoryId]);

  return (
    <div>
      <h1 style={styles.title}>Services in {decodeURIComponent(categoryId)}</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col">
            <CardHeader className="flex-1">
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
              <CardDescription>@{service.username}</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ marginBottom: "1.5rem" }} className="text-sm">
                <p>Duration: {service.duration} minutes</p>
                <p>Price: {service.price}$</p>
              </div>
              <Link href={`${categoryId}/booking/${service.id}`}>
                <Button style={styles.fullWidthButton} variant="outline">
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
