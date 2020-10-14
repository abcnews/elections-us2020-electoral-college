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

export const ALLOCATIONS: string[] = Object.keys(Allocation).map(x => Allocation[x]);

export interface Allocations {
  [key: string]: Allocation;
}

export const INITIAL_ALLOCATIONS = GROUP_IDS.reduce((allocations, groupID) => {
  allocations[groupID] = Allocation.None;

  return allocations;
}, {});

export type Preset = {
  name?: string;
  allocations: Allocations;
};

export type Presets = {
  [key: string]: Preset;
};

export const MIXINS: Presets = {
  safedem: {
    name: 'Safe Democrat',
    allocations: {
      CA: Allocation.Dem,
      CT: Allocation.Dem,
      DE: Allocation.Dem,
      DC: Allocation.Dem,
      HI: Allocation.Dem,
      IL: Allocation.Dem,
      ME_1: Allocation.Dem,
      MD: Allocation.Dem,
      MA: Allocation.Dem,
      NM: Allocation.Dem,
      NJ: Allocation.Dem,
      NY: Allocation.Dem,
      OR: Allocation.Dem,
      RI: Allocation.Dem,
      VT: Allocation.Dem,
      WA: Allocation.Dem
    }
  },
  saferep: {
    name: 'Safe Republican',
    allocations: {
      AL: Allocation.Rep,
      AK: Allocation.Rep,
      AR: Allocation.Rep,
      ID: Allocation.Rep,
      KS: Allocation.Rep,
      KY: Allocation.Rep,
      LA: Allocation.Rep,
      MS: Allocation.Rep,
      MT: Allocation.Rep,
      NE_0: Allocation.Rep,
      NE_1: Allocation.Rep,
      NE_3: Allocation.Rep,
      ND: Allocation.Rep,
      OK: Allocation.Rep,
      SC: Allocation.Rep,
      SD: Allocation.Rep,
      TN: Allocation.Rep,
      TX: Allocation.Rep,
      WV: Allocation.Rep,
      WY: Allocation.Rep
    }
  }
};

MIXINS.safe = {
  name: 'Safe (both parties)',
  allocations: {
    ...MIXINS.safedem.allocations,
    ...MIXINS.saferep.allocations
  }
};

export const PRESETS: Presets = {
  safe: MIXINS.safe,
  2012: {
    allocations: {
      AK: Allocation.Rep,
      AL: Allocation.Rep,
      AR: Allocation.Rep,
      AZ: Allocation.Rep,
      CA: Allocation.Dem,
      CO: Allocation.Dem,
      CT: Allocation.Dem,
      DC: Allocation.Dem,
      DE: Allocation.Dem,
      FL: Allocation.Dem,
      GA: Allocation.Rep,
      HI: Allocation.Dem,
      IA: Allocation.Dem,
      ID: Allocation.Rep,
      IL: Allocation.Dem,
      IN: Allocation.Rep,
      KS: Allocation.Rep,
      KY: Allocation.Rep,
      LA: Allocation.Rep,
      MA: Allocation.Dem,
      MD: Allocation.Dem,
      ME_0: Allocation.Dem,
      ME_1: Allocation.Dem,
      ME_2: Allocation.Dem,
      MI: Allocation.Dem,
      MN: Allocation.Dem,
      MO: Allocation.Rep,
      MS: Allocation.Rep,
      MT: Allocation.Rep,
      NC: Allocation.Rep,
      ND: Allocation.Rep,
      NE_0: Allocation.Rep,
      NE_1: Allocation.Rep,
      NE_2: Allocation.Rep,
      NE_3: Allocation.Rep,
      NH: Allocation.Dem,
      NJ: Allocation.Dem,
      NM: Allocation.Dem,
      NV: Allocation.Dem,
      NY: Allocation.Dem,
      OH: Allocation.Dem,
      OK: Allocation.Rep,
      OR: Allocation.Dem,
      PA: Allocation.Dem,
      RI: Allocation.Dem,
      SC: Allocation.Rep,
      SD: Allocation.Rep,
      TN: Allocation.Rep,
      TX: Allocation.Rep,
      UT: Allocation.Rep,
      VA: Allocation.Dem,
      VT: Allocation.Dem,
      WA: Allocation.Dem,
      WI: Allocation.Dem,
      WV: Allocation.Rep,
      WY: Allocation.Rep
    }
  },
  2016: {
    allocations: {
      AK: Allocation.Rep,
      AL: Allocation.Rep,
      AR: Allocation.Rep,
      AZ: Allocation.Rep,
      CA: Allocation.Dem,
      CO: Allocation.Dem,
      CT: Allocation.Dem,
      DC: Allocation.Dem,
      DE: Allocation.Dem,
      FL: Allocation.Rep,
      GA: Allocation.Rep,
      HI: Allocation.Dem,
      IA: Allocation.Rep,
      ID: Allocation.Rep,
      IL: Allocation.Dem,
      IN: Allocation.Rep,
      KS: Allocation.Rep,
      KY: Allocation.Rep,
      LA: Allocation.Rep,
      MA: Allocation.Dem,
      MD: Allocation.Dem,
      ME_0: Allocation.Dem,
      ME_1: Allocation.Dem,
      ME_2: Allocation.Rep,
      MI: Allocation.Rep,
      MN: Allocation.Dem,
      MO: Allocation.Rep,
      MS: Allocation.Rep,
      MT: Allocation.Rep,
      NC: Allocation.Rep,
      ND: Allocation.Rep,
      NE_0: Allocation.Rep,
      NE_1: Allocation.Rep,
      NE_2: Allocation.Rep,
      NE_3: Allocation.Rep,
      NH: Allocation.Dem,
      NJ: Allocation.Dem,
      NM: Allocation.Dem,
      NV: Allocation.Dem,
      NY: Allocation.Dem,
      OH: Allocation.Rep,
      OK: Allocation.Rep,
      OR: Allocation.Dem,
      PA: Allocation.Rep,
      RI: Allocation.Dem,
      SC: Allocation.Rep,
      SD: Allocation.Rep,
      TN: Allocation.Rep,
      TX: Allocation.Rep,
      UT: Allocation.Rep,
      VA: Allocation.Dem,
      VT: Allocation.Dem,
      WA: Allocation.Dem,
      WI: Allocation.Rep,
      WV: Allocation.Rep,
      WY: Allocation.Rep
    }
  }
};
