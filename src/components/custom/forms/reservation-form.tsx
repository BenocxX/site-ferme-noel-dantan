import { Locale, formatDate } from 'date-fns';
import { frCA } from 'date-fns/locale';
import { Info, Sunrise, Sunset } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
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
import { Separator } from '@/components/ui/separator';

import { Namespaces } from '@/i18n/i18n';
import { cn } from '@/lib/utils';

type OpenDate = {
  id: number;
  date: Date;
  totalAM: number;
  totalPM: number;
};

type HalfHour = {
  id: number;
  period: string;
};

type ReservationSpot = {
  id: number;
  halfHour: HalfHour;
  openDateId: number;
  count: number;
};

const rules: {
  id: number;
  i18nKey: keyof Namespaces['reservation']['rules'];
}[] = [
  {
    id: 0,
    i18nKey: 'noAnimals',
  },
  {
    id: 1,
    i18nKey: 'cashOnly',
  },
];

const FormSchema = z.object({
  date: z.number(),
  time: z.coerce.number(),
  acceptedRules: z
    .array(z.number())
    .refine((acceptedRules) => rules.every((rule) => acceptedRules.includes(rule.id)), {
      params: {
        i18n: { key: 'all_rules_required' },
      },
    }),
});

export function ReservationForm({ className, ...formProps }: React.ComponentProps<'form'>) {
  const { t, i18n } = useTranslation('reservation');

  const openDatesQuery = useQuery({
    queryKey: ['open-date'],
    queryFn: async () => {
      const res = await fetch('/api/open-date');
      const openDates = (await res.json()) as OpenDate[];
      return openDates.map((openDate) => ({
        ...openDate,
        date: new Date(openDate.date),
      }));
    },
  });

  const today = new Date();
  const earliestDate = openDatesQuery.data?.at(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: openDatesQuery.isSuccess ? openDatesQuery.data[0].id : undefined,
      acceptedRules: [],
    },
  });

  const [selectedOpenDate, setSelectedOpenDate] = useState<OpenDate | undefined>(
    openDatesQuery.data?.find((date) => date.id === form.watch('date'))
  );

  useEffect(() => {
    setSelectedOpenDate(earliestDate);
  }, [earliestDate]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
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
                {openDatesQuery.isSuccess ? (
                  <Calendar
                    required
                    onDayClick={(day) =>
                      setSelectedOpenDate(
                        openDatesQuery.data?.find(
                          (date) =>
                            date.date.toLocaleDateString('en-US') ===
                            day.toLocaleDateString('en-US')
                        )
                      )
                    }
                    className="w-max rounded-md bg-white shadow-md"
                    mode="single"
                    locale={i18n.language === 'fr' ? frCA : undefined}
                    labels={{
                      labelNext: () => t('calendar.nextMonth', { ns: 'common' }),
                      labelPrevious: () => t('calendar.prevMonth', { ns: 'common' }),
                    }}
                    selected={selectedOpenDate?.date}
                    fromDate={earliestDate?.date}
                    toYear={today.getFullYear()}
                    disabled={(calendarDate) => {
                      const isDateOpen = openDatesQuery.data?.some(
                        (date) =>
                          date.date.toLocaleDateString('en-US') ===
                          calendarDate.toLocaleDateString('en-US')
                      );
                      return !isDateOpen;
                    }}
                    onSelect={(e) => {
                      // field.onChange(e);
                      const id = openDatesQuery.data?.find(
                        (date) =>
                          date.date.toLocaleDateString('en-US') === e?.toLocaleDateString('en-US')
                      )?.id;
                      if (id) {
                        form.setValue('date', id);
                      }
                    }}
                    initialFocus
                  />
                ) : (
                  <Calendar
                    required
                    className="w-max rounded-md bg-white shadow"
                    mode="single"
                    locale={i18n.language === 'fr' ? frCA : undefined}
                    labels={{
                      labelNext: () => t('calendar.nextMonth', { ns: 'common' }),
                      labelPrevious: () => t('calendar.prevMonth', { ns: 'common' }),
                    }}
                    fromMonth={
                      new Date(
                        today.getFullYear(),
                        today.getMonth() >= 10 ? today.getMonth() : 10,
                        1
                      )
                    }
                    toYear={today.getFullYear()}
                    disabled={() => true} // Disable all dates until we have the data
                    onSelect={field.onChange}
                    initialFocus
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator orientation="vertical" className="hidden h-[305px] lg:block" />
          <div className="flex flex-col gap-2 lg:w-full">
            {selectedOpenDate ? (
              <>
                <h3 className="flex items-center gap-2 text-2xl font-semibold">
                  {displayFormattedDate(
                    selectedOpenDate.date,
                    getLocaleFromLanguage(i18n.language)
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-muted-foreground"
                      >
                        <Info />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-max max-w-[132px] flex-col overflow-hidden py-2">
                      <h5 className="text-center text-sm">{t('statsTitle')}</h5>
                      <div className="mt-1 flex w-full justify-between">
                        <Badge
                          variant="secondary"
                          className="w-max flex-col gap-1 rounded-lg pb-2 pt-3"
                        >
                          <Sunrise height="20px" />
                          {selectedOpenDate.totalAM}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="w-max flex-col gap-1 rounded-lg pb-2 pt-3"
                        >
                          <Sunset height="20px" />
                          {selectedOpenDate.totalPM}
                        </Badge>
                      </div>
                    </PopoverContent>
                  </Popover>
                </h3>
                <div className="mt-[9px] flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('timeOfReservation.label')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ? field.value.toString() : undefined}
                        >
                          <FormControl>
                            <SelectTrigger className="border-0 shadow">
                              <SelectValue placeholder={t('timeOfReservation.placeholder')} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ReservationSpotsItems openDate={selectedOpenDate} />
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-2 rounded-md bg-white px-4 pb-4 pt-2 shadow">
                    <FormField
                      control={form.control}
                      name="acceptedRules"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Règlements</FormLabel>
                          </div>
                          {rules.map((rule) => (
                            <FormField
                              key={rule.id}
                              control={form.control}
                              name="acceptedRules"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={rule.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(rule.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, rule.id])
                                            : field.onChange(
                                                field.value?.filter((value) => value !== rule.id)
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {t(`rules.${rule.i18nKey}` as const)}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {t('submitButton')}
                  </Button>
                </div>
              </>
            ) : undefined}
          </div>
        </div>
      </form>
    </Form>
  );
}

function ReservationSpotsItems({ openDate }: { openDate: OpenDate }) {
  const reservationSpotsQuery = useQuery({
    queryKey: [openDate],
    queryFn: async (query) => {
      const res = await fetch(`/api/reservations-by-date?dateId=${query.queryKey[0].id}`);
      return (await res.json()) as ReservationSpot[];
    },
  });

  if (reservationSpotsQuery.isLoading) {
    return (
      <SelectItem value={'1'} disabled>
        Loading...
      </SelectItem>
    );
  }

  if (reservationSpotsQuery.isError) {
    return (
      <SelectItem value={'1'} disabled>
        Error loading data
      </SelectItem>
    );
  } else if (reservationSpotsQuery.isSuccess) {
    return reservationSpotsQuery.data.map((reservation, i) => (
      <SelectItem key={i} value={reservation.id.toString()}>
        {reservation.halfHour.period}
      </SelectItem>
    ));
  }
}

function getLocaleFromLanguage(language: string): Locale | undefined {
  return language === 'fr' ? frCA : undefined;
}

function displayFormattedDate(date: Date, locale?: Locale) {
  const formattedDate = formatDate(date, 'PPPP', { locale });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}
