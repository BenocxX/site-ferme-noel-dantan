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
import { useTranslation } from "react-i18next";

const FormSchema = z.object({
  date: z.date(),
});

export function ReservationForm() {
  const today = new Date();
  const startingMonth = 10;

  const { t, i18n } = useTranslation();

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
                locale={i18n.language === "fr" ? frCA : undefined}
                labels={{
                  labelNext: () => t("calendar.nextMonth"),
                  labelPrevious: () => t("calendar.prevMonth"),
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
