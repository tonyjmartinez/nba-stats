import { Show, createMemo, createResource } from "solid-js";
import OctoberHero from "~/components/october/OctoberHero.mdx";
import OctoberGamesList from "~/components/october/OctoberGamesList.mdx";
import OctoberEmptyState from "~/components/october/OctoberEmptyState.mdx";

const SCHEDULE_ENDPOINT = "/api/october-schedule";
const TARGET_DATE_KEY = "10/02/2025 00:00:00";

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

function findOctoberGames(data: ScheduleResponse) {
  const gameDates = data.leagueSchedule?.gameDates ?? [];
  const targetDate = gameDates.find(day => day.gameDate === TARGET_DATE_KEY);
  const games = targetDate?.games ?? [];
  return games.map(normalizeGame);
}

export default function OctoberSecondGames() {
  const [schedule] = createResource(fetchOctoberSecondSchedule);

  const games = createMemo(() => {
    const data = schedule();
    return data ? findOctoberGames(data) : [];
  });

  const headliner = createMemo(() => games()[0]);

  return (
    <section class="october-dashboard">
      <Show when={schedule.error}>
        {(error) => <p class="alert error">{error.message}</p>}
      </Show>

      <Show when={!schedule.error}>
        <Show when={schedule.loading} fallback={null}>
          <div class="loading-panel">Loading the October 2 slate…</div>
        </Show>

        <Show when={!schedule.loading}>
          <Show when={games().length > 0} fallback={<OctoberEmptyState />}> 
            {headliner() && (
              <OctoberHero
                game={headliner()!}
              />
            )}
            <OctoberGamesList games={games()} />
          </Show>
        </Show>
      </Show>
    </section>
  );
}
