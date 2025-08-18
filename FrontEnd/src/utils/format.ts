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

  try {
    // ISO 形式 (例: 2025-08-18T09:30:45) の場合
    const date = new Date(time);
    if (!isNaN(date.getTime())) {
      const hh = date.getHours().toString().padStart(2, "0");
      const mm = date.getMinutes().toString().padStart(2, "0");
      return `${hh}:${mm}`;
    }

    // HH:MM または HH:MM:SS の場合
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(time)) {
      const [h, m] = time.split(":");
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    }

    return "";
  } catch {
    return "";
  }
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

// Truncates a long letter to a specified maximum length, adding "..." if truncated
export const truncateLongLetter = (longLetter: string | null | undefined, maxLength: number = 50): string => {
  if (!longLetter) return "";
  return longLetter.length > maxLength ? longLetter.substring(0, maxLength) + "..." : longLetter;
};
