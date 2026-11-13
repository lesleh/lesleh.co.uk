// Post dates have no time of day, so both functions read them as UTC.
const readableFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats a date for a reader, for example "4 June 2019". */
export function formatDate(date: Date): string {
  return readableFormat.format(date);
}

/** Formats a date for the `datetime` attribute, for example "2019-06-04". */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
