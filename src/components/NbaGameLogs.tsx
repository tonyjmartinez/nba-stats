import { Show, createResource } from "solid-js";

type ScoreboardResponse = {
  events?: { id: string }[];
};

async function fetchTodayScoreboard() {
  const response = await fetch(
    "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
  );

  if (!response.ok) {
    throw new Error("Unable to fetch the latest NBA scoreboard.");
  }

  const data = (await response.json()) as ScoreboardResponse;
  return data;
}

export default function NbaGameLogs() {
  const [scoreboard] = createResource(fetchTodayScoreboard);

  const gameCount = () => scoreboard()?.events?.length ?? 0;

  return (
    <section class="nba-games">
      <h2>Today's NBA Games</h2>
      <Show when={scoreboard.error}>
        {(error) => <p class="error">{error.message}</p>}
      </Show>
      <Show when={!scoreboard.error}>
        <Show when={!scoreboard.loading} fallback={<p>Loading…</p>}>
          <p>
            {gameCount() === 0
              ? "No NBA games are scheduled today."
              : `There are ${gameCount()} NBA games scheduled today.`}
          </p>
        </Show>
      </Show>
    </section>
  );
}
