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
  LikelyDem = 's',
  Tossup = 'u',
  LikelyGOP = 'e',
  GOP = 'r'
}

export const ALLOCATIONS: string[] = Object.keys(Allocation).map(x => Allocation[x]);

export type Allocations = {
  [key: string]: Allocation;
};

export const INITIAL_ALLOCATIONS = GROUP_IDS.reduce((allocations, groupID) => {
  allocations[groupID] = Allocation.None;

  return allocations;
}, {});

export enum StateID {
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
  ME,
  MI,
  MN,
  MO,
  MS,
  MT,
  NC,
  ND,
  NE,
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

export const STATE_IDS = Object.keys(StateID).filter(key => typeof StateID[key] === 'number');

export type State = {
  id: StateID;
  name: string;
};

export const STATES: State[] = GROUPS.filter(({ id }) => {
  const [, index] = GROUP_IDS[id].split('_');

  return index == null || index === '0';
}).map(({ id, name }) => {
  const stateID = StateID[GROUP_IDS[id].split('_')[0]] as unknown;

  return {
    id: stateID as StateID,
    name: name.split(' (')[0]
  };
});

export enum Focus {
  No = 'n',
  Yes = 'y'
}

export const FOCUSES: string[] = Object.keys(Focus).map(x => Focus[x]);

export type Focuses = {
  [key: string]: Focus;
};

export const INITIAL_FOCUSES = STATE_IDS.reduce((focuses, stateID) => {
  focuses[stateID] = Focus.No;

  return focuses;
}, {});

export type Preset = {
  name?: string;
  allocations: Allocations;
  focuses: Focuses;
  year?: ElectionYear;
};

export type Presets = {
  [key: string]: Preset;
};

export const MIXINS: Presets = {
  safedem: {
    name: 'Safe Dem.',
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
    },
    focuses: {}
  },
  safegop: {
    name: 'Safe GOP',
    allocations: {
      AL: Allocation.GOP,
      AK: Allocation.GOP,
      AR: Allocation.GOP,
      ID: Allocation.GOP,
      KS: Allocation.GOP,
      KY: Allocation.GOP,
      LA: Allocation.GOP,
      MS: Allocation.GOP,
      MT: Allocation.GOP,
      NE_0: Allocation.GOP,
      NE_1: Allocation.GOP,
      NE_3: Allocation.GOP,
      ND: Allocation.GOP,
      OK: Allocation.GOP,
      SC: Allocation.GOP,
      SD: Allocation.GOP,
      TN: Allocation.GOP,
      TX: Allocation.GOP,
      WV: Allocation.GOP,
      WY: Allocation.GOP
    },
    focuses: {}
  },
  nofocus: {
    name: 'No states focused',
    allocations: {},
    focuses: { ...INITIAL_FOCUSES }
  }
};

export const PRESETS: Presets = {
  2012: {
    allocations: {
      AK: Allocation.GOP,
      AL: Allocation.GOP,
      AR: Allocation.GOP,
      AZ: Allocation.GOP,
      CA: Allocation.Dem,
      CO: Allocation.Dem,
      CT: Allocation.Dem,
      DC: Allocation.Dem,
      DE: Allocation.Dem,
      FL: Allocation.Dem,
      GA: Allocation.GOP,
      HI: Allocation.Dem,
      IA: Allocation.Dem,
      ID: Allocation.GOP,
      IL: Allocation.Dem,
      IN: Allocation.GOP,
      KS: Allocation.GOP,
      KY: Allocation.GOP,
      LA: Allocation.GOP,
      MA: Allocation.Dem,
      MD: Allocation.Dem,
      ME_0: Allocation.Dem,
      ME_1: Allocation.Dem,
      ME_2: Allocation.Dem,
      MI: Allocation.Dem,
      MN: Allocation.Dem,
      MO: Allocation.GOP,
      MS: Allocation.GOP,
      MT: Allocation.GOP,
      NC: Allocation.GOP,
      ND: Allocation.GOP,
      NE_0: Allocation.GOP,
      NE_1: Allocation.GOP,
      NE_2: Allocation.GOP,
      NE_3: Allocation.GOP,
      NH: Allocation.Dem,
      NJ: Allocation.Dem,
      NM: Allocation.Dem,
      NV: Allocation.Dem,
      NY: Allocation.Dem,
      OH: Allocation.Dem,
      OK: Allocation.GOP,
      OR: Allocation.Dem,
      PA: Allocation.Dem,
      RI: Allocation.Dem,
      SC: Allocation.GOP,
      SD: Allocation.GOP,
      TN: Allocation.GOP,
      TX: Allocation.GOP,
      UT: Allocation.GOP,
      VA: Allocation.Dem,
      VT: Allocation.Dem,
      WA: Allocation.Dem,
      WI: Allocation.Dem,
      WV: Allocation.GOP,
      WY: Allocation.GOP
    },
    focuses: {},
    year: 2012
  },
  2016: {
    allocations: {
      AK: Allocation.GOP,
      AL: Allocation.GOP,
      AR: Allocation.GOP,
      AZ: Allocation.GOP,
      CA: Allocation.Dem,
      CO: Allocation.Dem,
      CT: Allocation.Dem,
      DC: Allocation.Dem,
      DE: Allocation.Dem,
      FL: Allocation.GOP,
      GA: Allocation.GOP,
      HI: Allocation.Dem,
      IA: Allocation.GOP,
      ID: Allocation.GOP,
      IL: Allocation.Dem,
      IN: Allocation.GOP,
      KS: Allocation.GOP,
      KY: Allocation.GOP,
      LA: Allocation.GOP,
      MA: Allocation.Dem,
      MD: Allocation.Dem,
      ME_0: Allocation.Dem,
      ME_1: Allocation.Dem,
      ME_2: Allocation.GOP,
      MI: Allocation.GOP,
      MN: Allocation.Dem,
      MO: Allocation.GOP,
      MS: Allocation.GOP,
      MT: Allocation.GOP,
      NC: Allocation.GOP,
      ND: Allocation.GOP,
      NE_0: Allocation.GOP,
      NE_1: Allocation.GOP,
      NE_2: Allocation.GOP,
      NE_3: Allocation.GOP,
      NH: Allocation.Dem,
      NJ: Allocation.Dem,
      NM: Allocation.Dem,
      NV: Allocation.Dem,
      NY: Allocation.Dem,
      OH: Allocation.GOP,
      OK: Allocation.GOP,
      OR: Allocation.Dem,
      PA: Allocation.GOP,
      RI: Allocation.Dem,
      SC: Allocation.GOP,
      SD: Allocation.GOP,
      TN: Allocation.GOP,
      TX: Allocation.GOP,
      UT: Allocation.GOP,
      VA: Allocation.Dem,
      VT: Allocation.Dem,
      WA: Allocation.Dem,
      WI: Allocation.GOP,
      WV: Allocation.GOP,
      WY: Allocation.GOP
    },
    focuses: {},
    year: 2016
  },
  safe: {
    name: 'Safe',
    allocations: {
      ...MIXINS.safedem.allocations,
      ...MIXINS.safegop.allocations
    },
    focuses: {}
  },
  tossup: {
    name: 'Tossup',
    allocations: GROUP_IDS.reduce((allocations, groupID) => {
      allocations[groupID] = Allocation.Tossup;

      return allocations;
    }, {}),
    focuses: {}
  }
};

export const ELECTION_YEARS_ALLOCATIONS_CANDIDATES = {
  2020: {
    [Allocation.GOP]: 'Trump',
    [Allocation.Dem]: 'Biden'
  },
  2016: {
    [Allocation.Dem]: 'Clinton',
    [Allocation.GOP]: 'Trump'
  },
  2012: {
    [Allocation.Dem]: 'Obama',
    [Allocation.GOP]: 'Romney'
  },
  2008: {
    [Allocation.GOP]: 'McCain',
    [Allocation.Dem]: 'Obama'
  }
};

export type ElectionYear = keyof typeof ELECTION_YEARS_ALLOCATIONS_CANDIDATES;

export const ELECTION_YEARS = Object.keys(ELECTION_YEARS_ALLOCATIONS_CANDIDATES)
  .reverse()
  .map(x => +x as ElectionYear);

export const [DEFAULT_ELECTION_YEAR, DEFAULT_RELATIVE_ELECTION_YEAR] = ELECTION_YEARS;
