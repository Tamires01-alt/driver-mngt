import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getDescription } from "@/lib/utils";
import learning from "@/components/assets/learning.mp4";

import TodoAlert from "./todo-alert";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteAllocation } from "@/lib/db/allocations";
import CancelAllocationDialog from "./cancel-allocation-dialog";

export default function OnboardingOwnFlex({ pendencias = [] }) {
  return (
    <>
      <TodoAlert amount={pendencias.length} />
      <Accordion type="single" collapsible>
        {pendencias.includes("Learning") && (
          <AccordionItem value="preferences">
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
              Você foi escalado para realizar entregas nos seguintes horários:
              <video controls>
                <source
                  src={learning} //"https://drive.google.com/uc?export=download&id=1jwHYF2zvA3GvumeYyWdbQ2m-pW1-iRr1"
                  type="video/mp4"
                />
              </video>
              <span className="font-bold">Contamos com a sua presença!</span>
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
