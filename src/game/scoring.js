export function calculateScore(playerCards = [], duke, bonusVP = 0) {
  let total = 0;
  const breakdown = [];

  // BASE VP SPLIT
  let monsterVP = 0;
  let domainVP = 0;
  let citizenVP = 0;

  for (const card of playerCards) {
    if (card.category === "monster") {
      monsterVP += card.baseVP || 0;
    }

    if (card.category === "domain") {
      domainVP += card.baseVP || 0;
    }

    if (card.category === "citizen") {
      citizenVP += card.baseVP || 0;
    }
  }

  // add to total
  total += monsterVP + domainVP + citizenVP;

  // push to breakdown
  if (monsterVP > 0) {
    breakdown.push({
      type: "base",
      label: "ČUDOVIŠTA",
      value: monsterVP,
    });
  }

  if (domainVP > 0) {
    breakdown.push({
      type: "base",
      label: "POSJEDI",
      value: domainVP,
    });
  }

  if (citizenVP > 0) {
    breakdown.push({
      type: "base",
      label: "LIKOVI",
      value: citizenVP,
    });
  }

  // NO DUKE
  if (!duke || !Array.isArray(duke.rules)) {
    return { total, breakdown };
  }

  // DUKE RULES
  for (const rule of duke.rules) {
    let value = 0;

    if (rule.type === "count_tag") {
      const count = playerCards.reduce(
        (sum, c) => sum + (c.tagCounts?.[rule.tag] || 0),
        0,
      );

      value = count * rule.pointsPer;

      breakdown.push({
        type: "duke",
        label: rule.tag,
        count,
        multiplier: rule.pointsPer,
        value,
      });
    }

    if (rule.type === "count_category") {
      const count = playerCards.filter(
        (c) => c.category === rule.category,
      ).length;

      value = count * rule.pointsPer;

      breakdown.push({
        type: "duke",
        label: rule.category,
        count,
        multiplier: rule.pointsPer,
        value,
      });
    }

    total += value;
  }
  // 🟢 BONUS VP GOES HERE
  total += bonusVP;

  if (bonusVP !== 0) {
    breakdown.push({
      type: "bonus",
      label: "Bonus VP",
      value: bonusVP,
    });
  }
  return { total, breakdown };
}
