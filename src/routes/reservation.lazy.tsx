import { ReservationForm } from "@/components/custom/forms/reservation-form";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/reservation")({
  component: Reservation,
});

function Reservation() {
  return (
    <div className="flex flex-col items-center justify-center w-screen">
      <ReservationForm />
    </div>
  );
}
