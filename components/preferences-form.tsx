"use client";
import * as React from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CircleCheckBig, CircleX, DollarSign, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Truck } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import worker from "@/components/assets/warehouse-worker.svg";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeIcon } from "@radix-ui/react-icons";
import IncentiveAlert from "./incentive-alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import packageOnTheWay from "@/components/assets/picked-up-package.svg";
import Image from "next/image";
import PriorityAlert from "./priority-alert";
import { savePreferences } from "@/lib/db/preferences";

export default ({
  preloadedPreferences: prevPreferences,
  regions = [],
  redirectTo = null,
  backButton = false,
  user: loggedUser,
  choosed_station,
  priorityAlert = false,
  incentiveAlert = false,
}) => {
  const checks =
    loggedUser.vehicle === "MOTO"
      ? [
          "Bota de segurança com certificado de aprovação",
          "Colete Refletivo",
          "Alforje ou Baú fechado com capacidade mínima de 80L",
        ]
      : ["Bota de segurança com certificado de aprovação", "Colete Refletivo"];

  const router = useRouter();

  const { toast } = useToast();

  const [loading, setLoading] = React.useState(false);
  const [checked, setChecked] = React.useState([]);

  const [cascadeState, setCascade] = React.useState(true);
  const [values, setValues] = React.useState(
    prevPreferences.length > 0
      ? prevPreferences.map((pref) => ({
          id: pref.id,
          value: `${pref.city}_${pref.cep}`,
          label: `CEP - ${pref.cep}-XXX`,
        }))
      : Array.from(Array(3).keys()).map((v, idx) => ({
          id: `new-${idx}`,
          value: "",
          label: "",
        }))
  );

  const form = useForm();

  const preferences = React.useMemo(
    () =>
      values.map(({ value, id }) => {
        const [city, cep] = value.split("_");

        const priority = regions
          .filter((r) => !!r.priority)
          .find((r) => r.value.split("_")[1] == cep);

        return { id, cep, city, priority: priority?.priority || "" };
      }),
    [values]
  );

  const onSubmit = React.useCallback(
    async function onSubmit() {
      try {
        setLoading(true);

        await savePreferences(
          preferences.map((pref) => ({
            driver_id: loggedUser.driverId.toString(),
            driver_name: loggedUser.driverName,
            phone: loggedUser.phone.toString(),
            station: choosed_station,
            vehicle: loggedUser.vehicle,
            city: pref.city,
            cep: pref.cep,
          })),
          choosed_station
        );

        toast({
          icon: (
            <CircleCheckBig color="hsl(var(--green))" height={48} width={48} />
          ),
          title: "Pronto!",
          description: "Suas preferências foram salvas!",
        });

        if (!!redirectTo) {
          router.push(redirectTo);
          return;
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast({
          icon: <CircleX height={48} width={48} />,
          title: "Ops!",
          description: "Algo deu errado.",
        });
        console.log(err);
      }
    },
    [preferences]
  );
  return (
    <Card >
      <CardHeader>
        <CardTitle className="flex gap-4 items-center">
          <MapPin height={32} width={32} /> Áreas de entrega
        </CardTitle>

        <CardDescription className="mb-4">
          Aqui você pode informar quais áreas você prefere realizar entrega.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {incentiveAlert &&
        regions.filter((location) => location.incentive != "").length > 0 ? (
          <IncentiveAlert callback={"/primeira-entrega/preferencias"} />
        ) : null}

        {priorityAlert &&
        regions.filter((location) => location.priority != "").length > 0 ? (
          <PriorityAlert callback={"/primeira-entrega/preferencias"} />
        ) : null}
        <CardDescription className="mb-4 ">
          Selecione pelo menos 3 áreas de preferência
        </CardDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 "
            id="preferences"
          >
            <Fade cascade={cascadeState} damping={0.1} triggerOnce>
              {values.map(({ id, value, label }) => {
                return (
                  <FormField
                    control={form.control}
                    name={value}
                    render={({ field }) => {
                      return (
                        <div className="flex w-full">
                          <FormItem className="w-full" id={id}>
                            <FormControl>
                              <Select
                                className="w-full "
                                id={`select${id}`}
                                value={value}
                                onValueChange={(a) =>
                                  setValues((state) => {
                                    const newState = state.map((toChange) => {
                                      if (toChange.id == id) {
                                        const labelArr = a.split("_");
                                        return {
                                          ...toChange,
                                          value: a,
                                          label: `${labelArr[1]}-${labelArr[0]}`,
                                        };
                                      }
                                      return toChange;
                                    });
                                    return newState;
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione uma área" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    ...new Set(
                                      regions
                                        .sort((a, b) => {
                                          if (!!a.priority && !b.priority) {
                                            return -1;
                                          }
                                          if (!a.priority < !!b.priority) {
                                            return 1;
                                          }

                                          return 0;
                                        })
                                        .sort((a, b) => {
                                          if (a.incentive > b.incentive) {
                                            return -1;
                                          }
                                          if (a.incentive < b.incentive) {
                                            return 1;
                                          }

                                          return 0;
                                        })
                                        .map(({ value }) => {
                                          return value.split("_");
                                        })
                                        .map((a) => a[0])
                                    ),
                                  ].map((city) => {
                                    const incentives = regions
                                      .filter(
                                        (region) =>
                                          region.value.split("_")[0] == city
                                      )
                                      .filter((region) => !!region.incentive);

                                    const priority = regions
                                      .filter(
                                        (region) =>
                                          region.value.split("_")[0] == city
                                      )
                                      .filter((region) => !!region.priority);
                                    return (
                                      <SelectGroup>
                                        {priority.length > 0 ? (
                                          <SelectLabel className="sticky top-[-5px] px-4 py-3 z-[51] ">
                                            <Badge>
                                              {incentives.length > 0 ? (
                                                <DollarSign />
                                              ) : (
                                                <Truck />
                                              )}
                                              {city}
                                            </Badge>
                                          </SelectLabel>
                                        ) : (
                                          <SelectLabel className="sticky top-[-5px] px-4 py-3 z-[51] bg-[white]">
                                            {city}
                                          </SelectLabel>
                                        )}

                                        {regions
                                          .filter(
                                            (region) =>
                                              region.value.split("_")[0] == city
                                          )
                                          .sort((a, b) => {
                                            if (!!a.priority && !b.priority) {
                                              return -1;
                                            }
                                            if (!a.priority < !!b.priority) {
                                              return 1;
                                            }

                                            return 0;
                                          })
                                          .sort((a, b) => {
                                            if (a.incentive > b.incentive) {
                                              return -1;
                                            }
                                            if (a.incentive < b.incentive) {
                                              return 1;
                                            }

                                            return 0;
                                          })

                                          .map((region) => {
                                            return (
                                              <SelectItem
                                                disabled={
                                                  values.findIndex(
                                                    (value) =>
                                                      value.value ==
                                                      region.value
                                                  ) >= 0
                                                }
                                                value={region.value}
                                                className="flex justify-between items-center"
                                              >
                                                {region.incentive ? (
                                                  <Badge >
                                                    {region.incentive}
                                                  </Badge>
                                                ) : null}{" "}
                                                {region.priority &&
                                                !region.incentive ? (
                                                  <Badge variant="default">
                                                    <Truck
                                                      height={15}
                                                      width={15}
                                                    />
                                                  </Badge>
                                                ) : null}{" "}
                                                {region.label}
                                              </SelectItem>
                                            );
                                          })}
                                      </SelectGroup>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            
                          </FormItem>
                          <Button
                           
                            variant="outliner"
                            type="button"
                            disabled={values.length <= 3}
                            onClick={() =>
                              setValues((state) => {
                                return state.filter(
                                  (toDelete) => toDelete.id !== id
                                );
                              })
                            }
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    }}
                  />
                );
              })}
            </Fade>
          </form>
        </Form>
        <div className="flex justify-center">
          <Button
            onClick={() =>
              setValues((state) => {
                setCascade(false);
                const newState = [
                  ...state,
                  {
                    id: (Object.keys(state).length + 1).toString(),
                    value: "",
                  },
                ];

                return newState;
              })
            }
            variant="outliner"
            className="rounded-full"
          >
            <PlusCircledIcon className="h-6 w-6  " />
          </Button>
        </div>
      </CardContent>
      <CardFooter
        className={`flex ${backButton ? "justify-between" : "justify-end"}`}
      >
        {backButton ? (
          <Button onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
        ) : null}

        <Dialog>
          <DialogTrigger>
            <Button disabled={values.filter((v) => v.value != "").length < 3}>
              Salvar Alterações
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sua segurança é nossa prioridade!</DialogTitle>
              <DialogDescription>
                Antes de prosseguir, é necessário garantir que você possui os
                equipamentos de segurança obrigatórios!{" "}
                <strong>
                  Sem esses itens, não será permitida a entrada nas instalações!
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
                    form="preferences"
                    disabled={
                      values.findIndex((v) => v.value == "") > -1 ||
                      !(checked.length == checks.length)
                    }
                  >
                    {loading ? (
                      <ReloadIcon className="mx-12 h-4 w-4 animate-spin" />
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </DialogFooter>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

     
      </CardFooter>
    </Card>
  );
};
