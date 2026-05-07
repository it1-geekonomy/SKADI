export const DASHBOARD_TIME_ZONE =
  process.env.DASHBOARD_TIME_ZONE?.trim() || 'Asia/Kolkata';

function getDateParts(date: Date, timeZone = DASHBOARD_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const map = new Map(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(map.get('year')),
    month: Number(map.get('month')),
    day: Number(map.get('day')),
    hour: Number(map.get('hour')),
    minute: Number(map.get('minute')),
    second: Number(map.get('second')),
  };
}

function getTimeZoneOffsetMs(date: Date, timeZone = DASHBOARD_TIME_ZONE) {
  const parts = getDateParts(date, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return asUtc - date.getTime();
}

function zonedDateTimeToUtcMs(
  parts: { year: number; month: number; day: number; hour?: number; minute?: number; second?: number },
  timeZone = DASHBOARD_TIME_ZONE
) {
  const utcGuess = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour ?? 0,
    parts.minute ?? 0,
    parts.second ?? 0,
    0
  );
  const firstPass = utcGuess - getTimeZoneOffsetMs(new Date(utcGuess), timeZone);
  return utcGuess - getTimeZoneOffsetMs(new Date(firstPass), timeZone);
}

export function formatDashboardDateKey(date: Date | number | string) {
  const d = new Date(date);
  const parts = getDateParts(d);
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

export function startOfDashboardTodayMs(now = new Date()) {
  const parts = getDateParts(now);
  return zonedDateTimeToUtcMs({
    year: parts.year,
    month: parts.month,
    day: parts.day,
  });
}

export function startOfDashboardMonthMs(now = new Date()) {
  const parts = getDateParts(now);
  return zonedDateTimeToUtcMs({
    year: parts.year,
    month: parts.month,
    day: 1,
  });
}

export function startOfPreviousDashboardMonthMs(now = new Date()) {
  const parts = getDateParts(now);
  return zonedDateTimeToUtcMs({
    year: parts.month === 1 ? parts.year - 1 : parts.year,
    month: parts.month === 1 ? 12 : parts.month - 1,
    day: 1,
  });
}
