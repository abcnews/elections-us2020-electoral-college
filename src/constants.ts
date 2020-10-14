export enum GroupID {
  AK,
  AL,
  AR,
  AZ,
  CA,
  CO,
  CT,
  DC,
  DE,
  FL,
  GA,
  HI,
  IA,
  ID,
  IL,
  IN,
  KS,
  KY,
  LA,
  MA,
  MD,
  ME_0,
  ME_1,
  ME_2,
  MI,
  MN,
  MO,
  MS,
  MT,
  NC,
  ND,
  NE_0,
  NE_1,
  NE_2,
  NE_3,
  NH,
  NJ,
  NM,
  NV,
  NY,
  OH,
  OK,
  OR,
  PA,
  RI,
  SC,
  SD,
  TN,
  TX,
  UT,
  VA,
  VT,
  WA,
  WI,
  WV,
  WY
}

export const GROUP_IDS = Object.keys(GroupID).filter(key => typeof GroupID[key] === 'number');

export type Group = {
  id: GroupID;
  name: string;
  votes: number;
};

export const GROUPS: Group[] = [
  {
    id: GroupID.AL,
    name: 'Alabama',
    votes: 9
  },
  {
    id: GroupID.AK,
    name: 'Alaska',
    votes: 3
  },
  {
    id: GroupID.AZ,
    name: 'Arizona',
    votes: 11
  },
  {
    id: GroupID.AR,
    name: 'Arkansas',
    votes: 6
  },
  {
    id: GroupID.CA,
    name: 'California',
    votes: 55
  },
  {
    id: GroupID.CO,
    name: 'Colorado',
    votes: 9
  },
  {
    id: GroupID.CT,
    name: 'Connecticut',
    votes: 7
  },
  {
    id: GroupID.DE,
    name: 'Delaware',
    votes: 3
  },
  {
    id: GroupID.DC,
    name: 'District of Columbia',
    votes: 3
  },
  {
    id: GroupID.FL,
    name: 'Florida',
    votes: 29
  },
  {
    id: GroupID.GA,
    name: 'Georgia',
    votes: 16
  },
  {
    id: GroupID.HI,
    name: 'Hawaii',
    votes: 4
  },
  {
    id: GroupID.ID,
    name: 'Idaho',
    votes: 4
  },
  {
    id: GroupID.IL,
    name: 'Illinois',
    votes: 20
  },
  {
    id: GroupID.IN,
    name: 'Indiana',
    votes: 11
  },
  {
    id: GroupID.IA,
    name: 'Iowa',
    votes: 6
  },
  {
    id: GroupID.KS,
    name: 'Kansas',
    votes: 6
  },
  {
    id: GroupID.KY,
    name: 'Kentucky',
    votes: 8
  },
  {
    id: GroupID.LA,
    name: 'Louisiana',
    votes: 8
  },
  {
    id: GroupID.ME_0,
    name: 'Maine (State)',
    votes: 2
  },
  {
    id: GroupID.ME_1,
    name: 'Maine (District 1)',
    votes: 1
  },
  {
    id: GroupID.ME_2,
    name: 'Maine (District 2)',
    votes: 1
  },
  {
    id: GroupID.MD,
    name: 'Maryland',
    votes: 10
  },
  {
    id: GroupID.MA,
    name: 'Massachusetts',
    votes: 11
  },
  {
    id: GroupID.MI,
    name: 'Michigan',
    votes: 16
  },
  {
    id: GroupID.MN,
    name: 'Minnesota',
    votes: 10
  },
  {
    id: GroupID.MS,
    name: 'Mississippi',
    votes: 6
  },
  {
    id: GroupID.MO,
    name: 'Missouri',
    votes: 10
  },
  {
    id: GroupID.MT,
    name: 'Montana',
    votes: 3
  },
  {
    id: GroupID.NE_0,
    name: 'Nebraska (State)',
    votes: 2
  },
  {
    id: GroupID.NE_1,
    name: 'Nebraska (District 1)',
    votes: 1
  },
  {
    id: GroupID.NE_2,
    name: 'Nebraska (District 2)',
    votes: 1
  },
  {
    id: GroupID.NE_3,
    name: 'Nebraska (District 3)',
    votes: 1
  },
  {
    id: GroupID.NV,
    name: 'Nevada',
    votes: 6
  },
  {
    id: GroupID.NH,
    name: 'New Hampshire',
    votes: 4
  },
  {
    id: GroupID.NJ,
    name: 'New Jersey',
    votes: 14
  },
  {
    id: GroupID.NM,
    name: 'New Mexico',
    votes: 5
  },
  {
    id: GroupID.NY,
    name: 'New York',
    votes: 29
  },
  {
    id: GroupID.NC,
    name: 'North Carolina',
    votes: 15
  },
  {
    id: GroupID.ND,
    name: 'North Dakota',
    votes: 3
  },
  {
    id: GroupID.OH,
    name: 'Ohio',
    votes: 18
  },
  {
    id: GroupID.OK,
    name: 'Oklahoma',
    votes: 7
  },
  {
    id: GroupID.OR,
    name: 'Oregon',
    votes: 7
  },
  {
    id: GroupID.PA,
    name: 'Pennsylvania',
    votes: 20
  },
  {
    id: GroupID.RI,
    name: 'Rhode Island',
    votes: 4
  },
  {
    id: GroupID.SC,
    name: 'South Carolina',
    votes: 9
  },
  {
    id: GroupID.SD,
    name: 'South Dakota',
    votes: 3
  },
  {
    id: GroupID.TN,
    name: 'Tennessee',
    votes: 11
  },
  {
    id: GroupID.TX,
    name: 'Texas',
    votes: 38
  },
  {
    id: GroupID.UT,
    name: 'Utah',
    votes: 6
  },
  {
    id: GroupID.VT,
    name: 'Vermont',
    votes: 3
  },
  {
    id: GroupID.VA,
    name: 'Virginia',
    votes: 13
  },
  {
    id: GroupID.WA,
    name: 'Washington',
    votes: 12
  },
  {
    id: GroupID.WV,
    name: 'West Virginia',
    votes: 5
  },
  {
    id: GroupID.WI,
    name: 'Wisconsin',
    votes: 10
  },
  {
    id: GroupID.WY,
    name: 'Wyoming',
    votes: 3
  }
];

export enum Allocation {
  None = 'n',
  Dem = 'd',
  Rep = 'r'
}

export const ALLOCATIONS: string[] = Object.keys(Allocation).map(x=>Allocation[x]);

export interface Allocations {
  [key: string]: Allocation;
}

// export type Distribution = {
//   dem: Array<GroupID>;
//   rep: Array<GroupID>;
// };

// export interface Presets {
//   [key: string]: Distribution;
// }

// export const PRESETS: Presets = {
//   none: {
//     dem: [],
//     rep: []
//   },
//   safe: {
//     dem: [
//       GroupID.CA,
//       GroupID.CT,
//       GroupID.DE,
//       GroupID.DC,
//       GroupID.HI,
//       GroupID.IL,
//       GroupID.ME_1,
//       GroupID.MD,
//       GroupID.MA,
//       GroupID.NM,
//       GroupID.NJ,
//       GroupID.NY,
//       GroupID.OR,
//       GroupID.RI,
//       GroupID.VT,
//       GroupID.WA
//     ],
//     rep: [
//       GroupID.AL,
//       GroupID.AK,
//       GroupID.AR,
//       GroupID.ID,
//       GroupID.KS,
//       GroupID.KY,
//       GroupID.LA,
//       GroupID.MS,
//       GroupID.MT,
//       GroupID.NE_0,
//       GroupID.NE_1,
//       GroupID.NE_3,
//       GroupID.ND,
//       GroupID.OK,
//       GroupID.SC,
//       GroupID.SD,
//       GroupID.TN,
//       GroupID.TX,
//       GroupID.WV,
//       GroupID.WY
//     ]
//   },
//   likely: {
//     dem: [
//       GroupID.CA,
//       GroupID.CT,
//       GroupID.DE,
//       GroupID.DC,
//       GroupID.HI,
//       GroupID.IL,
//       GroupID.ME_0,
//       GroupID.ME_1,
//       GroupID.MD,
//       GroupID.MA,
//       GroupID.MN,
//       GroupID.NM,
//       GroupID.NJ,
//       GroupID.NY,
//       GroupID.OR,
//       GroupID.RI,
//       GroupID.VT,
//       GroupID.VA,
//       GroupID.WA
//     ],
//     rep: [
//       GroupID.AL,
//       GroupID.AK,
//       GroupID.AR,
//       GroupID.ID,
//       GroupID.IN,
//       GroupID.KS,
//       GroupID.KY,
//       GroupID.LA,
//       GroupID.MS,
//       GroupID.MO,
//       GroupID.MT,
//       GroupID.NE_0,
//       GroupID.NE_1,
//       GroupID.NE_3,
//       GroupID.ND,
//       GroupID.OK,
//       GroupID.SC,
//       GroupID.SD,
//       GroupID.TN,
//       GroupID.TX,
//       GroupID.UT,
//       GroupID.WV,
//       GroupID.WY
//     ]
//   },
//   2012: {
//     dem: [
//       GroupID.CA,
//       GroupID.CO,
//       GroupID.CT,
//       GroupID.DE,
//       GroupID.DC,
//       GroupID.FL,
//       GroupID.HI,
//       GroupID.IL,
//       GroupID.IA,
//       GroupID.ME_0,
//       GroupID.ME_1,
//       GroupID.ME_2,
//       GroupID.MD,
//       GroupID.MA,
//       GroupID.MI,
//       GroupID.MN,
//       GroupID.NV,
//       GroupID.NH,
//       GroupID.NJ,
//       GroupID.NM,
//       GroupID.NY,
//       GroupID.OH,
//       GroupID.OR,
//       GroupID.PA,
//       GroupID.RI,
//       GroupID.VT,
//       GroupID.VA,
//       GroupID.WA,
//       GroupID.WI
//     ],
//     rep: [
//       GroupID.AL,
//       GroupID.AK,
//       GroupID.AZ,
//       GroupID.AR,
//       GroupID.GA,
//       GroupID.ID,
//       GroupID.IN,
//       GroupID.KS,
//       GroupID.KY,
//       GroupID.LA,
//       GroupID.MS,
//       GroupID.MO,
//       GroupID.MT,
//       GroupID.NE_0,
//       GroupID.NE_1,
//       GroupID.NE_2,
//       GroupID.NE_3,
//       GroupID.NC,
//       GroupID.ND,
//       GroupID.OK,
//       GroupID.SC,
//       GroupID.SD,
//       GroupID.TN,
//       GroupID.TX,
//       GroupID.UT,
//       GroupID.WV,
//       GroupID.WY
//     ]
//   },
//   2008: {
//     dem: [
//       GroupID.CA,
//       GroupID.CO,
//       GroupID.CT,
//       GroupID.DE,
//       GroupID.DC,
//       GroupID.FL,
//       GroupID.HI,
//       GroupID.IL,
//       GroupID.IN,
//       GroupID.IA,
//       GroupID.ME_0,
//       GroupID.ME_1,
//       GroupID.ME_2,
//       GroupID.MD,
//       GroupID.MA,
//       GroupID.MI,
//       GroupID.MN,
//       GroupID.NE_2,
//       GroupID.NV,
//       GroupID.NH,
//       GroupID.NJ,
//       GroupID.NM,
//       GroupID.NY,
//       GroupID.NC,
//       GroupID.OH,
//       GroupID.OR,
//       GroupID.PA,
//       GroupID.RI,
//       GroupID.VT,
//       GroupID.VA,
//       GroupID.WA,
//       GroupID.WI
//     ],
//     rep: [
//       GroupID.AL,
//       GroupID.AK,
//       GroupID.AZ,
//       GroupID.AR,
//       GroupID.GA,
//       GroupID.ID,
//       GroupID.KS,
//       GroupID.KY,
//       GroupID.LA,
//       GroupID.MS,
//       GroupID.MO,
//       GroupID.MT,
//       GroupID.NE_0,
//       GroupID.NE_1,
//       GroupID.NE_3,
//       GroupID.ND,
//       GroupID.OK,
//       GroupID.SC,
//       GroupID.SD,
//       GroupID.TN,
//       GroupID.TX,
//       GroupID.UT,
//       GroupID.WV,
//       GroupID.WY
//     ]
//   },
//   2004: {
//     dem: [
//       GroupID.CA,
//       GroupID.CT,
//       GroupID.DE,
//       GroupID.DC,
//       GroupID.HI,
//       GroupID.IL,
//       GroupID.ME_0,
//       GroupID.ME_1,
//       GroupID.ME_2,
//       GroupID.MD,
//       GroupID.MA,
//       GroupID.MI,
//       GroupID.MN,
//       GroupID.NH,
//       GroupID.NJ,
//       GroupID.NY,
//       GroupID.OR,
//       GroupID.PA,
//       GroupID.RI,
//       GroupID.VT,
//       GroupID.WA,
//       GroupID.WI
//     ],
//     rep: [
//       GroupID.AL,
//       GroupID.AK,
//       GroupID.AZ,
//       GroupID.AR,
//       GroupID.CO,
//       GroupID.FL,
//       GroupID.GA,
//       GroupID.ID,
//       GroupID.IN,
//       GroupID.IA,
//       GroupID.KS,
//       GroupID.KY,
//       GroupID.LA,
//       GroupID.MS,
//       GroupID.MO,
//       GroupID.MT,
//       GroupID.NE_0,
//       GroupID.NE_1,
//       GroupID.NE_2,
//       GroupID.NE_3,
//       GroupID.NV,
//       GroupID.NM,
//       GroupID.NC,
//       GroupID.ND,
//       GroupID.OH,
//       GroupID.OK,
//       GroupID.SC,
//       GroupID.SD,
//       GroupID.TN,
//       GroupID.TX,
//       GroupID.UT,
//       GroupID.VA,
//       GroupID.WV,
//       GroupID.WY
//     ]
//   },
//   2000: {
//     dem: [
//       GroupID.CA,
//       GroupID.CT,
//       GroupID.DE,
//       GroupID.DC,
//       GroupID.HI,
//       GroupID.IL,
//       GroupID.IA,
//       GroupID.ME_0,
//       GroupID.ME_1,
//       GroupID.ME_2,
//       GroupID.MD,
//       GroupID.MA,
//       GroupID.MI,
//       GroupID.MN,
//       GroupID.NJ,
//       GroupID.NM,
//       GroupID.NY,
//       GroupID.OR,
//       GroupID.PA,
//       GroupID.RI,
//       GroupID.VT,
//       GroupID.WA,
//       GroupID.WI
//     ],
//     rep: [
//       GroupID.AL,
//       GroupID.AK,
//       GroupID.AZ,
//       GroupID.AR,
//       GroupID.CO,
//       GroupID.FL,
//       GroupID.GA,
//       GroupID.ID,
//       GroupID.IN,
//       GroupID.KS,
//       GroupID.KY,
//       GroupID.LA,
//       GroupID.MS,
//       GroupID.MO,
//       GroupID.MT,
//       GroupID.NE_0,
//       GroupID.NE_1,
//       GroupID.NE_2,
//       GroupID.NE_3,
//       GroupID.NV,
//       GroupID.NH,
//       GroupID.NC,
//       GroupID.ND,
//       GroupID.OH,
//       GroupID.OK,
//       GroupID.SC,
//       GroupID.SD,
//       GroupID.TN,
//       GroupID.TX,
//       GroupID.UT,
//       GroupID.VA,
//       GroupID.WV,
//       GroupID.WY
//     ]
//   }
// };
