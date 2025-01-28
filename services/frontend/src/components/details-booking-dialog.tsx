import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authApi, backendApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

const STATUS_OPTIONS = [
  { name: "Pending", id: "pending" },
  { name: "Confirmed", id: "confirmed" },
  { name: "Canceled", id: "canceled" },
];

interface Booking {
  id: string;
  date: string;
  time: string;
  notes: string;
  status: string;
  userId: string;
}

const DetailsBookingDialog = ({
  open,
  onOpenChange,
  onSave,
  booking,
  serviceName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  booking?: Booking;
  serviceName?: string;
}) => {
  const { toast } = useToast();

  const [status, setStatus] = useState<string>(booking?.status || "");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    setStatus(booking?.status || "");
  }, [booking?.status]);

  useEffect(() => {
    if (!booking?.userId) return;

    let canceled = false;

    async function getData() {
      try {
        const response = await authApi.get(`users/${booking?.userId}`);
        if (!canceled) setUserName(response.data.username || "");
      } catch (err) {
        console.error(err);
      }
    }

    getData();

    return () => {
      setUserName("");
      canceled = true;
    };
  }, [booking?.userId]);

  const handleSubmit = async () => {
    if (!booking?.id) return;

    try {
      await backendApi.put(`/bookings/${booking?.id}`, {
        status,
      });

      toast({
        title: "Success",
        description: "Booking has been updated",
      });

      onSave?.();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error updating booking",
        description: (err as AxiosError).message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View Booking</DialogTitle>
          <DialogDescription>For Service: {serviceName}</DialogDescription>
        </DialogHeader>
        {booking && (
          <div key={booking.id} className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold">{booking.id}</h3>
            <p>Date: {booking.date.split("T")[0]}</p>
            <p>Time: {booking.time}</p>
            <p>Notes: {booking.notes}</p>
            <p>
              <b>Status: {booking.status}</b>
            </p>
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Label>User: @{userName || "unknown"}</Label>
          <div className="flex gap-4 items-center">
            <Label className="w-max flex-none">Set Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => handleSubmit()}>Save status</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsBookingDialog;
