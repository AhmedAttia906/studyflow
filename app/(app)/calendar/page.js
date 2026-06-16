import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCalendarEventsBetween } from "@/repositories/calendarEventsRepo";
import { getProfileByUserId } from "@/repositories/profilesRepo";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateParts(date, timezone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timezone,
  }).formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year").value),
    month: Number(parts.find((part) => part.type === "month").value),
    day: Number(parts.find((part) => part.type === "day").value),
  };
}

function toKey(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseMonthParam(monthParam, timezone) {
  if (/^\d{4}-\d{2}$/.test(monthParam || "")) {
    const [year, month] = monthParam.split("-").map(Number);
    return { year, month };
  }

  const today = getDateParts(new Date(), timezone);
  return { year: today.year, month: today.month };
}

function shiftMonth(year, month, amount) {
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
  };
}

function monthHref(year, month) {
  return `/calendar?month=${year}-${String(month).padStart(2, "0")}`;
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const start = new Date(firstDay);
  start.setUTCDate(firstDay.getUTCDate() - firstDay.getUTCDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);

    return {
      date,
      day: date.getUTCDate(),
      month: date.getUTCMonth() + 1,
      year: date.getUTCFullYear(),
      inMonth: date.getUTCMonth() + 1 === month,
      key: toKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()),
    };
  });
}

function groupEventsByDay(events, timezone) {
  return events.reduce((grouped, event) => {
    const parts = getDateParts(new Date(event.event_time), timezone);
    const key = toKey(parts.year, parts.month, parts.day);
    grouped[key] = grouped[key] || [];
    grouped[key].push(event);
    return grouped;
  }, {});
}

export default async function CalendarPage({ searchParams }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profile } = await getProfileByUserId(supabase, userData.user.id);
  const timezone = profile?.timezone || "Asia/Qatar";
  const params = await searchParams;
  const { year, month } = parseMonthParam(params?.month, timezone);
  const days = buildCalendarDays(year, month);
  const previous = shiftMonth(year, month, -1);
  const next = shiftMonth(year, month, 1);
  const rangeStart = new Date(days[0].date);
  const rangeEnd = new Date(days[days.length - 1].date);
  rangeStart.setUTCDate(rangeStart.getUTCDate() - 2);
  rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 2);

  const { data: events = [] } = await getCalendarEventsBetween(
    supabase,
    userData.user.id,
    rangeStart.toISOString(),
    rangeEnd.toISOString(),
  );
  const eventsByDay = groupEventsByDay(events, timezone);
  const monthLabel = new Intl.DateTimeFormat("en-QA", {
    month: "long",
    year: "numeric",
    timeZone: timezone,
  }).format(new Date(Date.UTC(year, month - 1, 1)));

  return (
    <>
      <section className="page-header calendar-header">
        <div>
          <p className="eyebrow">Calendar</p>
          <h1>{monthLabel}</h1>
          <p>Deadlines from tasks and goals appear here automatically.</p>
        </div>
        <div className="calendar-nav-actions">
          <Link href={monthHref(previous.year, previous.month)} className="btn btn-secondary">Previous Month</Link>
          <Link href={monthHref(next.year, next.month)} className="btn btn-secondary">Next Month</Link>
        </div>
      </section>

      <section className="calendar-grid" aria-label="Calendar month view">
        {weekdayLabels.map((day) => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}
        {days.map((day) => (
          <article key={day.key} className={`calendar-day ${day.inMonth ? "" : "muted"}`}>
            <span className="calendar-day-number">{day.day}</span>
            <div className="calendar-events">
              {(eventsByDay[day.key] || []).map((event) => (
                <div key={event.id} className="calendar-event">
                  {event.title}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
