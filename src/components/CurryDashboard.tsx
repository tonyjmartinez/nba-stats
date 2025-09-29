import { Chart as ChartJS, Filler, Legend, Title, Tooltip } from "chart.js";
import { Component, createMemo } from "solid-js";
import { curryGameLogs } from "~/data/curryGameLogs";
import CurryChartGrid from "~/components/curry/CurryChartGrid.mdx";
import CurryGameLogTable from "~/components/curry/CurryGameLogTable.mdx";
import CurryHero from "~/components/curry/CurryHero.mdx";
import CurryStatGrid from "~/components/curry/CurryStatGrid.mdx";

ChartJS.register(Filler, Legend, Title, Tooltip);

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const locationBadge = (location: string) => {
  switch (location) {
    case "Home":
      return "🏠";
    case "Away":
      return "✈️";
    default:
      return "🎯";
  }
};

const CurryDashboard: Component = () => {
  const gamesByDate = createMemo(() =>
    [...curryGameLogs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  );

  const totals = createMemo(() =>
    gamesByDate().reduce(
      (acc, game) => {
        acc.points += game.points;
        acc.rebounds += game.rebounds;
        acc.assists += game.assists;
        acc.steals += game.steals;
        acc.threes += game.threesMade;
        acc.gameScore += game.gameScore;
        return acc;
      },
      { points: 0, rebounds: 0, assists: 0, steals: 0, threes: 0, gameScore: 0 }
    )
  );

  const averages = createMemo(() => {
    const count = gamesByDate().length;
    const summary = totals();
    return {
      points: summary.points / count,
      rebounds: summary.rebounds / count,
      assists: summary.assists / count,
      steals: summary.steals / count,
      threes: summary.threes / count,
      gameScore: summary.gameScore / count,
    };
  });

  const bestScoringNight = createMemo(() =>
    gamesByDate().reduce((best, game) =>
      game.points > best.points ? game : best
    )
  );

  const bestGameScoreNight = createMemo(() =>
    gamesByDate().reduce((best, game) =>
      game.gameScore > best.gameScore ? game : best
    )
  );

  const recordThreesNight = createMemo(() =>
    gamesByDate().reduce((best, game) =>
      game.threesMade > best.threesMade ? game : best
    )
  );

  const labels = createMemo(() =>
    gamesByDate().map(
      game => `${dateFormatter.format(new Date(game.date))} vs ${game.opponent}`
    )
  );

  const pointsTrend = createMemo(() => ({
    labels: labels(),
    datasets: [
      {
        label: "Points",
        data: gamesByDate().map(game => game.points),
        borderColor: "#f97316",
        backgroundColor: "rgba(249, 115, 22, 0.25)",
        tension: 0.35,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
    ],
  }));

  const scoringDistribution = createMemo(() => ({
    labels: labels(),
    datasets: [
      {
        label: "Field Goals Made",
        backgroundColor: "rgba(59, 130, 246, 0.75)",
        data: gamesByDate().map(game => game.fieldGoalsMade),
      },
      {
        label: "3PM",
        backgroundColor: "rgba(234, 179, 8, 0.85)",
        data: gamesByDate().map(game => game.threesMade),
      },
      {
        label: "FTM",
        backgroundColor: "rgba(16, 185, 129, 0.75)",
        data: gamesByDate().map(game => game.freeThrowsMade),
      },
    ],
  }));

  const radarComparison = createMemo(() => {
    const maxPoints = Math.max(...gamesByDate().map(game => game.points));
    const maxRebounds = Math.max(...gamesByDate().map(game => game.rebounds));
    const maxAssists = Math.max(...gamesByDate().map(game => game.assists));
    const maxSteals = Math.max(...gamesByDate().map(game => game.steals));
    const maxThrees = Math.max(...gamesByDate().map(game => game.threesMade));

    const average = averages();

    return {
      labels: ["Points", "Rebounds", "Assists", "Steals", "3PM"],
      datasets: [
        {
          label: "Average of elite nights",
          data: [
            average.points,
            average.rebounds,
            average.assists,
            average.steals,
            average.threes,
          ],
          backgroundColor: "rgba(147, 51, 234, 0.3)",
          borderColor: "#9333ea",
          borderWidth: 2,
          pointBackgroundColor: "#9333ea",
        },
        {
          label: "Peak single-game marks",
          data: [maxPoints, maxRebounds, maxAssists, maxSteals, maxThrees],
          backgroundColor: "rgba(234, 179, 8, 0.2)",
          borderColor: "#eab308",
          borderWidth: 2,
          pointBackgroundColor: "#eab308",
        },
      ],
    };
  });

  const efficiencyScatter = createMemo(() => ({
    datasets: [
      {
        label: "Game Score vs. Points",
        data: gamesByDate().map(game => ({
          x: game.points,
          y: game.gameScore,
        })),
        pointBackgroundColor: "rgba(14, 165, 233, 0.9)",
        pointBorderColor: "#0ea5e9",
        pointRadius: gamesByDate().map(game => 5 + game.threesMade * 0.2),
        pointHoverRadius: gamesByDate().map(game => 7 + game.threesMade * 0.2),
        showLine: false,
      },
    ],
  }));

  const pointsTrendOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Point eruptions over time",
        color: "#f8fafc",
        font: { size: 18, weight: "600" },
        padding: { top: 10, bottom: 16 },
      },
      tooltip: {
        callbacks: {
          title(items: any[]) {
            const item = items[0];
            return labels()[item.dataIndex];
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5f5",
          maxRotation: 35,
          minRotation: 35,
        },
        grid: { color: "rgba(148, 163, 184, 0.2)" },
      },
      y: {
        ticks: { color: "#cbd5f5" },
        grid: { color: "rgba(148, 163, 184, 0.2)" },
      },
    },
  } as const;

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#e2e8f0" },
      },
      title: {
        display: true,
        text: "Shot profile in signature games",
        color: "#f8fafc",
        font: { size: 18, weight: "600" },
        padding: { bottom: 12 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5f5",
          maxRotation: 30,
          minRotation: 30,
        },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#cbd5f5" },
        grid: { color: "rgba(148, 163, 184, 0.2)" },
      },
    },
  } as const;

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#e2e8f0" },
      },
      title: {
        display: true,
        text: "All-around output",
        color: "#f8fafc",
        font: { size: 18, weight: "600" },
        padding: { bottom: 12 },
      },
    },
    scales: {
      r: {
        angleLines: { color: "rgba(148, 163, 184, 0.25)" },
        grid: { color: "rgba(148, 163, 184, 0.25)" },
        pointLabels: { color: "#f8fafc" },
        ticks: {
          color: "#cbd5f5",
          backdropColor: "transparent",
        },
      },
    },
  } as const;

  const scatterOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#e2e8f0" },
      },
      title: {
        display: true,
        text: "Scoring volume vs. Game Score",
        color: "#f8fafc",
        font: { size: 18, weight: "600" },
        padding: { bottom: 12 },
      },
      tooltip: {
        callbacks: {
          label(context: any) {
            const game = gamesByDate()[context.dataIndex];
            return `${game.points} pts, Game Score ${game.gameScore.toFixed(
              1
            )}`;
          },
          title(context: any[]) {
            const game = gamesByDate()[context[0].dataIndex];
            return `${dateFormatter.format(new Date(game.date))} vs ${game.opponent}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Points",
          color: "#e2e8f0",
        },
        ticks: { color: "#cbd5f5" },
        grid: { color: "rgba(148, 163, 184, 0.2)" },
      },
      y: {
        title: {
          display: true,
          text: "Game Score",
          color: "#e2e8f0",
        },
        ticks: { color: "#cbd5f5" },
        grid: { color: "rgba(148, 163, 184, 0.2)" },
      },
    },
  } as const;

  const formatDate = (value: string) => dateFormatter.format(new Date(value));

  return (
    <section class="curry-dashboard">
      <CurryHero highlight={bestScoringNight()} formatDate={formatDate} />
      <CurryStatGrid
        totals={totals()}
        averages={averages()}
        count={gamesByDate().length}
        bestGameScoreNight={bestGameScoreNight()}
        recordThreesNight={recordThreesNight()}
        formatDate={formatDate}
      />
      <CurryChartGrid
        pointsTrendData={pointsTrend()}
        scoringDistributionData={scoringDistribution()}
        radarComparisonData={radarComparison()}
        efficiencyScatterData={efficiencyScatter()}
        pointsTrendOptions={pointsTrendOptions}
        barOptions={barOptions}
        radarOptions={radarOptions}
        scatterOptions={scatterOptions}
      />
      <CurryGameLogTable
        games={gamesByDate()}
        formatDate={formatDate}
        locationBadge={locationBadge}
      />
    </section>
  );
};

export default CurryDashboard;
