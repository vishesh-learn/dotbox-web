export function ordinalSuffix(day) {
  const n = Math.abs(Number(day));
  const v = n % 100;
  if (v >= 11 && v <= 13) {
    return "th";
  }
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export function formatOrdinalDateTime12hEn(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();

  let h24 = date.getHours();
  const minutes = date.getMinutes();
  let h12 = h24 % 12;
  if (h12 === 0) {
    h12 = 12;
  }
  const ampm = h24 < 12 ? "am" : "pm";
  const hh = String(h12).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");

  return `${day}<sup>${ordinalSuffix(day)}</sup> ${month}, ${year} at ${hh}:${mm} ${ampm}`;
}

export function formatRelativePastEn(date, nowDate = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "unknown";
  }
  if (!(nowDate instanceof Date) || Number.isNaN(nowDate.getTime())) {
    nowDate = new Date();
  }

  const diffMs = nowDate.getTime() - date.getTime();
  if (diffMs < 0) {
    return "just now";
  }

  const secondsTotal = Math.floor(diffMs / 1000);
  if (secondsTotal < 10) {
    return "a few seconds ago";
  }
  if (secondsTotal < 60) {
    return `${secondsTotal} second${secondsTotal === 1 ? "" : "s"} ago`;
  }

  const minutesTotal = Math.floor(secondsTotal / 60);

  if (minutesTotal < 2) {
    return `a minute${minutesTotal === 1 ? "" : "s"} ago`;
  }
  if (minutesTotal < 60) {
    return `${minutesTotal} minute${minutesTotal === 1 ? "" : "s"} ago`;
  }

  const hoursTotal = Math.floor(minutesTotal / 60);
  if (hoursTotal < 2) {
    return `an hour${hoursTotal === 1 ? "" : "s"} ago`;
  }
  if (hoursTotal < 24) {
    return `${hoursTotal} hour${hoursTotal === 1 ? "" : "s"} ago`;
  }

  const daysTotal = Math.floor(hoursTotal / 24);
  if (daysTotal < 7) {
    return `${daysTotal} day${daysTotal === 1 ? "" : "s"} ago`;
  }

  const weeksTotal = Math.floor(daysTotal / 7);
  if (weeksTotal < 8) {
    return `${weeksTotal} week${weeksTotal === 1 ? "" : "s"} ago`;
  }

  const monthsTotal = Math.floor(daysTotal / 30);
  if (monthsTotal < 12) {
    return `${monthsTotal} month${monthsTotal === 1 ? "" : "s"} ago`;
  }

  const yearsTotal = Math.floor(daysTotal / 365);
  return `${yearsTotal} year${yearsTotal === 1 ? "" : "s"} ago`;
}

export function formatDateTimeWithRelativeEn(date, nowDate = new Date()) {
  const absolute = formatOrdinalDateTime12hEn(date);
  const relative = formatRelativePastEn(date, nowDate);
  return `${absolute}<br /><span class="relative">${relative}</span>`;
}
