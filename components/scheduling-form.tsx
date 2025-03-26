"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { CircleCheckBig, CircleX, Calendar, Sun, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { confirmAvailability } from "@/lib/actions/booking-action";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { isLaterThan } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import DateCheckbox from "./date-checkbox";
import { motion } from "framer-motion";
import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import worker from "@/components/assets/warehouse-worker.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface SchedulingProps {
  dates: Array<{
    value: string;
    formatted: string;
    name: string;
    instance: string;
  }>;
  preloadedBookings: any;
  station: string;
}

interface FormValues {
  [key: string]: {
    AM: boolean;
    PM: boolean;
    SD: boolean;
  };
}

export default function Scheduling({
  dates,
  prevBookings,
  shiftsOptions,
  station,
  ownflex,
  checks,
}: SchedulingProps) {
  const { toast } = useToast();
  const [checked, setChecked] = React.useState([]);

  const form = useForm<FormValues>({
    defaultValues: dates.reduce((acc, date) => {
      const prevBooking = prevBookings.find(
        (prev) =>
          new Date(prev.date).getDate() === new Date(date.value).getDate()
      );

      acc[date.value] = {
        AM: prevBooking?.info.includes("AM") || false,
        PM: prevBooking?.info.includes("PM") || false,
        SD: prevBooking?.info.includes("SD") || false,
      };
      return acc;
    }, {} as FormValues),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      await confirmAvailability(values, dates, station, ownflex);
      toast({
        icon: (
          <CircleCheckBig color="hsl(var(--green))" height={48} width={48} />
        ),
        title: "Pronto!",
        description: "Você confirmou sua disponibilidade!",
      });
    } catch (err) {
      console.error(err);
      toast({
        icon: <CircleX height={48} width={48} />,
        title: "Ops!",
        description: "Algo deu errado.",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id="disponibilidade"
        className="max-w-3xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {dates.map((date, idx) => {
            // const filteredShifts = shiftsOptions.filter((shift) => {
            //   if (!shift.limit) {
            //     return true;
            //   }

            //   return (
            //     new Date(date.value).getDate() == new Date().getDate() &&
            //     isLaterThan(shift.limit)
            //   );
            // });

            return (
              <motion.div
                key={date.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <Calendar className="mr-3 text-primary w-16 h-16" />
                    <FormLabel className="text-2xl font-semibold text-primary">
                      {date.formatted}
                    </FormLabel>
                  </div>
                  <div className="flex flex-col gap-2">
                    {shiftsOptions.map(
                      ({ id, description, exclude = [], limit }) => {
                        const dateObj = new Date(date.value);

                        const dateLimit = dateObj;

                        if (!!limit) {
                          dateLimit.setDate(
                            new Date(date.value).getDate() + limit.d
                          );
                          dateLimit.setHours(limit.h, 0, 0, 0);
                        }

                        if (exclude.includes(dateObj.getDay())) {
                          return null;
                        }

                        return (
                          <Controller
                            key={id}
                            name={`${date.value}.${id}`}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <DateCheckbox
                                    disabled={new Date() >= dateLimit}
                                    text={description}
                                    id={`${date.name}.${id}`}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="min-w-16 h-16 text-xl"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        );
                      }
                    )}
                  </div>
                </div>
                {idx < dates.length - 1 && <Separator className="my-8" />}
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: dates.length * 0.1 }}
            className="flex justify-center mt-12"
          ></motion.div>
        </motion.div>
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Confirmar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sua segurança é nossa prioridade!</DialogTitle>
                <DialogDescription>
                  Antes de prosseguir, é necessário garantir que você possui os
                  equipamentos de segurança obrigatórios!{" "}
                  <strong>
                    Sem esses itens, não será permitida a entrada nas
                    instalações!
                  </strong>
                  <div className="flex justify-center items-center">
                    <Image src={worker} width={120} className="tra" />
                    <div className="gap-4 flex flex-col justify-start items-start">
                      {checks.map((c, idx) => (
                        <div className="flex gap-2 w-full">
                          <Checkbox
                            id={idx}
                            value={c}
                            onCheckedChange={(value) => {
                              if (value) {
                                setChecked((state) => [...state, c]);
                              } else {
                                setChecked((state) =>
                                  state.filter((v) => v != c)
                                );
                              }
                            }}
                          />
                          <Label className="text-left" for={idx}>
                            {c}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      form="disponibilidade"
                      disabled={
                        !(checked.length == checks.length) || isSubmitting
                      }
                    >
                      {isSubmitting ? (
                        <ReloadIcon className="mx-12 h-4 w-4 animate-spin" />
                      ) : (
                        "Confirmar disponibilidade"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </Form>
  );
}
