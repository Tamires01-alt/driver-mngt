import { auth } from "@/auth";
import HomeOwnFlex from "@/components/home-ownflex";
import HomeLm from "@/components/home-lm";
import { getPreferences } from "@/lib/db/preferences";
import { getAvailability } from "@/lib/db/bookings";
import { Badge } from "@/components/ui/badge";
import { getCurrentMode } from "@/lib/getCurrentMode";
import { getAllocations } from "@/lib/db/allocations";

export default async function DriverPanel() {
  const session = await auth();
  const driverFirstName = session?.user.driverName.split(" ")[0];

  const { choosed_station, mode, options } = await getCurrentMode();
  const [preferences, bookings, allocations] = await Promise.all([
    getPreferences(session?.user.driverId.toString(), choosed_station),
    getAvailability(session?.user.driverId.toString(), choosed_station),
    getAllocations(),
  ]);

  const pendencias = [];
  if (bookings.length == 0) {
    pendencias.push("Disponibilidade");
  }

  if (preferences.length < 5) {
    pendencias.push("Preferências");
  }

  if (allocations?.length > 0) {
    pendencias.push("Rotas");
  }
  if (mode === "OF") {
    return (
      <div className="h-full relative">
        <Badge
          id="ownflex-badge"
          className="absolute top-2 right-2 text-sm font-medium font-bold italic"
        >
          Flex
        </Badge>
        <HomeOwnFlex
          allocations={allocations}
          driverFirstName={driverFirstName}
          choosed_station={choosed_station}
          pendencias={pendencias}
          largePackagesCard={(session?.user.vehicle as string).includes(
            "FIORINO"
          )}
          options={options}
        />
        <div className="h-[64px]"></div>
      </div>
    );
  }

  // const station = session?.user.station;

  // // const locations = await getLocations(station);

  return (
    <>
      <HomeLm
        driverFirstName={driverFirstName}
        pendencias={[...pendencias, "Learning", "EPI"]}
      />
    </>
  );
}
