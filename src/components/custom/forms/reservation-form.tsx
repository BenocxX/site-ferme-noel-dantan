import { Locale, formatDate } from 'date-fns';
import { frCA } from 'date-fns/locale';
import { Info } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  noAnimalCheckbox: z.boolean(),
  liquidMoneyCheckbox: z.boolean(),
});

export function ReservationForm({ className, ...formProps }: React.ComponentProps<'form'>) {
  const { t, i18n } = useTranslation('reservation');

  const today = new Date();
  const startingDate = new Date(today.getFullYear(), 10, 23);
  const endDate = new Date(today.getFullYear(), 11, 24);

  // TODO: Write logic to pick the first available date
  // TODO: Handle case where there are no available dates
  const firstAvailableDate = today > startingDate ? today : startingDate;

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
                  defaultMonth={today > startingDate ? today : startingDate}
                  fromMonth={today > startingDate ? today : startingDate}
                  toYear={today.getFullYear()}
                  disabled={(date) => date < today || date < startingDate || date > endDate}
                  onSelect={field.onChange}
                  initialFocus
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2 lg:w-full">
            <h3 className="flex items-center gap-2 text-2xl">
              {displayFormattedDate(selectedDate, getLocaleFromLanguage(i18n.language))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" type="button">
                    <Info />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex w-max flex-col">
                  {/* TODO: Make better design */}
                  <h5>Nombre de réservation:</h5>
                  <span>Avant-midi: {getAMReservationCount(availableThirtyMinuteBlocks)}</span>
                  <span>Après-midi: {getPMReservationCount(availableThirtyMinuteBlocks)}</span>
                </PopoverContent>
              </Popover>
            </h3>
            <div className="flex flex-col gap-4">
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
                              {displayFormattedTime(
                                block.date,
                                getLocaleFromLanguage(i18n.language)
                              )}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2 rounded-md border px-4 pb-4 pt-2">
                <h4 className="text-lg">Règlements:</h4>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="noAnimalCheckbox"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Je ne vais pas amener d&apos;animaux avec moi</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="liquidMoneyCheckbox"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Je vais payer en argent comptant</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                {t('submitButton')}
              </Button>
            </div>
          </div>
        </div>
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

  const startingHour = 8; // 8:00 AM
  const dinerHour = 12; // 12:00 PM
  const endingHour = 15.5; // 15:30 PM

  for (let hour = startingHour; hour < endingHour; hour++) {
    if (hour === dinerHour) continue;
    for (let halfHour = 0; halfHour <= 0.5; halfHour += 0.5) {
      const tempDate = new Date(date.setHours(hour, halfHour * 60, 0, 0));
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
