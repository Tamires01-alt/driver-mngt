"use server";
import parser from "cron-parser";
import { getEvent } from "@/lib/db/events";
import { auth } from "@/auth";
import { getCurrentMode } from "@/lib/getCurrentMode";
import { isLaterThan } from "@/lib/utils";

export async function fetchDates(ownflex = false, days: number = 3) {
  const { choosed_station } = await getCurrentMode();

  const eventDb = await getEvent(choosed_station, "AVAILABILITY");

  if (!eventDb) {
    return [];
  }

  const cron = eventDb.cron_exp;

  const limit = new Date();

  if (isLaterThan(22)) {
    limit.setDate(limit.getDate() + 1);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  // const tomorrow = new Date(today.setHours(0, 0, 0, 0));
  // tomorrow.setDate(tomorrow.getDate() + 1);

  const parsed = parser.parseExpression(cron, {
    tz: eventDb.timezone,
    // startDate: limit,
    currentDate: limit,
    // currentDate: yesterday,
  });

  const dates = Array.from({ length: days }, (v, i, k) => k).map(
    (event, idx) => {
      const nextEvent = parsed.next();

      const format = nextEvent.toDate().toLocaleDateString("pt-br", {
        day: "numeric",
        month: "short",
        weekday: "long",
        timeZone: eventDb.timezone,
      });

      const value = nextEvent.toDate({ timeZone: eventDb.timezone });

      const instance = value.toLocaleDateString("en-GB", {
        timeZone: eventDb.timezone,
      });

      return {
        event_id: eventDb.id,
        location: eventDb.location,
        name: instance,
        formatted: format.charAt(0).toUpperCase() + format.slice(1),
        value,
        instance,
      };
    }
  );

  return dates;
}
