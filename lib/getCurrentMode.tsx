"use server";
import { auth } from "@/auth";
import { getOptions } from "./db/options";

export async function getCurrentMode() {
  const session = await auth();
  if (!session?.user) {
    return { mode: "LM", choosed_station: null, options: {} };
  }

  const options = await getOptions(session?.user.driverId);

  if (!options) {
    return { mode: "LM", choosed_station: session?.user.station, options: {} };
  }

  const parsedOptions = JSON.parse(options.options);

  if (parsedOptions.hub === "LM") {
    return {
      mode: "LM",
      choosed_station: session?.user.station,
      options: parsedOptions,
    };
  }

  return {
    mode: "OF",
    choosed_station: parsedOptions.hub,
    options: parsedOptions,
  };
}
