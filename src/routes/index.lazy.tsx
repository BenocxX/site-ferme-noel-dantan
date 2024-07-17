import { ReservationForm } from "@/components/custom/forms/reservation-form";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div className="w-screen mt-44 flex items-center justify-center">
        <ReservationForm />
      </div>
    </div>
  );
}
