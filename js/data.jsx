// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const GAMES = [
  {
    id: 1,
    name: "Rush to Race : Hill Racing",
    genre: "Racing",
    rating: "PEGI 3+",
    status: "live",
    desc: "Rush to Race is a free offline hill climb racing game built for players who want a real offroad driving challenge, not just speed.. Tackle steep hill climbs, pull off mid-air stunts, and outrun rival racers — all without using a single megabyte of mobile data. Enjoy pure arcade fun anytime, anywhere — no Wi-Fi needed!",
    gradient: "linear-gradient(135deg, #1a0533 0%, #2d1052 50%, #0d1a3d 100%)",
    iconColor: "#A78BFA",
    icon: "./images/games/icon_rush-to-race.png", // 64x64 png
    iconFallback: "zap", // used if the png above fails to load
    store: "https://play.google.com/store/apps/details?id=com.indvalkaya.rushToRace",
    trailer: "https://youtu.be/7OCGT1_JPwk?si=M6QUurYxYUdc83T0",
  },
  {
    id: 2,
    name: "Race Riot : Car Crash",
    genre: "Racing",
    rating: "PEGI 3+",
    status: "live",
    desc: "Race Riot: Car Crash is a chaotic offline arcade racing game where speed, dodging, and crashing rivals are all part of the fun. Forget perfect racing lines — this is full-contact racing where anything can happen.",
    gradient: "linear-gradient(135deg, #0d1a3d 0%, #1a0533 50%, #2d1052 100%)",
    iconColor: "#7C3AED",
    icon: "./images/games/turbo-vertigo-icon.png", // 64x64 png
    iconFallback: "arrow", // used if the png above fails to load
    store: "https://play.google.com/store/apps/details?id=com.indvalkaya.raceriot",
    trailer: "https://youtu.be/kg0sguLGQSI?si=roYkNFAUwRzvW1Tu",
  },
];
