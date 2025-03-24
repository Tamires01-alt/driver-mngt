"use client";
import {  MapPin } from "lucide-react";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardDescription,
} from "@/components/ui/card";
import { TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button"

interface SelectOption {
  value: string;
  label: string;
}

interface SelectCepProps {
  options: SelectOption[];
  descriptionCard: string;
  city: string;

}

export default function SelectCep({ options, descriptionCard, city }: SelectCepProps) {
  const [selectedCeps, setSelectedCeps] = useState<string[]>(["", "", ""]);

  const handleAddCep = () => {
    setSelectedCeps((prev) => [...prev, ""]);
  };

  const handleRemoveCep = (index: number) => {
    if (selectedCeps.length > 3) {
      setSelectedCeps((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSelectCep = (index: number, value: string) => {
    const newCeps = [...selectedCeps];
    newCeps[index] = value;
    setSelectedCeps(newCeps);
  };

  return (
    <Card className="p-8 ">

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
           <MapPin height={32} width={32} />
          <div className="text-[#ee4d2d] font-bold text-2xl mt-0">Áreas de entrega</div>
        </div>
        <div className="text-[#78716c] text-sm">Aqui você pode informar quais áreas você prefere realizar entrega.</div>
      <CardDescription className="mb-2 mt-6">{descriptionCard}</CardDescription>
      <div className="flex flex-col gap-6">
        {selectedCeps.map((cep, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select onValueChange={(value) => handleSelectCep(index, value)} value={cep}>
              <SelectTrigger className="w-full text-[#ee4d2d]">
                <SelectValue placeholder="Selecione uma área" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{city}</SelectLabel>
                  {options.map((option) => (
                    <SelectItem className="text-black" key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {selectedCeps.length > 3 && (
              <button type="button" onClick={() => handleRemoveCep(index)} className="p-1">
                <TrashIcon className="h-4 w-4 text-[#ee4d2d]" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddCep} className="rounded-full text-[#ee4d2d] flex items-center justify-center mt-1 p-2">
          <PlusCircledIcon className="h-5 w-5" />
        </button>
        <div className="flex justify-end "> 
            <Button type="button">Salvar Alterações</Button>
        </div>
      </div>
      </div>
    </Card>
  );
}
