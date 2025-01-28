"use client";

import { useState, FormEvent, JSX, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { backendApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks/AuthContext";

const styles = {
  card: {
    maxWidth: "28rem",
    marginLeft: "auto",
    marginRight: "auto",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1.5rem",
  },
  fullWidthButton: {
    width: "100%",
    marginTop: "1rem",
  },
};

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function AddServicePage(): JSX.Element {
  const router = useRouter();
  const { toast } = useToast();
  const { userData } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);

  const [serviceName, setServiceName] = useState<string>("");
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsInvalid(false);
    if (!category) {
      setIsInvalid(true);
    }

    console.log("New service submitted:", {
      serviceName,
      serviceDescription,
      price,
      duration,
      category,
    });

    try {
      await backendApi.post("/services", {
        name: serviceName,
        description: serviceDescription,
        price,
        duration,
        categoryId: category,
        username: userData?.username,
      });

      toast({
        title: "Success",
        description: "Your service has been created",
      });

      router.push("/");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error creating your service",
        description: (err as AxiosError).message,
      });
    }
  };

  useEffect(() => {
    async function getData() {
      try {
        const result = await backendApi.get<Category[]>("/categories");
        setCategories(result.data);
      } catch (err) {
        console.error(err);
      }
    }

    getData();
  }, []);

  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Add New Service</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <Label htmlFor="serviceName">Service Name</Label>
            <Input
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="serviceDescription">Service Description</Label>
            <Input
              id="serviceDescription"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration {"(minutes)"}</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isInvalid && <p style={{ color: "red" }}>Must select a category</p>}
          <Button type="submit" style={styles.fullWidthButton}>
            Add Service
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
