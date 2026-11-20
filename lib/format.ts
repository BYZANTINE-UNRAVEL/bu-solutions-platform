const stamp = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

export function formatWhen(value: Date) {
  return `${stamp.format(value)} IST`;
}
