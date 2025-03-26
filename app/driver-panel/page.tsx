
import { auth } from "@/auth";
import { getClusters } from "@/lib/db/clusters";
import { getHubInfo } from "@/gsheets/locations";
import { getPreferences } from "@/lib/db/preferences";
import { getAvailability } from "@/lib/db/bookings";
import { getAllocations } from "@/lib/db/allocations";
import { getCurrentMode } from "@/lib/getCurrentMode";
import { redirect } from "next/navigation";
import ApresentationDriver from "../components/home/apresentationDriver";
import DriverPendingAlert from "../components/pending/driverPendingAlert";
import StaticMaps from "../components/home/staticMaps";
import DeliveryWindow from "../components/home/deliveryWindow";
import RequiredApplications from "../components/home/requiredApplications";
import SpxExpress from "@/public/spx_express_logo.svg";
import GooglePlay from "@/public/google-play.png";
import Trackage from "@/public/trackage.png";
import InfoHelp from "../components/home/infoHelp";
import { TriangleAlert, Calendar, MapPin, Smartphone } from "lucide-react";
import SelectHub from "../components/home/selectHub";
import { SquarePen, Handshake } from "lucide-react";
import HomeLm from "@/components/home-lm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



export default async function DriverPanel() {
  const session = await auth();
  const driverName = session?.user?.driverName || 'Motorista';


  const { choosed_station, mode, options } = await getCurrentMode();

  const station = session?.user.station;


  const hubInfo = await getHubInfo(choosed_station);


  const prevClusters = await getPreferences(
    session?.user.driverId.toString(),
    choosed_station
  );

  const clusters = await getClusters(choosed_station);
  if (clusters.length == 0) {
    redirect("/driver-panel/preferencias");
  }


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
    const driverTexts = {
      title: `Olá, ${driverName}!`,
      descriptionOne: "Que bom ter você por aqui!",
      descriptionTwo: "Esse é um espaço exclusivo para gerenciar suas regiões de preferência de entrega e sua disponibilidade diária no HUB Entrega Rápida - Lapa."
    };
    const deliveryWindowTexts = {
      title: "Segunda a sábado (domingos são informados previamente)",
      Option1: "Janela 1: 6 às 10h",
      Option2: "Janela 2: 15:30 às 18h"
    };
    const textIndication = {
      title: (
        <>
          Que tal ganhar até <span className="font-bold">R$200</span> por indicar novos
          Motoristas Parceiros? <br />E tem mais:  <span className="font-bold"> seu indicado também ganha R$100</span> após concluir suas
          primeiras 5 rotas.
        </>
      ),

      buttonText: "Indicar um amigo",
      buttonLink: "https://docs.google.com/forms/d/e/1FAIpQLSdbprI-ygYpZv4k2uEkJnV7yHMb3-nTeTLswgEK7ouRUqRdCQ/viewform"

    };
    const textInfoHelp = {
      title: (
        <>
          Acesse o menu inicial do Driver App e clique em <span className="font-bold">Treinamentos</span> ou <span className="font-bold">Central de Ajuda</span> para tirar suas dúvidas!
        </>
      ),
      trainingText: (
        <>
          <span className="font-bold">Treinamentos:</span> guias rápidos e vídeos curtos com as principais dicas para você.
        </>
      ),
      helpCenterText: (
        <>
          <span className="font-bold">Central de Ajuda:</span> tire suas dúvidas de pagamento, nota fiscal, acareação e muito mais.
        </>
      ),
      buttonText: "Acessar Treinamentos",
      buttonLink: "https://forms.gle/o1CmdEY5qNUn5hFJ7"

    };
    const textSelectHub = {
      title: "Atenção!",
      description: "Para alterar sua modalidade, selecione o hub desejado:"
    };
    const hubOptions = [
      { value: "LM", label: station.split("_")[2] },
      { value: "OF Hub_SP_Lapa", label: "Entrega Rápida - Lapa" }
    ];



    return (
      <div className="h-full relative">
        <div className="bg-white w-full h-auto p-3 rounded-md flex gap-2 flex-col md:w-96" >
          <ApresentationDriver {...driverTexts} />
          <SelectHub
            {...textSelectHub}
            icon={TriangleAlert}
            options={hubOptions}
            defaultValue={mode === "OF" ? choosed_station : "LM"}
            currentOptions={options}
          />
          <DriverPendingAlert
            pendencias={pendencias}
            allocations={allocations}
          />
          <CardTitle className="text-2xl text-[#384b8f] mt-10">+ Informações Úteis</CardTitle>
          <Accordion defaultValue="address" type="single" collapsible >
            <AccordionItem value="address">
              <AccordionTrigger className="text-md text-[#384b8f]">
                <span className="flex justify-start items-center gap-4 ">
                  <MapPin size={24} />
                  Endereço Entrega Rápida
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <StaticMaps title={"Entrega"} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="datetime">
              <AccordionTrigger className="text-md text-[#384b8f]">
                <span className="flex justify-start items-center gap-4">
                  <Calendar size={24} />
                  Dias e horário
                </span>
              </AccordionTrigger>

              <AccordionContent>
                <DeliveryWindow  {...deliveryWindowTexts} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="apps">
              <AccordionTrigger className="text-md text-[#384b8f]">
                <span className="flex justify-start items-center gap-4">
                  <Smartphone size={24} />
                  Aplicativos necessários
                </span>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-4">
                <RequiredApplications
                  iconSrc={SpxExpress}
                  iconName="Driver App"
                  description="Aplicativo oficial para Motoristas Parceiros Shopee."
                  link="https://shopee.com.br/m/entregadores-shopee"
                />
                <RequiredApplications
                  iconSrc={GooglePlay}
                  iconName="NexMove"
                  description="Para acessar o galpão (apresentar QR Code na portaria) Clique aqui para instruções de configuração."
                  link="https://play.google.com/store/apps/details?id=nexmove.nexcode"
                />
                <RequiredApplications
                  iconSrc={Trackage}
                  iconName="Motorista Trackage"
                  description="Para controle de filas de carregamento, devolução e descarregamento. Clique aqui para instruções de configuração."
                  link="https://docs.google.com/presentation/d/e/2PACX-1vRCjoOawkPw97Ktq4RP9BskRX8TIXC9Cs84WWmiLxxYfXVLdsneoi0G31ux-rlPoPojuhO4A3nN6KRw/pub?start=true&loop=false&delayms=3000"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <CardTitle className="text-2xl text-[#384b8f] pt-5">+ Ajuda</CardTitle>
          <InfoHelp {...textInfoHelp} icon={SquarePen} />;
          <CardTitle className="text-2xl text-[#384b8f]">+ Indicação</CardTitle>
          <InfoHelp {...textIndication} icon={Handshake} />;
        </div>
        <div className="h-[64px]"></div>
      </div>
    );
  }


  return (
    <>

      <HomeLm driverFirstName={driverName} pendencias={pendencias}/>
      {/* <HomeLm driverFirstName={driverFirstName} pendencias={pendencias} /> */}

    </>
  );
} 