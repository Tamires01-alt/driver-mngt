import OnboardingOwnFlex from "@/components/onboarding-ownflex";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignoutButton from "@/components/signout-button";
import { auth } from "@/auth";
import StaticMap from "./static-map";
import { getCurrentMode } from "@/lib/getCurrentMode";
import { Suspense } from "react";
import { Spinner } from "./spinner";
import { AlertTitle, Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import HubSelection from "@/components/hub-select";
import OnboardingLm from "./onboarding-lm";

const formatHub = (hub) => {
  if (!hub) return;

  return hub.split("_")[2];
};

export default async function HomeLm({ driverFirstName }) {
  const { choosed_station, options, mode } = await getCurrentMode();
  const session = await auth();
  const station = session.user.station;

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Olá, {driverFirstName}!</CardTitle>
        <CardDescription>
          Que bom ter você aqui! <br />
          Aqui é onde você encontrará informações sobre a sua jornada como
          motorista parceiro Shopee. <br />
          Além disso, você poderá{" "}
          <strong>selecionar suas preferências de entrega </strong>e confirmar
          sua <strong>disponibilidade diariamente</strong>. <br />
        </CardDescription>

        {session?.user.ownflex ? (
          <Alert variant={"secondary"} className="space-y-2">
            <AlertTitle className="font-bold flex gap-2 items-center">
              <TriangleAlert className="animate-pulse" />
              Atenção!
            </AlertTitle>

            <AlertDescription>
              Para alterar sua modalidade, selecione o hub desejado:
            </AlertDescription>

            <HubSelection
              defaultValue={mode == "OF" ? choosed_station : "LM"}
              currentOptions={options}
              options={[
                { key: "LM", label: station.split("_")[2] },
                { key: "OF Hub_SP_Lapa", label: "Entrega Rápida - Lapa" },
              ]}
            />
          </Alert>
        ) : null}

        <OnboardingLm pendencias={["Learning"]} />
      </CardHeader>

      <CardContent className="space-y-6">
        <Suspense fallback={<Spinner />}>
          <StaticMap title={formatHub(choosed_station)} />
        </Suspense>
        <div className="flex justify-end">
          <SignoutButton />
        </div>
      </CardContent>
    </Card>
  );
}
