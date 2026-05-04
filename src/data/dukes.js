export const dukes = [
  {
    id: "master_of_coin",
    name: "Gospodar Kovanica",
    image: "/assets/cards/dukes/master_of_coin.webp",
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
    image: "/assets/cards/dukes/royal_shipbuilder.webp",
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
    image: "/assets/cards/dukes/grand_maester.webp",
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
    image: "/assets/cards/dukes/hand_of_the_king.webp",
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
    image: "/assets/cards/dukes/lord_commander.webp",
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
    image: "/assets/cards/dukes/royal_architect.webp",
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
    image: "/assets/cards/dukes/royal_champion.webp",
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
    image: "/assets/cards/dukes/royal_exectioner.webp",
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
    image: "/assets/cards/dukes/royal_spy.webp",
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
    image: "/assets/cards/dukes/royal_sorceress.webp",
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
    image: "/assets/cards/dukes/royal_hunter.webp",
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
    image: "/assets/cards/dukes/royal_emissary.webp",
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
    image: "/assets/cards/dukes/royal_beastslayer.webp",
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
