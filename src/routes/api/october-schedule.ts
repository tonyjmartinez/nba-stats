const NBA_SCHEDULE_ENDPOINT =
  "https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json";

const DEFAULT_HEADERS = {
  "content-type": "application/json",
  "cache-control": "public, max-age=600",
};

export async function GET() {
  try {
    const upstreamResponse = await fetch(NBA_SCHEDULE_ENDPOINT, {
      headers: {
        accept: "application/json",
      },
    });

    if (!upstreamResponse.ok) {
      return new Response(
        JSON.stringify({ message: "Unable to load the October 2 NBA slate." }),
        {
          status: 502,
          headers: DEFAULT_HEADERS,
        },
      );
    }

    const payload = await upstreamResponse.text();

    return new Response(payload, {
      status: 200,
      headers: DEFAULT_HEADERS,
    });
  } catch (error) {
    console.error("Failed to fetch October schedule", error);
    return new Response(
      JSON.stringify({ message: "Unable to load the October 2 NBA slate." }),
      {
        status: 500,
        headers: DEFAULT_HEADERS,
      },
    );
  }
}
