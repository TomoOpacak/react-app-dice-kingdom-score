export const LABELS = {
  worker: "Radnik",
  soldier: "Vojnik",
  rogue: "Odmetnik",
  hero: "Zaštitnik",
  monster: "Čudovišta",
  domain: "Posjed",
  citizen: "Likovi",
  wild: "Divlji",
  minion: "Podanik",
  boss: "Boss",
};
export function t(key) {
  return LABELS[key] || key;
}
