"use client";

import { JSX } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface BookingDetails {
  service: string;
  category: string;
  date: string;
  time: string;
  notes: string;
}

export default function BookingConfirmation({
  bookingDetails,
}: {
  bookingDetails: BookingDetails;
}): JSX.Element {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Booking Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg">Thank you for your booking!</p>
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="font-semibold mb-2">Booking Details:</h2>
            <p>
              <span className="font-medium">Service:</span>{" "}
              {bookingDetails.service}
            </p>
            <p>
              <span className="font-medium">Category:</span>{" "}
              {bookingDetails.category}
            </p>
            <p>
              <span className="font-medium">Date:</span> {bookingDetails.date}
            </p>
            <p>
              <span className="font-medium">Time:</span> {bookingDetails.time}
            </p>
            <p>
              <span className="font-medium">Notes:</span> {bookingDetails.notes}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
