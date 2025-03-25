import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import learning from "@/components/assets/learning.gif";

import TodoAlert from "./todo-alert";

export default function OnboardingOwnFlex({ pendencias = [] }) {
  return (
    <>
      <TodoAlert amount={pendencias.length} />
      <Accordion type="single" collapsible>
        {pendencias.includes("Learning") && (
          <AccordionItem value="learning">
            <AccordionTrigger className="text-xl">
              <span className="flex justify-start items-center gap-4">
                <TriangleAlert
                  size={36}
                  className="animate-pulse"
                  color="#EE4D2D"
                />
                Treinamento Online
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <span>
                Para acessar o treinamento, abra o seu{" "}
                <strong>App Driver</strong> e siga os passos abaixo:
              </span>
              <Image
                src={learning}
                alt="Treinamento Online"
                width={500}
                height={300}
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {pendencias.includes("EPI") && (
          <AccordionItem value="epi">
            <AccordionTrigger className="text-xl">
              <span className="flex justify-start items-center gap-4">
                <TriangleAlert
                  size={36}
                  className="animate-pulse"
                  color="#EE4D2D"
                />
                Equipamentos
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              <span>
                Sua segurança é nossa prioridade! Garanta que você possui os
                equipamentos informados no treinamento. Sem eles não será
                possível realizar entregas!
              </span>
            </AccordionContent>
          </AccordionItem>
        )}
        {pendencias.includes("Preferências") && (
          <AccordionItem value="preferences">
            <AccordionTrigger className="text-xl">
              <span className="flex justify-start items-center gap-4">
                <TriangleAlert size={36} className="animate-pulse" />
                Regiões de Entrega
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              Você pode selecionar quantas regiões quiser. Quanto mais regiões
              selecionadas, maior a chance de terem rotas disponíveis para você.
              <Link href="/driver-panel/preferencias">
                <Button>Selecionar minha preferência</Button>
              </Link>
            </AccordionContent>
          </AccordionItem>
        )}
        {pendencias.includes("Disponibilidade") && (
          <AccordionItem value="availability">
            <AccordionTrigger className="text-xl">
              <span className="flex justify-start items-center gap-4">
                <TriangleAlert size={36} className="animate-pulse" />
                Disponibilidade
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4">
              Informe sua disponibilidade para os próximos 3 dias de
              carregamento. Você pode selecionar quantos dias e horários quiser.{" "}
              <strong>Se não puder comparecer, por favor, desmarque!</strong>
              <Link href="/driver-panel/disponibilidade">
                <Button>Informar disponibilidade</Button>
              </Link>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </>
  );
}
