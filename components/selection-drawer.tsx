"use client";
import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useClusters } from "@/hooks/useClusters";
import { useToast } from "@/hooks/use-toast";
import { CircleX, CircleCheckBig } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { savePreferences } from "@/lib/db/clusters";

export const SelectionDrawer = ({ serverSession }) => {
  const { selected, setSelected, closeBtn } = useClusters();
  const [loading, setLoading] = React.useState();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = React.useCallback(async () => {
    setLoading(true);

    try {
      await savePreferences(selected, serverSession.user);

      toast({
        icon: (
          <CircleCheckBig color="hsl(var(--green))" height={48} width={48} />
        ),
        title: "Pronto!",
        description: "Sua preferência foi salva!",
      });

      router.push(
        serverSession.user.trips > 0 ||
          serverSession.user.station == "LM Hub_SP_São Paulo_Mooca"
          ? "/driver-panel"
          : "/primeira-entrega/data"
      );
    } catch (err) {
      console.log("Erro", err);
      setLoading(false);

      toast({
        icon: <CircleX height={48} width={48} />,
        title: "Ops!",
        description: "Algo deu errado.",
      });
    }
  }, [selected]);

  return (
    <Drawer
      onClose={() => {
        closeBtn();
      }}
      
    >
      <DrawerTrigger asChild >
        <Button className=" fixed bottom-20 right-4 z-50 shadow-lg rounded-full bg-green-600 hover:bg-green-600 text-white p-3 w-16 h-16 flex items-center justify-center">
          <CircleCheckBig className="w-12 h-12" />
        </Button>
      </DrawerTrigger>
      {selected.length > 0 ? (
        <>
          <DrawerContent className="max-w-screen-sm mx-auto">
            <DrawerHeader>
              <DrawerTitle>
                Gostaria de selecionar essas regiões como regiões de
                preferência?
              </DrawerTitle>
              <DrawerDescription>
                <strong>
                  Consideraremos que você gostaria de realizar entregas em toda
                  regiões destacada no mapa.
                </strong>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button onClick={onSubmit}>
                {loading ? (
                  <ReloadIcon className="mx-12 h-4 w-4 animate-spin" />
                ) : (
                  "Confirmar"
                )}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </>
      ) : (
        <>
          <DrawerContent className="max-w-screen-sm mx-auto">
            <DrawerHeader>
              <DrawerTitle>Por favor, escolha ao menos uma região</DrawerTitle>
              <DrawerDescription>
                Selecione regiões que gostaria de realizar entregas clicando no
                mapa.
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </>
      )}
    </Drawer>
  );
};
