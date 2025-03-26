"use server";
import { revalidatePath } from "next/cache";
import prisma from "./db";

export const getClusters = async (station_name: string): Promise<any[]> => {
  return await prisma.clusters.findMany({
    where: { station_name },
  });
};

export const getClustersById = async (station_id: number): Promise<any[]> => {
  return await prisma.clusters.findMany({
    where: { station_id },
  });
};

export const getPrevClusters = async (driver_id: string): Promise<any[]> => {
  return await prisma.preferences.findMany({
    where: { driver_id },
  });
};

export async function savePreferences(clusters, user, choosed_station = null) {
  const station = choosed_station || user.station;
  try {
    const preferences = clusters.map((cluster: any) => ({
      driver_id: user.driverId.toString(),
      driver_name: user.driverName,
      phone: user.phone.toString(),
      station,
      vehicle: user.vehicle,
      city: "",
      cep: cluster,
      ownflex: !!user.ownflex,
    }));

    await prisma.$transaction([
      prisma.preferences.deleteMany({
        where: { driver_id: user.driverId.toString(), station },
      }),
      prisma.preferences.createMany({
        data: preferences,
      }),
    ]);

    revalidatePath("/primeira-entrega/clusters");
  } catch (error) {
    console.error("Error creating preferences:", error);
    throw error;
  }
}
