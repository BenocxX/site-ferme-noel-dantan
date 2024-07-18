import { ReservationForm } from "@/components/custom/forms/reservation-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import FamilleAnimal from "@/assets/images/famille-animal-hiver.jpg";
import { useTranslation } from "react-i18next";

export const Route = createLazyFileRoute("/reservation")({
  component: Reservation,
});

function Reservation() {
  const { t } = useTranslation("reservation");

  return (
    <div className="flex w-screen">
      <img
        className="h-[calc(90vh)] flex-1 object-cover"
        src={FamilleAnimal}
        alt="Famille avec gros animal"
      />
      <div className="flex flex-col items-center mt-16 flex-1">
        <h1 className="text-5xl mb-12">{t("title")}</h1>
        <ReservationForm />
      </div>
    </div>
  );
}
