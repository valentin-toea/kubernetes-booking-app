"use client";

import { useState, FormEvent, JSX, use, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backendApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Textarea } from "@/components/ui/textarea";
import BookingConfirmation, {
  BookingDetails,
} from "@/components/booking-confirmation";

const styles = {
  card: {
    maxWidth: "28rem",
    marginLeft: "auto",
    marginRight: "auto",
    width: "60vw",
    minWidth: "300px",
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

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
  providerId: string;
  username: string;
};

interface BookingPageProps {
  params: Promise<{
    categoryId: string;
    serviceData: string[];
  }>;
}

export default function BookingPage({ params }: BookingPageProps): JSX.Element {
  const { categoryId, serviceData } = use(params);
  const serviceId = serviceData[0];

  const [service, setService] = useState<Service>();
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    async function getService() {
      try {
        const result = await backendApi.get<Service>(`/services/${serviceId}`);
        setService(result.data);
      } catch (err) {
        toast({
          title: "API Error",
          description: (err as AxiosError).message,
        });
      }
    }

    getService();
  }, [serviceId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await backendApi.post(`/bookings`, {
        serviceId,
        date,
        time,
        notes,
        status: "pending",
      });

      toast({
        title: "Service",
        description: "Service has been booked",
      });
      setShowConfirmation(true);
    } catch (err) {
      toast({
        title: "API Error",
        description: (err as AxiosError).message,
      });
    }
  };

  if (showConfirmation)
    return (
      <BookingConfirmation
        bookingDetails={
          {
            service: service?.name,
            category: decodeURIComponent(categoryId),
            date,
            time,
            notes,
          } as BookingDetails
        }
      />
    );

  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Book {service?.name} Service</CardTitle>
        <CardDescription>
          Category: {decodeURIComponent(categoryId)}
        </CardDescription>
        <CardDescription>{service?.description}</CardDescription>
        <CardDescription>@{service?.username}</CardDescription>
      </CardHeader>
      <CardContent>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div className="flex gap-6 flex-wrap">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Type your message here."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <p>Duration: {service?.duration} minutes</p>
            <p>Price: {service?.price}$</p>
          </div>
          <Button style={styles.fullWidthButton} type="submit">
            Book Now
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
