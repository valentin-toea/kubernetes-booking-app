import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/AuthContext";
import { backendApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import DetailsBookingDialog from "./details-booking-dialog";
import { Button } from "./ui/button";

interface Service {
  description: string;
  duration: string;
  id: string;
  name: string;
  price: string;
  providerId: string;
  username: string;
}

interface Booking {
  id: string;
  date: string;
  time: string;
  notes: string;
  status: string;
  userId: string;
}

const ViewBookingsDialog = ({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | undefined;
  onSave?: () => void;
}) => {
  const { userData } = useAuth();
  const { toast } = useToast();

  const [openDetails, setOpenDetails] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking>();

  useEffect(() => {
    let canceled = false;

    async function getData() {
      if (!service?.id) return;

      try {
        const response = await backendApi.get(
          `bookings/service/${service?.id}`
        );

        if (!canceled) setBookings(response.data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error fetching bookings for this service",
          description: (err as AxiosError).message,
        });
      }
    }

    getData();

    return () => {
      setBookings([]);
      canceled = true;
    };
  }, [service?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Bookings</DialogTitle>
          <DialogDescription>Bookings for service:</DialogDescription>
          <DialogDescription>
            <b>{service?.name}</b> <br /> {service?.description} <br /> Price:{" "}
            {service?.price}$ <br /> Duration: {service?.duration} min
          </DialogDescription>
        </DialogHeader>
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold">{booking.id}</h3>
                <p>Date: {booking.date.split("T")[0]}</p>
                <p>Time: {booking.time}</p>
                <p>
                  <b>Status: {booking.status}</b>
                </p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setOpenDetails(true);
                  }}
                >
                  View More
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no bookings yet.</p>
        )}
        <DetailsBookingDialog
          open={openDetails}
          onOpenChange={(open) => setOpenDetails(open)}
          booking={selectedBooking}
          serviceName={service?.name}
          onSave={async () => {
            const response = await backendApi.get(
              `bookings/service/${service?.id}/user/${userData?.id}`
            );

            setBookings(response.data);

            setOpenDetails(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewBookingsDialog;
