import { Show, createMemo, createResource, createSignal } from "solid-js";
import OctoberHero from "~/components/october/OctoberHero.mdx";
import OctoberGamesList from "~/components/october/OctoberGamesList.mdx";
import OctoberEmptyState from "~/components/october/OctoberEmptyState.mdx";

const SCHEDULE_ENDPOINT = "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json";
const DEFAULT_DATE = "2025-10-02";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  weekday: "long",
  timeZone: "America/New_York",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
  timeZoneName: "short",
});

type ScheduleResponse = {
  leagueSchedule?: {
    gameDates?: ScheduleDate[];
  };
};

type ScheduleDate = {
  gameDate?: string;
  games?: ScheduleGame[];
};

type ScheduleGame = {
  gameId: string;
  gameStatusText: string;
  gameLabel?: string;
  gameSubLabel?: string;
  gameDateTimeUTC: string;
  arenaName?: string;
  arenaCity?: string;
  arenaState?: string;
  isNeutral?: boolean;
  broadcasters?: {
    nationalBroadcasters?: Broadcaster[];
    homeTvBroadcasters?: Broadcaster[];
    awayTvBroadcasters?: Broadcaster[];
  };
  homeTeam: Team;
  awayTeam: Team;
};

type Team = {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  teamSlug: string;
};

type Broadcaster = {
  broadcasterDisplay?: string;
};

type OctoberGame = {
  id: string;
  label: string;
  subLabel?: string;
  statusText: string;
  dateText: string;
  tipoffText: string;
  location: string;
  neutralSite: boolean;
  homeTeam: DisplayTeam;
  awayTeam: DisplayTeam;
  broadcasters: string[];
};

type DisplayTeam = {
  name: string;
  city: string;
  tricode: string;
};

async function fetchOctoberSecondSchedule() {
  const response = await fetch(SCHEDULE_ENDPOINT, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load the October 2 NBA slate.");
  }

  return (await response.json()) as ScheduleResponse;
}

function buildLocation(game: ScheduleGame) {
  const parts = [game.arenaName, game.arenaCity, game.arenaState]
    .filter(Boolean)
    .map(segment => segment?.trim())
    .filter(Boolean);

  return parts.join(" · ") || "Venue TBA";
}

function collectBroadcasters(game: ScheduleGame) {
  const pools = [
    game.broadcasters?.nationalBroadcasters ?? [],
    game.broadcasters?.homeTvBroadcasters ?? [],
    game.broadcasters?.awayTvBroadcasters ?? [],
  ];

  const names = new Set<string>();

  for (const pool of pools) {
    for (const entry of pool) {
      if (entry?.broadcasterDisplay) {
        names.add(entry.broadcasterDisplay);
      }
    }
  }

  return [...names];
}

function normalizeGame(game: ScheduleGame): OctoberGame {
  const date = new Date(game.gameDateTimeUTC);

  return {
    id: game.gameId,
    label: game.gameLabel ?? "NBA Preseason",
    subLabel: game.gameSubLabel,
    statusText: game.gameStatusText,
    dateText: dateFormatter.format(date),
    tipoffText: timeFormatter.format(date),
    location: buildLocation(game),
    neutralSite: Boolean(game.isNeutral),
    homeTeam: {
      name: game.homeTeam.teamName,
      city: game.homeTeam.teamCity,
      tricode: game.homeTeam.teamTricode,
    },
    awayTeam: {
      name: game.awayTeam.teamName,
      city: game.awayTeam.teamCity,
      tricode: game.awayTeam.teamTricode,
    },
    broadcasters: collectBroadcasters(game),
  };
}

function buildDateKey(dateISO: string) {
  const [year, month, day] = dateISO.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${month}/${day}/${year} 00:00:00`;
}

function formatDateLabel(dateISO: string) {
  const [yearString, monthString, dayString] = dateISO.split("-");
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return "the selected date";
  }

  const reference = new Date(Date.UTC(year, month - 1, day, 12));
  return dateFormatter.format(reference);
}

function findOctoberGames(data: ScheduleResponse, dateKey: string) {
  const gameDates = data.leagueSchedule?.gameDates ?? [];
  const targetDate = gameDates.find(day => day.gameDate === dateKey);
  const games = targetDate?.games ?? [];
  return games.map(normalizeGame);
}

export default function OctoberSecondGames() {
  const [schedule] = createResource(fetchOctoberSecondSchedule);

  const [selectedDate, setSelectedDate] = createSignal(DEFAULT_DATE);

  const selectedDateKey = createMemo(() => buildDateKey(selectedDate()));

  const games = createMemo(() => {
    const data = schedule();
    const dateKey = selectedDateKey();
    return data && dateKey ? findOctoberGames(data, dateKey) : [];
  });

  const headliner = createMemo(() => games()[0]);
  const selectedDateLabel = createMemo(() => formatDateLabel(selectedDate()));

  const handleDateInput = (event: InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => {
    const value = event.currentTarget.value;
    setSelectedDate(value || DEFAULT_DATE);
  };

  return (
    <section class="october-dashboard">
      <header class="schedule-controls">
        <div class="section-heading">
          <p class="eyebrow">NBA schedule</p>
          <h2>Games for {selectedDateLabel()}</h2>
          <p class="lead">
            Pick a date to explore upcoming preseason and regular-season matchups as they&apos;re announced.
          </p>
        </div>
        <label class="date-selector">
          <span>Choose a date</span>
          <input
            type="date"
            value={selectedDate()}
            onInput={handleDateInput}
          />
        </label>
      </header>

      <Show when={schedule.error}>
        {(error) => <p class="alert error">{error.message}</p>}
      </Show>

      <Show when={!schedule.error}>
        <Show when={schedule.loading} fallback={null}>
          <div class="loading-panel">Loading the latest NBA schedule…</div>
        </Show>

        <Show when={!schedule.loading}>
          <Show
            when={games().length > 0}
            fallback={<OctoberEmptyState dateLabel={selectedDateLabel()} />}
          >
            {headliner() && (
              <OctoberHero
                game={headliner()!}
              />
            )}
            <OctoberGamesList games={games()} dateLabel={selectedDateLabel()} />
          </Show>
        </Show>
      </Show>
    </section>
  );
}
