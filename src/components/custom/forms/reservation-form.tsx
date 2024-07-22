import { frCA } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { cn } from '@/lib/utils';

const FormSchema = z.object({
  date: z.date(),
});

export function ReservationForm({ className, ...formProps }: React.ComponentProps<'form'>) {
  const today = new Date();
  const startingMonth = 10;

  const { t, i18n } = useTranslation('reservation');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit() {
    toast('Form submitted');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('space-y-8', className)}
        {...formProps}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Calendar
                className="w-max rounded-md border"
                mode="single"
                selected={field.value}
                locale={i18n.language === 'fr' ? frCA : undefined}
                labels={{
                  labelNext: () => t('calendar.nextMonth', { ns: 'common' }),
                  labelPrevious: () => t('calendar.prevMonth', { ns: 'common' }),
                }}
                fromMonth={new Date(today.getFullYear(), startingMonth)}
                toYear={today.getFullYear()}
                defaultMonth={
                  today.getMonth() < startingMonth
                    ? new Date(today.getFullYear(), startingMonth)
                    : today
                }
                onSelect={field.onChange}
                disabled={(date) => date < today || date.getMonth() < startingMonth}
                initialFocus
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t('submitButton')}</Button>
      </form>
    </Form>
  );
}
