import { ReservationForm } from "@/components/custom/forms/reservation-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import FamilleAnimal from "@/assets/images/famille-animal-hiver.jpg";
import { useTranslation } from "react-i18next";
import { SnowFaller } from "@/components/custom/snow-faller";

export const Route = createLazyFileRoute("/reservation")({
  component: Reservation,
});

function Reservation() {
  const { t } = useTranslation("reservation");

  return (
    <div className="flex w-screen h-[80vh] justify-center items-center container my-16">
      <div className="flex-1 h-full relative overflow-y-hidden">
        <img
          className="h-full rounded-xl shadow object-cover"
          src={FamilleAnimal}
          alt="Famille avec gros animal"
        />
        <div className="absolute rounded-xl top-0 left-0 w-full h-full">
          <SnowFaller />
        </div>
      </div>
      <div className="flex h-full px-8 py-4 flex-col flex-1">
        <h1 className="text-5xl mb-4">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">{t("information")}</p>
        <ReservationForm className="flex-1 space-y-4" />
      </div>
    </div>
  );
}
