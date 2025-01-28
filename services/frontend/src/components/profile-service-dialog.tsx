"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { backendApi } from "@/lib/api";
import { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { Textarea } from "./ui/textarea";

interface Service {
  description: string;
  duration: string;
  id: string;
  name: string;
  price: string;
  providerId: string;
  username: string;
}

export function ProfileServiceDialog({
  open,
  onOpenChange,
  service,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | undefined;
  onSave: () => void;
}) {
  const { userData } = useAuth();
  const { toast } = useToast();

  const [serviceName, setServiceName] = useState<string>(service?.name ?? "");
  const [serviceDescription, setServiceDescription] = useState<string>(
    service?.description ?? ""
  );
  const [price, setPrice] = useState<string>(service?.price ?? "");
  const [duration, setDuration] = useState<string>(service?.duration ?? "");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await backendApi.put(`/services/${service?.id}`, {
        name: serviceName,
        description: serviceDescription,
        price,
        duration,
        username: userData?.username,
      });

      toast({
        title: "Success",
        description: "Your service has been updated",
      });

      onSave();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error updating your service",
        description: (err as AxiosError).message,
      });
    }
  };

  if (!service) return;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Service</DialogTitle>
            <DialogDescription>Update your service info</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Textarea
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
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
