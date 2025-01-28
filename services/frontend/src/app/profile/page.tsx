"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/hooks/AuthContext";
import { backendApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ProfileServiceDialog } from "@/components/profile-service-dialog";
import ViewBookingsDialog from "@/components/view-bookings-dialog";

interface Booking {
  service: {
    name: string;
    duration: number;
    username: string;
  };
  id: string;
  date: string;
  time: string;
  notes: string;
  status: string;
}

interface Service {
  description: string;
  duration: string;
  id: string;
  name: string;
  price: string;
  providerId: string;
  username: string;
}

export default function ProfilePage() {
  const { userData } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openBookingsDialog, setOpenBookingsDialog] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Service>();

  useEffect(() => {
    async function getData() {
      if (!userData?.id) return;

      try {
        const bookingsResult = await backendApi.get(
          `/bookings/user/${userData?.id}`
        );

        setBookings(bookingsResult.data);

        const servicesResult = await backendApi.get(
          `/services/provider/${userData?.id}`
        );

        setServices(servicesResult.data);
      } catch (err) {
        toast({
          title: "API Error",
          description: (err as AxiosError).message,
        });
      }
    }

    getData();
  }, [userData?.id]);

  return (
    <div className="max-w-4xl mx-auto" style={{ width: "60vw", minWidth: 300 }}>
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Avatar className="w-20 h-20">
            <AvatarImage src={undefined} alt={userData?.username} />
            <AvatarFallback>{userData?.username}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{userData?.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="bookings"
                onClick={() => setActiveTab("bookings")}
              >
                My Bookings
              </TabsTrigger>
              <TabsTrigger
                value="services"
                onClick={() => setActiveTab("services")}
              >
                My Services
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bookings">
              {bookings.length > 0 ? (
                <ul className="space-y-4">
                  {bookings.map((booking) => (
                    <li key={booking.id} className="bg-gray-100 p-4 rounded-md">
                      <h3 className="font-semibold">{booking.service.name}</h3>
                      <p>@{booking.service.username}</p>
                      <p>Date: {booking.date.split("T")[0]}</p>
                      <p>
                        Time: {booking.time} - Duration:{" "}
                        {booking.service.duration} min
                      </p>
                      <div>
                        <b>
                          Status:{" "}
                          <span
                            style={{
                              color:
                                booking.status === "confirmed"
                                  ? "green"
                                  : "black",
                            }}
                          >
                            {booking.status}
                          </span>
                        </b>
                      </div>
                      <p>Id: {booking.id}</p>
                      {booking.status !== "canceled" && (
                        <Button
                          variant="destructive"
                          className="mt-3"
                          onClick={async () => {
                            try {
                              await backendApi.put(`/bookings/${booking?.id}`, {
                                status: "canceled",
                              });
                              setBookings((prevBookings) => {
                                const oldBooking = prevBookings.find(
                                  (prevBooking) => prevBooking.id === booking.id
                                );
                                if (oldBooking) oldBooking.status = "canceled";

                                return [...prevBookings];
                              });
                            } catch {
                              console.error("error canceling the booking");
                              toast({
                                title: "Api Error",
                                description: "Could not cancel booking",
                              });
                            }
                          }}
                        >
                          Cancel Service
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You have no bookings yet.</p>
              )}
            </TabsContent>
            <TabsContent value="services">
              {services.length > 0 ? (
                <ul className="space-y-4">
                  {services.map((service) => (
                    <li key={service.id} className="bg-gray-100 p-4 rounded-md">
                      <h3 className="font-semibold">{service.name}</h3>
                      <p>{service.description}</p>
                      <p>Price: {service.price}$</p>
                      <p>Duration: {service.duration} min</p>
                      <div className="mt-3 flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedService(service);
                            setOpenBookingsDialog(true);
                          }}
                        >
                          View Bookings
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedService(service);
                            setOpenDialog(true);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You haven&apos;t created any services yet.</p>
              )}
            </TabsContent>
          </Tabs>
          {activeTab === "bookings" && (
            <div className="mt-4">
              <Button asChild>
                <Link href="/">Book New Service</Link>
              </Button>
            </div>
          )}
          {activeTab === "services" && (
            <div className="mt-4">
              <Button asChild>
                <Link href="/add-service">Add New Service</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ProfileServiceDialog
        key={selectedService?.id || ""}
        service={selectedService}
        open={openDialog}
        onOpenChange={(open) => setOpenDialog(open)}
        onSave={async () => {
          const servicesResult = await backendApi.get(
            `/services/provider/${userData?.id}`
          );

          setServices(servicesResult.data);
          setOpenDialog(false);
        }}
      />
      <ViewBookingsDialog
        open={openBookingsDialog}
        service={selectedService}
        onOpenChange={(open) => setOpenBookingsDialog(open)}
      />
    </div>
  );
}
