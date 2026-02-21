export function generateConstellation() {
  const adjectives = [
    "Astral",
    "Celestial",
    "Midnight",
    "Radiant",
    "Eternal",
    "Silent",
    "Nebular",
    "Luminous",
    "Forgotten",
    "Starlit",
  ];

  const nouns = [
    "Fox",
    "Voyager",
    "Crown",
    "Sentinel",
    "Phoenix",
    "Compass",
    "Oracle",
    "Warden",
    "Drifter",
    "Beacon",
  ];

  const loreLines = [
    "It emerged from scattered light, forming a guide for wandering minds.",
    "Legends say it appears when creativity defies the darkness.",
    "It watches quietly over those who dare to imagine.",
    "Its glow strengthens whenever curiosity triumphs over doubt.",
    "Ancient stargazers believed it marked the beginning of bold journeys.",
    "It forms when chaos finds harmony in the night sky.",
  ];

  const pick = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const name = `The ${pick(adjectives)} ${pick(nouns)}`;
  const lore = `${pick(loreLines)} ${pick(loreLines)}`;

  return { name, lore };
}