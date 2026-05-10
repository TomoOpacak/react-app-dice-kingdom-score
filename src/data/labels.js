export const LABELS = {
  worker: "Radnik",
  soldier: "Vojnik",
  rogue: "Zlikovac",
  hero: "Junak",
  monster: "Čudovišta",
  domain: "Posjedi",
  citizen: "Likovi",
  wild: "Divlji",
  minion: "Podanik",
  boss: "Boss",
};
export function t(key) {
  return LABELS[key] || key;
}
