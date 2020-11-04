import type { PartyId } from 'elections-us2020-results-data';
import * as acto from '@abcnews/alternating-case-to-object';
import {
  Allocation,
  Allocations,
  ALLOCATIONS,
  Group,
  GroupID,
  GROUP_IDS,
  GROUPS,
  STATE_IDS,
  Focus,
  Focuses,
  FOCUSES,
  INITIAL_ALLOCATIONS,
  ELECTION_YEARS,
  DEFAULT_ELECTION_YEAR,
  DEFAULT_RELATIVE_ELECTION_YEAR
} from './constants';

export const votesForGroups = (groups: Group[]) => {
  return groups.reduce((memo, group) => {
    return memo + group.votes;
  }, 0);
};

export const getGroupIDForStateIDAndDelegateIndex = (stateID: string, delegateIndex: number) => {
  return `${stateID}${GroupID[stateID] != null ? '' : `_${Math.max(0, delegateIndex - 1)}`}`;
};

export const getGroupIDsForStateID = (stateID: string) => {
  return GROUP_IDS.filter(groupID => groupID.indexOf(stateID) === 0);
};

export const getStateIDForGroupID = (groupID: string) => {
  return groupID.split('_')[0];
};

export const getVoteCountsForAllocations = (allocations: Allocations): { [key: string]: number } => {
  return ALLOCATIONS.reduce((memo, allocation) => {
    memo[allocation] = GROUPS.filter(({ id }) => allocations[GroupID[id]] === allocation).reduce(
      (memo, { votes }) => memo + votes,
      0
    );

    return memo;
  }, {});
};

export const getStateAllocations = (stateID: string, allocations: Allocations) => {
  const stateGroupIDs = getGroupIDsForStateID(stateID);

  return stateGroupIDs.map(groupID => allocations[groupID]);
};

export const determineIfAllocationIsMade = (allocation: Allocation) => allocation !== Allocation.None;

export const determineIfAllocationIsDefinitive = (allocation: Allocation) =>
  allocation === Allocation.Dem || allocation === Allocation.GOP;

export const determineIfProportionOfStateAllocationsMeetCondition = (
  proportion: number,
  stateID: string,
  allocations: Allocations,
  condition: (allocation: Allocation) => boolean
) => {
  proportion = Math.max(0, Math.min(proportion, 1));

  const stateAllocations = getStateAllocations(stateID, allocations);
  const stateAllocationsThatMeetCondition = stateAllocations.filter(condition);

  return stateAllocationsThatMeetCondition.length / stateAllocations.length > proportion;
};

export const determineIfAnyStateAllocationsAreMade = (stateID: string, allocations: Allocations) =>
  determineIfProportionOfStateAllocationsMeetCondition(0, stateID, allocations, determineIfAllocationIsMade);

export const determineIfMostStateAllocationsAreMade = (stateID: string, allocations: Allocations) =>
  determineIfProportionOfStateAllocationsMeetCondition(0.5, stateID, allocations, determineIfAllocationIsMade);

function decode<Dict>(code: string, keys: string[], possibleValues: string[], defaultValue: string): Dict {
  code = typeof code === 'string' ? code.replace(/(\w)(\d+)/g, (_, char, repeated) => char.repeat(+repeated)) : code;
  code = code && code.length === keys.length ? code : defaultValue.repeat(keys.length);

  return keys.reduce((dict, key, index) => {
    const value = code[index];

    dict[key] = possibleValues.indexOf(value) > -1 ? value : defaultValue;

    return dict;
  }, {} as Dict);
}

function encode<Dict>(dict: Dict, keys: string[], possibleValues: string[], defaultValue: string): string {
  return keys
    .reduce((memo: [string, number][], key, index) => {
      const value = possibleValues.indexOf(dict[key]) > -1 ? dict[key] : defaultValue;

      if (index === 0 || value !== memo[memo.length - 1][0]) {
        memo.push([value, 1]);
      } else {
        memo[memo.length - 1][1]++;
      }

      return memo;
    }, [])
    .reduce((memo, [char, repeated]) => {
      return (memo += repeated === 1 ? char : char + String(repeated));
    }, '');
}

export const decodeAllocations = (code: string): Allocations =>
  decode<Allocations>(code, GROUP_IDS, ALLOCATIONS, Allocation.None);

export const encodeAllocations = (allocations: Allocations): string =>
  encode<Allocations>(allocations, GROUP_IDS, ALLOCATIONS, Allocation.None);

export const decodeFocuses = (code: string): Focuses => decode<Focuses>(code, STATE_IDS, FOCUSES, Focus.No);

export const encodeFocuses = (focuses: Focuses): string => encode<Focuses>(focuses, STATE_IDS, FOCUSES, Focus.No);

export const alternatingCaseToGraphicProps = (alternatingCase: string) => {
  const graphicProps = acto(alternatingCase);

  graphicProps.allocations = decodeAllocations(graphicProps.allocations);
  graphicProps.focuses = decodeFocuses(graphicProps.focuses);

  // Support deprecated marker prop values
  if (graphicProps.relative === 'null') {
    graphicProps.relative = null;
  }

  return graphicProps;
};

export const graphicPropsToAlternatingCase = (graphicProps, defaultGraphicProps?): string =>
  Object.keys(graphicProps).reduce((alternatingCase, key) => {
    // We never export tappableLayer
    if (key === 'tappableLayer') {
      return alternatingCase;
    }

    const value = graphicProps[key];

    // We never export defaults
    if (defaultGraphicProps && defaultGraphicProps[key] === value) {
      return alternatingCase;
    }

    alternatingCase += key.toUpperCase();

    if (key === 'allocations') {
      alternatingCase += encodeAllocations(value);
    } else if (key === 'focuses') {
      alternatingCase += encodeFocuses(value);
    } else if (typeof value === 'boolean') {
      alternatingCase += value ? 'true' : 'false';
    } else if (value === null) {
      alternatingCase += 'null';
    } else {
      alternatingCase += value;
    }

    return alternatingCase;
  }, '');

export const urlQueryToGraphicProps = (urlQuery: string) => {
  if (urlQuery.length < 2) {
    return null;
  }

  const graphicProps = JSON.parse(
    '{"' + urlQuery.substring(1).replace(/&/g, '","').replace(/=/g, '":"') + '"}',
    (key, value) => (key === '' ? value : decodeURIComponent(value))
  );

  graphicProps.allocations = decodeAllocations(graphicProps.allocations);
  graphicProps.focuses = decodeFocuses(graphicProps.focuses);

  if (typeof graphicProps.year === 'string') {
    graphicProps.year = +graphicProps.year;
  }

  if (typeof graphicProps.relative === 'string') {
    graphicProps.relative = graphicProps.relative === 'null' ? null : +graphicProps.relative;
  }

  if (typeof graphicProps.counting === 'string') {
    graphicProps.counting = graphicProps.counting === 'true';
  }

  if (typeof graphicProps.tappableLayer === 'string') {
    graphicProps.tappableLayer = +graphicProps.tappableLayer;
  }

  return graphicProps;
};

export const graphicPropsToUrlQuery = (graphicProps, defaultGraphicProps?): string =>
  Object.keys(graphicProps).reduce((urlQuery, key) => {
    // We never export tappableLayer
    if (key === 'tappableLayer') {
      return urlQuery;
    }

    const value = graphicProps[key];

    // We never export defaults
    if (defaultGraphicProps && defaultGraphicProps[key] === value) {
      return urlQuery;
    }

    urlQuery += (urlQuery.length > 0 ? '&' : '?') + key + '=';

    if (key === 'allocations') {
      urlQuery += encodeAllocations(value);
    } else if (key === 'focuses') {
      urlQuery += encodeFocuses(value);
    } else if (typeof value === 'boolean') {
      urlQuery += value ? 'true' : 'false';
    } else {
      urlQuery += value;
    }

    return urlQuery;
  }, '');

export const getPartyIdForAllocation = (allocation: Allocation): PartyId =>
  allocation === Allocation.Dem ? 'dem' : allocation === Allocation.GOP ? 'gop' : 'oth';

export const getAllocationForPartyID = (partyID: PartyId): Allocation =>
  partyID === 'dem' ? Allocation.Dem : partyID === 'gop' ? Allocation.GOP : Allocation.None;

export const liveResultsToGraphicProps = data =>
  Object.keys(data.s).reduce(
    (memo, stateID) => {
      const result = data.s[stateID];
      const stateWinningPartyID = result.w;
      const stateAllocation = getAllocationForPartyID(stateWinningPartyID);

      if (stateAllocation !== Allocation.None) {
        switch (stateID) {
          case 'ME':
          case 'NE':
            const allocations = new Array(result.e - 1).fill(Allocation.None);

            new Array(result[stateWinningPartyID].e - 1).fill(0).forEach((_, index) => {
              allocations[index] = stateAllocation === Allocation.Dem ? Allocation.Dem : Allocation.GOP;
            });

            new Array(result[stateWinningPartyID === 'gop' ? 'dem' : 'gop'].e).fill(0).forEach((_, index) => {
              allocations[allocations.length - (1 + index)] =
                stateAllocation === Allocation.Dem ? Allocation.GOP : Allocation.Dem;
            });

            allocations.forEach((allocation, index) => {
              memo.allocations[`${stateID}_${index}`] = allocation;
            });
            break;
          case 'NE':
            break;
          default:
            memo.allocations[stateID] = stateAllocation;
            break;
        }
      }

      return memo;
    },
    {
      allocations: { ...INITIAL_ALLOCATIONS },
      year: DEFAULT_ELECTION_YEAR,
      relative: DEFAULT_RELATIVE_ELECTION_YEAR
    }
  );
