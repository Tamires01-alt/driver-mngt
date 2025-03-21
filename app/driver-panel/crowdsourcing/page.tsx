import { auth } from "@/auth";
import  MapComponent from "@/app/components/crowdsourcing/contentCrowndsourcingMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOpenOffers } from "@/lib/db/offers";
import { getClusters } from "@/lib/db/clusters";
import { getHubInfo } from "@/gsheets/locations";
import { getAllocations } from "@/lib/db/allocations";
import { getCurrentMode } from "@/lib/getCurrentMode"
import { Badge } from "@/components/ui/badge";
import { HandshakeIcon, TriangleAlertIcon } from "lucide-react";
import { getDescription } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function Preferences() {
  const session = await auth();
  const crowdSourcing = await getOpenOffers();
  const { choosed_station } = await getCurrentMode();
  const hubInfo = await getHubInfo(choosed_station);
  const clusters = await getClusters(choosed_station);
  const currentSelection = await getAllocations();


  // console.log("GETTTT CLUSTER", clusters)
  console.log("GETTTT crowdSourcing", crowdSourcing)



  const chosenCluster = currentSelection.flatMap((curr) =>
    clusters
      .map((cluster) => ({
        ...cluster,
        zone_detail: JSON.parse(cluster.zone_detail),
      }))
      .filter((c) => curr?.offer?.cluster === c.zone_id)
  );


  const bonds = chosenCluster.map((b) =>
    b.zone_detail.coordinates.map((tuple) => tuple.map(([lat, lon]) => [lon, lat]))
  );


  if (crowdSourcing.length === 0 && currentSelection.length > 0) {
    return (
      <Card className="m-0 p-0">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center gap-2">
            <HandshakeIcon height={36} width={48} />
            <div className="flex flex-col gap-1 w-[80%]">
              <span className="font-bold">Rotas confirmadas:</span>
              <div className="flex flex-col gap-2">
                {currentSelection.map((a) => (
                  <div key={a.offer.id} className="flex border rounded-full pr-4 drop-shadow-md w-[90%]">
                    <Badge className="font-bold">{a.offer.cluster}</Badge>
                    <span>{getDescription(a)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <MapComponent
          serverSession={session}
          clusters={chosenCluster}
          center={[hubInfo.latitude, hubInfo.longitude]}
          bonds={bonds}
          choosed_station={choosed_station}
          disableSelection
          style={{ width: "100%", height: "75vh", borderRadius: "0.8rem" }}
        />
      </Card>
    );
  }


  const availableShifts = {
    AM: !currentSelection.some((s) => s.offer.shift === "AM"),
    PM: !currentSelection.some((s) => s.offer.shift === "PM"),
  };


  const filteredClusters = clusters
    .filter((c) => crowdSourcing.some((a) => a.cluster === c.zone_id))
    .map((cluster) => ({
      ...cluster,
      zone_detail: JSON.parse(cluster.zone_detail),
    }));


    
//     if (filteredClusters.length === 0) {
//     filteredClusters.push({
//         zone_base_id: 9448,
//         zone_id: 'T-13',
//         zone_name: 'T-13',
//         station_id: 999,
//         station_name: 'OF Hub_SP_Lapa',
//         zone_detail: '{"type":"Polygon","coordinates":[[[-46.4905073,-23.5049805],[-46.4918906,-23.5049805],[-46.4918906,-23.5043283],[-46.493274,-23.5043283],[-46.493274,-23.5036762],[-46.4946573,-23.5036762],[-46.4946573,-23.503024],[-46.4960407,-23.503024],[-46.4960407,-23.5023719],[-46.497424,-23.5023719],[-46.497424,-23.5017198],[-46.4988073,-23.5017198],[-46.4988074,-23.5010676],[-46.5001907,-23.5010676],[-46.5001907,-23.5004155],[-46.5020352,-23.5004155],[-46.5020352,-23.4997634],[-46.5034185,-23.4997634],[-46.5034185,-23.4991112],[-46.5048018,-23.4991112],[-46.5048018,-23.4984591],[-46.5061852,-23.4984591],[-46.5061852,-23.4978069],[-46.5075685,-23.4978069],[-46.5075685,-23.4971548],[-46.5089519,-23.4971548],[-46.5089519,-23.4965027],[-46.5103352,-23.4965027],[-46.5103352,-23.4958505],[-46.5117186,-23.4958505],[-46.5117186,-23.4951984],[-46.5131019,-23.4951984],[-46.5131019,-23.4938941],[-46.513563,-23.4938941],[-46.513563,-23.4919377],[-46.5140241,-23.4919377],[-46.5140241,-23.4906334],[-46.5144853,-23.4906334],[-46.5144853,-23.488677],[-46.5149464,-23.488677],[-46.5149464,-23.4867206],[-46.5154075,-23.4867206],[-46.5154075,-23.4854163],[-46.5158686,-23.4854163],[-46.5158686,-23.4834599],[-46.5163297,-23.4834599],[-46.5163297,-23.4815035],[-46.5167908,-23.4815035],[-46.5167908,-23.4814432],[-46.516433,-23.481273],[-46.515677,-23.480955],[-46.51465,-23.480537],[-46.514169,-23.4803308],[-46.513864,-23.4802],[-46.513522,-23.480099],[-46.513161,-23.479969],[-46.512935,-23.479867],[-46.512652,-23.479722],[-46.512335,-23.479508],[-46.511708,-23.479071],[-46.511472,-23.478922],[-46.511303,-23.478861],[-46.511097,-23.478792],[-46.510593,-23.478746],[-46.509854,-23.478709],[-46.509406,-23.478674],[-46.508796,-23.478585],[-46.507791,-23.478421],[-46.507241,-23.478303],[-46.506487,-23.478099],[-46.505893,-23.477907],[-46.504942,-23.477664],[-46.504362,-23.477519],[-46.503809,-23.477398],[-46.503384,-23.477324],[-46.502986,-23.477268],[-46.501824,-23.47716],[-46.501095,-23.477079],[-46.500309,-23.477033],[-46.5000339,-23.4770152],[-46.4999853,-23.4770121],[-46.499984,-23.477012],[-46.4999357,-23.4770089],[-46.499526,-23.476983],[-46.498888,-23.47694],[-46.498398,-23.47688],[-46.497801,-23.476763],[-46.497083,-23.476595],[-46.496378,-23.476402],[-46.49598,-23.476315],[-46.495717,-23.476275],[-46.495214,-23.476213],[-46.494455,-23.476101],[-46.49407,-23.476024],[-46.493825,-23.475996],[-46.49365,-23.475999],[-46.493447,-23.476033],[-46.493117,-23.476138],[-46.492665,-23.476327],[-46.491921,-23.47663],[-46.491589,-23.476747],[-46.4914295,-23.4767934],[-46.4914295,-23.4769385],[-46.4909684,-23.4769385],[-46.4909684,-23.4795471],[-46.4905073,-23.4795471],[-46.4905073,-23.4815035],[-46.4900462,-23.4815035],[-46.4900462,-23.4834599],[-46.4895851,-23.4834599],[-46.489585,-23.4854163],[-46.4891239,-23.4854163],[-46.4891239,-23.4873727],[-46.4886628,-23.4873727],[-46.4886628,-23.4893292],[-46.4882017,-23.4893292],[-46.4882017,-23.4912856],[-46.4877406,-23.4912856],[-46.4877406,-23.4938941],[-46.4872795,-23.4938941],[-46.4872795,-23.4958505],[-46.4868184,-23.4958505],[-46.4868184,-23.4978069],[-46.4863572,-23.4978069],[-46.4863572,-23.4997634],[-46.4868184,-23.4997634],[-46.4868184,-23.5056326],[-46.4877406,-23.5056326],[-46.4877406,-23.5062847],[-46.4891239,-23.5062847],[-46.4891239,-23.5056326],[-46.4905073,-23.5056326],[-46.4905073,-23.5049805]]]}'
//     });
// }



  const bondsSelection = filteredClusters.map((cluster) =>
    cluster.zone_detail.coordinates.map((tuple) => tuple.map(([lat, lon]) => [lon, lat]))
  );


  console.log("GETTTT filteredClusters", filteredClusters)


  if (filteredClusters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TriangleAlertIcon height={48} width={48} />
            Volte mais tarde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            No momento não existem rotas disponíveis para selecionar. Por favor, tente mais tarde.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link href="/driver-panel">
            <Button>Voltar para Início</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }


  return (
    <Card className="bg-white w-full h-auto p-3 rounded-md flex gap-2 flex-col md:w-96">
      <div className="m-auto p-1">
        <div className="flex gap-4 items-center">
          <TriangleAlertIcon height={36} width={36} />
          <span className="font-bold max-w-[80%]">
            Temos rotas disponíveis para as regiões abaixo. Escolha a sua e garanta sua corrida!
          </span>
        </div>
      </div>
      <MapComponent
        serverSession={session}
        availableShifts={availableShifts}
        clusters={filteredClusters}
        crowdSourcing={crowdSourcing}
        bonds={bondsSelection}
        center={[hubInfo.latitude, hubInfo.longitude]}
        choosed_station={choosed_station}
        style={{ width: "100%", height: "75vh", borderRadius: "0.8rem" }}
      />
    </Card>
  );
}



