import { Card } from "@/components/ui/card";
import MapComponent from "@/components/map-container";
import { auth } from "@/auth";
import { getClusters } from "@/lib/db/clusters";
import { redirect } from "next/navigation";
import { getPrevClusters } from "@/lib/db/clusters";
import { getHubInfo } from "@/gsheets/locations";
import { OptionsForm } from "@/components/ownflex-options-form";

export default async function OwnFlexPrefsForm({ defaultOptions }) {
  const session = await auth();

  // const preloadedPreferences = await getPreferences(
  //   session?.user.driverId.toString()
  // );

  const clusters = await getClusters(session?.user.station);
  if (clusters.length == 0) {
    redirect("/primeira-entrega/preferencias");
  }
  const hubInfo = await getHubInfo(session?.user.station);

  const prevClusters = await getPrevClusters(session?.user.driverId.toString());

  return (
    <Card className="m-0 p-0">
      <MapComponent
        defaultOptions={defaultOptions}
        serverSession={session}
        closed={[]}
        clusters={clusters.map((cluster) => ({
          ...cluster,
          zone_detail: JSON.parse(cluster.zone_detail),
        }))}
        center={[hubInfo.latitude, hubInfo.longitude]}
        defaultClusters={prevClusters.map((cluster) => cluster.cep)}
        style={{ width: "100%", height: "75vh", borderRadius: "0.8rem" }}
      />
    </Card>
  );
}
