import SchedulingForm from "@/components/scheduling-form";
import { fetchDates } from "@/lib/getEvents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getAvailability } from "@/lib/db/bookings";
import { Separator } from "@/components/ui/separator";
import { getPreferences } from "@/lib/db/preferences";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

import { getCurrentMode } from "@/lib/getCurrentMode";
import {
  OwnFlexShifts,
  LastMileShifts,
  FirstTripShifts,
} from "@/components/assets/shifts";

const getShifts = (mode: string, trips: number) => {
  if (mode === "OF") {
    return OwnFlexShifts;
  }
  return trips > 0 ? LastMileShifts : FirstTripShifts;
};

export default async function Disponibilidade() {
  const session = await auth();

  const dates = await fetchDates();

  const { choosed_station, mode, options } = await getCurrentMode();

  const preferences = await getPreferences(
    session?.user.driverId.toString(),
    choosed_station
  );

  if (preferences.length < (mode === "OF" ? 5 : 3)) {
    return (
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Você ainda não preencheu suas preferências!
            </DialogTitle>
            <DialogDescription>
              Para informar sua disponibilidade, é preciso escolher suas regiões
              de preferência.
            </DialogDescription>

            <DialogFooter>
              <Link href="/driver-panel/preferencias">
                <Button>Ir para preferências</Button>
              </Link>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const prevBookings = await getAvailability(
    session?.user.driverId.toString(),
    choosed_station
  );

  if (!(dates.length > 0)) {
    redirect("/driver-panel");
  }

  let shiftsOptions = getShifts(mode, session?.user.trips);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilidade</CardTitle>
        <CardDescription className="flex flex-col gap-4">
          <div>
            Informe sua disponibilidade para os próximos 3 dias de carregamento.
            Você pode selecionar quantos dias e horários quiser.{" "}
            <strong>Se não puder comparecer, por favor, desmarque!</strong>
          </div>
          <Separator className="my-2" />
          Escolha quais turnos e datas você gostaria de carregar abaixo:
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <SchedulingForm
          dates={dates}
          shiftsOptions={shiftsOptions}
          prevBookings={prevBookings.filter(
            (booking) => booking.station == choosed_station
          )}
          station={choosed_station}
          ownflex={mode === "OF" ? true : false}
        />
      </CardContent>
    </Card>
  );
}
