"use client";
import * as React from "react";
import { useMemo, useState, useCallback } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCrowdSourcing } from "@/hooks/useCrowdSourcing";
import { useToast } from "@/hooks/use-toast";
import { CircleX, CircleCheckBig } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { OwnFlexShifts } from "@/components/assets/shifts";
import { createManyAllocations } from "@/lib/db/allocations";

interface SelectionDrawerProps {
  serverSession: any;
  choosed_station: any;
  crowdSourcing: { shift: string; id: string; cluster: number; description: string }[];
  availableShifts: any;
}

export const SelectionDrawer: React.FC<SelectionDrawerProps> = ({
  crowdSourcing = [],
  availableShifts,
}) => {
  const { selected, setSelected } = useCrowdSourcing();
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = useCallback(async () => {
    if (selectedShifts.length === 0) return;

    setLoading(true);

    try {
      const allocations = selectedShifts
        .map((shift) => crowdSourcing.find((s) => s.shift === shift)?.id)
        .filter(Boolean) as string[];

      await createManyAllocations(allocations);

      toast({
        // icon: <CircleCheckBig color="hsl(var(--green))" height={48} width={48} />,
        title: "Pronto!",
        description: "Sua preferência foi salva!",
      });

      setSelected([]);
      router.push("/driver-panel");
    } catch (err) {
      setLoading(false);
      setSelected([]);

      router.push("/error?message=FilledCluster");

      toast({
        // icon: <CircleX height={48} width={48} />,
        title: "Ops!",
        description: "Algo deu errado.",
      });
    }
  }, [selectedShifts, crowdSourcing, toast, setSelected, router]);

  const shifts = useMemo(() => {
    return crowdSourcing
      .filter((offer) => offer.cluster === selected[0])
      .map((s) => ({ shift: s.shift, description: s.description }));
  }, [crowdSourcing, selected]);

  return (
    <Drawer
      onClose={() => {
        if (!loading) setSelected([]);
      }}
      open={selected.length > 0}
    >
      <DrawerContent className="max-w-screen-sm mx-auto">
        <DrawerHeader>
          <DrawerTitle>
            Confirmar minha rota na região <b>{selected[0]}</b>!
          </DrawerTitle>
          <DrawerDescription className="flex flex-col gap-2">
            <Label>Escolha a janela de carregamento:</Label>
            {shifts.map(({ shift }) => {
              const label =
                OwnFlexShifts.find((s) => s.id === shift)?.description || shift;
              const isDisabled = !availableShifts[shift];

              return (
                <div className="flex items-center gap-2" key={shift}>
                  <Checkbox
                    disabled={isDisabled}
                    checked={selectedShifts.includes(shift)}
                    onCheckedChange={(check) => {
                      setSelectedShifts((state) =>
                        check ? [...state, shift] : state.filter((s) => s !== shift)
                      );
                    }}
                    id={shift}
                  />
                  <Label htmlFor={shift}>
                    <Badge>
                      {label} {isDisabled && " - Já alocado"}
                    </Badge>
                  </Label>
                </div>
              );
            })}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={onSubmit} disabled={loading || selectedShifts.length === 0}>
            {loading ? <ReloadIcon className="mx-12 h-4 w-4 animate-spin" /> : "Quero fazer esta rota!"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
