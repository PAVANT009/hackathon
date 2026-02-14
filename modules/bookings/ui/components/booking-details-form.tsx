// modules/bookings/ui/components/booking-details-form.tsx
"use client";

import React from "react";
import type { Booking } from "@/src/generated/prisma";

type BookingDetails = Pick<
  Booking,
  "id" | "serviceType" | "address" | "description" | "urgencyLevel" | "bookingStatus"
>;

export function BookingDetailsForm({ booking }: { booking: BookingDetails }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Type</label>
        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {booking.serviceType || "N/A"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {booking.address || "N/A"}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {booking.description || "N/A"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Urgency Level</label>
        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {booking.urgencyLevel || "NORMAL"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Booking Status</label>
        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
          {booking.bookingStatus || "PENDING"}
        </p>
      </div>
    </div>
  );
}
