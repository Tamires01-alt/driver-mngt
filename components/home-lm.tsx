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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import { MapPin, Calendar } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const formatHub = (hub) => {
  if (!hub) return;

  return hub.split("_")[2];
};

export default async function HomeLm({ driverFirstName, pendencias }) {
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

        <OnboardingLm pendencias={pendencias} />
      </CardHeader>

      <CardContent className="space-y-6">
        <CardTitle className="text-2xl">+ Informações Úteis</CardTitle>

        <Accordion defaultValue="address" type="single" collapsible>
          <AccordionItem value="address">
            <AccordionTrigger className="text-xl">
              <span className="flex justify-start items-center gap-4">
                <MapPin size={24} />
                Endereço de Coleta
              </span>
            </AccordionTrigger>

            <AccordionContent>
              <Suspense fallback={<Spinner />}>
                <StaticMap title={"Coleta"} />
              </Suspense>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="datetime">
            <AccordionTrigger className="text-xl">
              <span className="flex justify-start items-center gap-4">
                <Calendar size={24} />
                Dias e horário
              </span>
            </AccordionTrigger>

            <AccordionContent>
              <CardDescription className="flex flex-col gap-4">
                <div>
                  Segunda a sábado (domingos são informados previamente)
                </div>
                <div className="flex flex-col gap-2">
                  <div className="font-bold">Janela 1: 6 às 10h </div>
                  <div className="font-bold">Janela 2: 15:30 às 18h</div>
                </div>
              </CardDescription>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* <Suspense fallback={<Spinner />}>
          <StaticMap title={formatHub(choosed_station)} />
        </Suspense> */}

        <div className="flex flex-col gap-4">
          <Link href="https://forms.gle/o1CmdEY5qNUn5hFJ7" target="_blank">
            <Button>
              <div className="flex items-center gap-2 font-bold">
                <SquarePen />
                Alterar dados cadastrais
              </div>
            </Button>
          </Link>

          {/* <Link
            href={`https://wa.me/551128386686?text=Ol%C3%A1%2C%20preciso%20de%20ajuda.%20Sou%20entregador%20OwnFlex%20e%20meu%20id%20%C3%A9%3A%20${session?.user.driverId}`}
            target="_blank"
          >
            <Button variant="whatsapp">
              <div className="flex items-center space-x-2">
                <Image src={Whatsapp} alt="Whatsapp" height={36} width={36} />
                Precisa de Ajuda?
              </div>
            </Button>
          </Link> */}
        </div>
        <div className="flex justify-end">
          <SignoutButton />
        </div>
      </CardContent>
    </Card>
  );
}
