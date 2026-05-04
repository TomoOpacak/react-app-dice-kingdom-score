const IMG = process.env.PUBLIC_URL;
export const dukes = [
  {
    id: "master_of_coin",
    name: "Gospodar Kovanica",
    image: IMG + "/assets/cards/dukes/master_of_coin.webp",
    rules: [
      {
        type: "count_tag",
        tag: "worker",
        pointsPer: 1,
      },
      {
        type: "count_tag",
        tag: "rogue",
        pointsPer: 2,
      },
    ],
  },
  {
    id: "royal_shipbuilder",
    name: "Kraljev Brodograditelj",
    image: IMG + "/assets/cards/dukes/royal_shipbuilder.webp",
    rules: [
      {
        type: "count_category",
        category: "monster",
        pointsPer: 1,
      },
      {
        type: "count_category",
        category: "citizen",
        pointsPer: 1,
      },
      {
        type: "count_category",
        category: "domain",
        pointsPer: 1,
      },
    ],
  },
  {
    id: "grand_maester",
    name: "Kraljev Veliki Meštar",
    image: IMG + "/assets/cards/dukes/grand_maester.webp",
    rules: [
      {
        type: "count_category",
        category: "monster",
        pointsPer: 1,
      },
      {
        type: "count_tag",
        tag: "rogue",
        pointsPer: 1,
      },
    ],
  },
  {
    id: "hand_of_the_king",
    name: "Kraljev Namjesnik",
    image: IMG + "/assets/cards/dukes/hand_of_the_king.webp",
    rules: [
      {
        type: "count_category",
        category: "monster",
        pointsPer: 1,
      },
      {
        type: "count_tag",
        tag: "hero",
        pointsPer: 1,
      },
    ],
  },
  {
    id: "lord_commander",
    name: "Zapovjednik Kraljeve Straže",
    image: IMG + "/assets/cards/dukes/lord_commander.webp",
    rules: [
      {
        type: "count_category",
        category: "monster",
        pointsPer: 1,
      },

      {
        type: "count_category",
        category: "domain",
        pointsPer: 2,
      },
    ],
  },
  {
    id: "royal_architect",
    name: "Kraljev Arhitekt",
    image: IMG + "/assets/cards/dukes/royal_architect.webp",
    rules: [
      {
        type: "count_category",
        category: "domain",
        pointsPer: 3,
      },
    ],
  },
  {
    id: "royal_champion",
    name: "Kraljev Prvak",
    image: IMG + "/assets/cards/dukes/royal_champion.webp",
    rules: [
      {
        type: "count_tag",
        tag: "soldier",
        pointsPer: 1,
      },
      {
        type: "count_tag",
        tag: "rogue",
        pointsPer: 2,
      },
    ],
  },
  {
    id: "royal_exectioner",
    name: "Kraljev Krvnik",
    image: IMG + "/assets/cards/dukes/royal_exectioner.webp",
    rules: [
      {
        type: "count_tag",
        tag: "soldier",
        pointsPer: 1,
      },
      {
        type: "count_tag",
        tag: "hero",
        pointsPer: 2,
      },
    ],
  },
  {
    id: "royal_spy",
    name: "Kraljevska Uhoda",
    image: IMG + "/assets/cards/dukes/royal_spy.webp",
    rules: [
      {
        type: "count_tag",
        tag: "worker",
        pointsPer: 1,
      },
      {
        type: "count_tag",
        tag: "hero",
        pointsPer: 2,
      },
    ],
  },
  {
    id: "royal_sorceress",
    name: "Kraljevska Čarobnica",
    image: IMG + "/assets/cards/dukes/royal_sorceress.webp",
    rules: [
      {
        type: "count_tag",
        tag: "hero",
        pointsPer: 2,
      },
      {
        type: "count_tag",
        tag: "minion",
        pointsPer: 1,
      },
    ],
  },
  {
    id: "royal_hunter",
    name: "Kraljeva Lovkinja",
    image: IMG + "/assets/cards/dukes/royal_hunter.webp",
    rules: [
      {
        type: "count_tag",
        tag: "rogue",
        pointsPer: 2,
      },
      {
        type: "count_tag",
        tag: "wild",
        pointsPer: 1,
      },
    ],
  },
  {
    id: "royal_emissary",
    name: "Kraljev Izaslanik",
    image: IMG + "/assets/cards/dukes/royal_emissary.webp",
    rules: [
      {
        type: "count_tag",
        tag: "worker",
        pointsPer: 1,
      },
      {
        type: "count_category",
        category: "citizen",
        pointsPer: 1,
      },
    ],
  },
  {
    id: "royal_beastslayer",
    name: "Kraljev Zvjerolovac",
    image: IMG + "/assets/cards/dukes/royal_beastslayer.webp",
    rules: [
      {
        type: "count_category",
        category: "monster",
        pointsPer: 1,
      },
      {
        type: "count_tag",
        tag: "boss",
        pointsPer: 5,
      },
    ],
  },
];
