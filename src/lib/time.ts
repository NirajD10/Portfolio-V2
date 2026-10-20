export const TIME_ZONE = "Asia/Kolkata";

const clock = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TIME_ZONE,
});

/** "09:41" in Pune time. */
export function puneTime(date: Date = new Date()) {
  return clock.format(date);
}

/** Milliseconds until the next minute boundary, so a clock can tick exactly on the minute. */
export function msToNextMinute(date: Date = new Date()) {
  return 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds());
}
