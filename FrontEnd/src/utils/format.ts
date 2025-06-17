// Converts total minutes into a human-readable string format (e.g., "2h 15m")
export function convertToHoursAndMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const hourStr = hours > 0 ? `${hours}h` : "0h";
  const minStr = minutes > 0 ? `${minutes}m` : "0m";

  return [hourStr, minStr].filter(Boolean).join(" ");
}

// Formats a time string (possibly ISO) into "HH:MM" format
export function formatTimeHHMM(time: string): string {
  if (!time) return "";
  const timePart = time.includes("T") ? time.split("T")[1] : time;
  const [hh, mm] = timePart.split(":");
  const hhPadded = hh.padStart(2, "0");
  const mmPadded = mm.padStart(2, "0");
  return `${hhPadded}:${mmPadded}`;
}

// Formats a time string for use in HTML input[type="time"] fields
export function formatTimeForInput(time: string): string {
  if (!time) return "";
  if (time.includes("T")) {
    const timePart = time.split("T")[1];
    const [hh, mm] = timePart.split(":");
    return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
  }
  return time;
}

// Formats a date string into "MM/DD ddd" format
export const formatDate = (startTime: string): string => {
  if (!startTime) return "";
  const date = new Date(startTime);
  const month = date.getMonth() + 1; // 0-indexed
  const day = date.getDate();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }); // 例: "Thu"
  return `${month}/${day} ${weekday}`;
};