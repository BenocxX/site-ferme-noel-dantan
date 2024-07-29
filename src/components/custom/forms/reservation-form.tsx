import { Locale, formatDate } from 'date-fns';
import { frCA } from 'date-fns/locale';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';

const FormSchema = z.object({
  date: z.date(),
  time: z.coerce.number(),
});

export function ReservationForm({ className, ...formProps }: React.ComponentProps<'form'>) {
  const { t, i18n } = useTranslation('reservation');

  const today = new Date();
  const startingMonth = 10;

  // TODO: Write logic to pick the first available date
  // TODO: Handle case where there are no available dates
  const firstAvailableDate = new Date(today.getFullYear(), startingMonth);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: firstAvailableDate,
    },
  });

  const selectedDate = form.watch('date');

  const availableThirtyMinuteBlocks = getAvailableThirtyMinuteBlock(selectedDate);
  useEffect(() => {
    form.setValue('time', availableThirtyMinuteBlocks.filter((block) => !block.isFull())[0].id);
  }, [availableThirtyMinuteBlocks, form]);

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
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-start">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                {/* <FormLabel>Date</FormLabel> */}
                <Calendar
                  required
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
          <div className="flex flex-col gap-4 lg:w-full">
            <h3 className="text-2xl">
              {displayFormattedDate(selectedDate, getLocaleFromLanguage(i18n.language))}
            </h3>
            <div className="flex flex-col">
              <h5>Nombre de réservation:</h5>
              <span>Avant-midi: {getAMReservationCount(availableThirtyMinuteBlocks)}</span>
              <span>Après-midi: {getPMReservationCount(availableThirtyMinuteBlocks)}</span>
            </div>

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a valid time of the day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableThirtyMinuteBlocks
                        .filter((block) => !block.isFull())
                        .map((block, i) => (
                          <SelectItem key={i} value={block.id.toString()}>
                            {displayFormattedTime(block.date, getLocaleFromLanguage(i18n.language))}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" className="!mt-8 w-full lg:!mt-4 lg:w-max">
          {t('submitButton')}
        </Button>
      </form>
    </Form>
  );
}

function getLocaleFromLanguage(language: string): Locale | undefined {
  return language === 'fr' ? frCA : undefined;
}

function displayFormattedDate(date: Date, locale?: Locale) {
  const formattedDate = formatDate(date, 'PPPP', { locale });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

function displayFormattedTime(date: Date, locale?: Locale) {
  return formatDate(date, 'p', { locale });
}

function getAvailableThirtyMinuteBlock(date: Date): ThirtyMinuteBlock[] {
  const times: ThirtyMinuteBlock[] = [];
  for (let i = 8; i < 17; i++) {
    if (i === 12) continue;
    for (let j = 0; j < 60; j += 30) {
      const tempDate = new Date(date.setHours(i, j, 0, 0));
      const randomNumberOfReservations = Math.floor(Math.random() * 31) + 15;
      const block = new ThirtyMinuteBlock(times.length + 1, tempDate, randomNumberOfReservations);
      times.push(block);
    }
  }

  return times;
}

function getAMReservationCount(blocks: ThirtyMinuteBlock[]) {
  return blocks
    .filter((block) => block.date.getHours() < 12)
    .reduce((acc, block) => acc + block.reservationCount, 0);
}

function getPMReservationCount(blocks: ThirtyMinuteBlock[]) {
  return blocks
    .filter((block) => block.date.getHours() >= 13)
    .reduce((acc, block) => acc + block.reservationCount, 0);
}

class ThirtyMinuteBlock {
  constructor(
    public readonly id: number,
    public readonly date: Date,
    public readonly reservationCount: number
    // eslint-disable-next-line no-empty-function
  ) {}

  public isFull() {
    return this.reservationCount >= 30;
  }
}
