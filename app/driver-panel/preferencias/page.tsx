import PreferencesForm from "@/components/preferences-form";
import SelectCep from "@/app/components/preference/selectCep"
import { auth } from "@/auth";
import { MapPin } from "lucide-react";
import { getPreferences } from "@/lib/db/preferences";
import { getLocations } from "@/gsheets/locations";
import { redirect } from "next/navigation";
import { getCurrentMode } from "@/lib/getCurrentMode";

// function formatCep(input) {
//   let number = input.toString();

//   if (number.length === 7) {
//     number = "0" + number;
//   }
//   return number.slice(0, 5) + "-" + number.slice(5);
// }





export default async function Preferences() {
  const session = await auth();

  const { choosed_station, mode } = await getCurrentMode();

  if (mode === "OF" || session?.user?.station == "LM Hub_SP_São Paulo_Mooca") {
    redirect("/driver-panel/clusters");
  }

  const preferences = await getPreferences(
    session?.user.driverId.toString(),
    choosed_station
  );


  const locations = await getLocations(choosed_station);

  // console.log("session", session)
  // console.log("choosed_station", choosed_station)
  // console.log("mode", mode)
  // console.log("preferences", preferences)
  // console.log("locations", locations)




  const cepOptions = locations.map((location) => ({
    value: `${location.cep5}`,
    label: `CEP - ${location.cep5}-XXX`,
  }));



  return (
    <div className="mb-20 flex flex-col gap-5">
      <SelectCep
        options={cepOptions}
        descriptionCard="Selecione pelo menos 3 áreas de preferência"
        city={locations.length > 0 ? locations[0].buyer_city : "Cidade não disponível"}
        driverId={session?.user?.driverId}
        driverName={session?.user?.driverName}
        phone={session?.user?.phone}
        station={session?.user?.station}
        vehicle={session?.user?.vehicle}
        redirectTo={"/driver-panel"}
        choosed_station={choosed_station}
      />
      {/* <PreferencesForm
        incentiveAlert
        user={session?.user}
        choosed_station={choosed_station}
        redirectTo={"/driver-panel"}
        preloadedPreferences={preferences}
        regions={locations.map((location) => ({
          value: `${location.buyer_city}_${location.cep5}`,
          label: `CEP - ${location.cep5}-XXX`,
          incentive: location.incentive,
          priority: location.priority,
        }))}
      /> */}
    </div>
  );
}
