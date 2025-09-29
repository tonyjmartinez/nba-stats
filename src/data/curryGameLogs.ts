export type CurryGameLog = {
  date: string;
  opponent: string;
  location: "Home" | "Away" | "Neutral";
  competition: "Regular Season" | "Playoffs" | "NBA Finals";
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  threesMade: number;
  fieldGoalsMade: number;
  freeThrowsMade: number;
  result: string;
  gameScore: number;
  note: string;
};

export const curryGameLogs: CurryGameLog[] = [
  {
    date: "2015-10-31",
    opponent: "New Orleans Pelicans",
    location: "Away",
    competition: "Regular Season",
    points: 53,
    rebounds: 4,
    assists: 9,
    steals: 4,
    threesMade: 8,
    fieldGoalsMade: 17,
    freeThrowsMade: 11,
    result: "W 134-120",
    gameScore: 49.2,
    note: "35 first-half points to open the reigning MVP campaign with a statement road win."
  },
  {
    date: "2013-02-27",
    opponent: "New York Knicks",
    location: "Away",
    competition: "Regular Season",
    points: 54,
    rebounds: 6,
    assists: 7,
    steals: 3,
    threesMade: 11,
    fieldGoalsMade: 18,
    freeThrowsMade: 7,
    result: "L 109-105",
    gameScore: 46.1,
    note: "A national coming-out party at Madison Square Garden despite the narrow loss."
  },
  {
    date: "2016-02-03",
    opponent: "Washington Wizards",
    location: "Away",
    competition: "Regular Season",
    points: 51,
    rebounds: 7,
    assists: 2,
    steals: 3,
    threesMade: 11,
    fieldGoalsMade: 19,
    freeThrowsMade: 2,
    result: "W 134-121",
    gameScore: 37.3,
    note: "11 triples and a 25-point first quarter stunned the DC crowd."
  },
  {
    date: "2016-02-27",
    opponent: "Oklahoma City Thunder",
    location: "Away",
    competition: "Regular Season",
    points: 46,
    rebounds: 3,
    assists: 6,
    steals: 2,
    threesMade: 12,
    fieldGoalsMade: 14,
    freeThrowsMade: 6,
    result: "W 121-118 (OT)",
    gameScore: 37.7,
    note: "The 38-foot OT winner capped a record-tying night from deep."
  },
  {
    date: "2016-11-07",
    opponent: "New Orleans Pelicans",
    location: "Home",
    competition: "Regular Season",
    points: 46,
    rebounds: 5,
    assists: 5,
    steals: 2,
    threesMade: 13,
    fieldGoalsMade: 16,
    freeThrowsMade: 1,
    result: "W 116-106",
    gameScore: 37.2,
    note: "An NBA-record 13 three-pointers one game after his streak ended."
  },
  {
    date: "2019-04-13",
    opponent: "Los Angeles Clippers",
    location: "Home",
    competition: "Playoffs",
    points: 38,
    rebounds: 15,
    assists: 7,
    steals: 0,
    threesMade: 8,
    fieldGoalsMade: 11,
    freeThrowsMade: 8,
    result: "W 121-104",
    gameScore: 36.5,
    note: "Playoff opener dominance with a playoff career-high on the glass."
  },
  {
    date: "2021-01-03",
    opponent: "Portland Trail Blazers",
    location: "Home",
    competition: "Regular Season",
    points: 62,
    rebounds: 5,
    assists: 4,
    steals: 0,
    threesMade: 8,
    fieldGoalsMade: 18,
    freeThrowsMade: 18,
    result: "W 137-122",
    gameScore: 46.8,
    note: "Career-high 62 points silenced early-season doubters."
  },
  {
    date: "2021-02-06",
    opponent: "Dallas Mavericks",
    location: "Away",
    competition: "Regular Season",
    points: 57,
    rebounds: 2,
    assists: 5,
    steals: 1,
    threesMade: 11,
    fieldGoalsMade: 19,
    freeThrowsMade: 8,
    result: "L 134-132",
    gameScore: 43.8,
    note: "Duel with Luka Dončić produced one of the most efficient 50+ games ever."
  },
  {
    date: "2021-11-08",
    opponent: "Atlanta Hawks",
    location: "Home",
    competition: "Regular Season",
    points: 50,
    rebounds: 7,
    assists: 10,
    steals: 4,
    threesMade: 9,
    fieldGoalsMade: 14,
    freeThrowsMade: 13,
    result: "W 127-113",
    gameScore: 48.6,
    note: "50-point triple-double flirt with a +31 in 35 minutes."
  },
  {
    date: "2022-06-10",
    opponent: "Boston Celtics",
    location: "Away",
    competition: "NBA Finals",
    points: 43,
    rebounds: 10,
    assists: 4,
    steals: 0,
    threesMade: 7,
    fieldGoalsMade: 14,
    freeThrowsMade: 8,
    result: "W 107-97",
    gameScore: 30.4,
    note: "Iconic Finals Game 4 masterpiece to tie the series 2-2."
  }
];
