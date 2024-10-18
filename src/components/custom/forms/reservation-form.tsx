import axios, { AxiosError } from 'axios';
import { formatDate } from 'date-fns';
import { frCA } from 'date-fns/locale';
import { Info, Sunrise, Sunset } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { UseQueryResult, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

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
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  language: z.string().optional(),
  email: z.string().email(),
  date: z.number(),
  reservationId: z.coerce
    .number()
    .optional()
    .refine((time) => time ?? -1 >= 0, {
      params: {
        i18n: { key: 'time_required' },
      },
    }),
  acceptedRules: z
    .array(z.number())
    .refine((acceptedRules) => rules.every((rule) => acceptedRules.includes(rule.id)), {
      params: {
        i18n: { key: 'all_rules_required' },
      },
    }),
});

function compareDates(date1?: Date, date2?: Date) {
  return date1?.toLocaleDateString('en-US') === date2?.toLocaleDateString('en-US');
}

export function ReservationForm({ className, ...formProps }: React.ComponentProps<'form'>) {
  const { t, i18n } = useTranslation('reservation');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mutation to create a reservation (submit the form)
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof FormSchema>) => {
      return axios.post<{ hash: string; email: string; date: Date; time: string }>(
        '/api/reservations-by-date',
        data
      );
    },
    onSuccess: async ({ data }) => {
      await navigate({
        from: '/',
        to: '/confirmation',
        search: data,
      });
    },
    onError: async (error: AxiosError) => {
      const result = error.response?.data as { error: string } | undefined;

      if (result?.error === 'reservationIsFull') {
        // Will invalidate the query for the selected date, thus refreshing the time slots
        queryClient.invalidateQueries({ queryKey: ['reservation-spots', selectedOpenDate?.id] });
      }
    },
  });

  // Query to get the open dates (calendar)
  const openDatesQuery = useQuery({
    queryKey: ['open-date'],
    queryFn: async () => {
      const { data } = await axios.get<OpenDate[]>('/api/open-date');
      return data.map((openDate) => ({
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
      language: i18n.language,
      date: openDatesQuery.isSuccess ? openDatesQuery.data[0].id : undefined,
      acceptedRules: [],
    },
  });

  const [selectedOpenDate, setSelectedOpenDate] = useState<OpenDate | undefined>();

  // Query to get the reservation spots for the selected date. Will update when the selected date changes
  const reservationSpotsQuery = useQuery({
    queryKey: ['reservation-spots', selectedOpenDate?.id],
    queryFn: async () => {
      const { data } = await axios.get<ReservationSpot[]>(
        `/api/reservations-by-date?dateId=${selectedOpenDate?.id}`
      );
      return data;
    },
  });

  useEffect(() => {
    setSelectedOpenDate(earliestDate);
    if (earliestDate) {
      form.setValue('date', earliestDate?.id);
    }
  }, [earliestDate, form]);

  useEffect(() => {
    form.setValue('language', i18n.language);
  }, [form, i18n.language]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const promise = mutation.mutateAsync(data);

    toast.promise(promise, {
      loading: 'Réservation en cours...',
      success: 'Réservation effectuée avec succès!',
      error: (error: AxiosError) => {
        const result = error.response?.data as { error: string } | undefined;

        switch (result?.error) {
          case 'reservationNotFound':
            return t('errors.reservationNotFound');
          case 'reservationIsFull':
            return t('errors.reservationIsFull');
        }

        return t('errors.unknownError');
      },
    });
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
                    modifiers={{
                      hasReservations: openDatesQuery.data
                        ?.filter((openDate) => openDate.totalAM > 0 || openDate.totalPM > 0)
                        .map((openDate) => openDate.date),
                    }}
                    modifiersClassNames={{
                      hasReservations: 'bg-green-50 aria-selected:bg-primary hover:bg-green-100',
                    }}
                    onDayClick={(day) => {
                      setSelectedOpenDate(
                        openDatesQuery.data?.find((date) => compareDates(date.date, day))
                      );
                    }}
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
                      if (mutation.isPending) return true;

                      const isDateOpen = openDatesQuery.data?.some((date) =>
                        compareDates(date.date, calendarDate)
                      );

                      return !isDateOpen;
                    }}
                    onSelect={(e) => {
                      // field.onChange(e);
                      const id = openDatesQuery.data?.find((date) =>
                        compareDates(date.date, e)
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
                  <FormattedDate date={selectedOpenDate.date} />
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
                  <div className="flex flex-col gap-2 lg:flex-row">
                    <FormField
                      control={form.control}
                      name="reservationId"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('timeOfReservation.label')}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ? field.value.toString() : undefined}
                            disabled={mutation.isPending}
                          >
                            <FormControl>
                              <SelectTrigger className="border-0 shadow">
                                <SelectValue placeholder={t('timeOfReservation.placeholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <ReservationSpotsItems
                                reservationSpotsQuery={reservationSpotsQuery}
                              />
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t('email.label')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('email.placeholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2 rounded-md bg-white px-4 pb-4 pt-2 shadow">
                    <FormField
                      control={form.control}
                      name="acceptedRules"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">{t('rules.label')}</FormLabel>
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
                                        disabled={mutation.isPending}
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
                  <Button
                    type="submit"
                    className="w-full shadow-md transition"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? t('submitting') : t('submitButton')}
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

function ReservationSpotsItems({
  reservationSpotsQuery,
}: {
  reservationSpotsQuery: UseQueryResult<ReservationSpot[], Error>;
}) {
  const { t } = useTranslation('reservation');

  if (reservationSpotsQuery.isLoading) {
    return (
      <SelectItem value={'1'} disabled>
        <span>{t('loading', { ns: 'common' })}</span>
      </SelectItem>
    );
  }

  if (reservationSpotsQuery.isError) {
    return (
      <SelectItem value={'1'} disabled>
        {t('errors.noReservationSpots')}
      </SelectItem>
    );
  } else if (reservationSpotsQuery.isSuccess) {
    return (
      <SelectGroup>
        <SelectLabel className="flex items-center justify-between">
          <span>{t('timeOfReservation.select.leftLabel')}</span>
          <span className="opacity-40">{t('timeOfReservation.select.rightLabel')}</span>
        </SelectLabel>
        {reservationSpotsQuery.data.map((reservation, i) => (
          <SelectItem
            key={i}
            value={reservation.id.toString()}
            rightComponent={
              <span className="absolute right-2 opacity-40">{reservation.count} / 10</span>
            }
          >
            {reservation.halfHour.period}
          </SelectItem>
        ))}
      </SelectGroup>
    );
  }
}

function FormattedDate({ date }: { date: Date }) {
  const { i18n } = useTranslation('reservation');

  const formattedDate = formatDate(date, 'PPPP', {
    locale: i18n.language === 'fr' ? frCA : undefined,
  });

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}
