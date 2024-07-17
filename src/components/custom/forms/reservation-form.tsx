"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { frCA } from "date-fns/locale";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
});

export function ReservationForm() {
  const today = new Date();
  const startingMonth = 10;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit() {
    toast("Form submitted");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Calendar
                className="rounded-md border"
                mode="single"
                selected={field.value}
                locale={frCA}
                // TODO: Localize the calendar correctly using i18next
                labels={{
                  labelNext: () => "Aller au mois suivant",
                  labelPrevious: () => "Aller au mois précédent",
                }}
                fromMonth={new Date(today.getFullYear(), startingMonth)}
                toYear={today.getFullYear()}
                defaultMonth={
                  today.getMonth() < startingMonth
                    ? new Date(today.getFullYear(), startingMonth)
                    : today
                }
                onSelect={field.onChange}
                disabled={(date) =>
                  date < today || date.getMonth() < startingMonth
                }
                initialFocus
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
