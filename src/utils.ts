import * as acto from '@abcnews/alternating-case-to-object';
import {
  Allocation,
  Allocations,
  ALLOCATIONS,
  GROUP_IDS,
  Group,
  GroupID,
  STATE_IDS,
  Wall,
  Walls,
  WALLS
} from './constants';

export const votesForGroups = (groups: Group[]) => {
  return groups.reduce((memo, group) => {
    return memo + group.votes;
  }, 0);
};

export const getGroupIDForDelegateID = (delegateID: string) => {
  const [stateID, delegateIndex] = delegateID.split('-');

  return `${stateID}${GroupID[stateID] != null ? '' : `_${Math.max(0, parseInt(delegateIndex) - 2)}`}`;
};

function decode<Dict>(code: string, keys: string[], possibleValues: string[], defaultValue: string): Dict {
  code = code && code.length === keys.length ? code : defaultValue.repeat(keys.length);

  return keys.reduce((dict, key, index) => {
    const value = code[index];

    dict[key] = possibleValues.indexOf(value) > -1 ? value : defaultValue;

    return dict;
  }, {} as Dict);
}

function encode<Dict>(dict: Dict, keys: string[], possibleValues: string[], defaultValue: string): string {
  return keys.reduce(
    (memo, key) => (memo += dict && possibleValues.indexOf(dict[key]) > -1 ? dict[key] : defaultValue),
    ''
  );
}

export const decodeAllocations = (code: string): Allocations =>
  decode<Allocations>(code, GROUP_IDS, ALLOCATIONS, Allocation.None);

export const encodeAllocations = (allocations: Allocations): string =>
  encode<Allocations>(allocations, GROUP_IDS, ALLOCATIONS, Allocation.None);

export const decodeWalls = (code: string): Walls => decode<Walls>(code, STATE_IDS, WALLS, Wall.No);

export const encodeWalls = (walls: Walls): string => encode<Walls>(walls, STATE_IDS, WALLS, Wall.No);

export const alternatingCaseToGraphicProps = (alternatingCase: string) => {
  const graphicProps = acto(alternatingCase);

  graphicProps.allocations = decodeAllocations(graphicProps.allocations);
  graphicProps.walls = decodeWalls(graphicProps.walls);

  return graphicProps;
};

export const graphicPropsToAlternatingCase = (graphicProps): string =>
  Object.keys(graphicProps).reduce((alternatingCase, key) => {
    if (key === 'tappableLayer') {
      return alternatingCase;
    }

    const value = graphicProps[key];

    alternatingCase += key.toUpperCase();

    if (key === 'allocations') {
      alternatingCase += encodeAllocations(value);
    } else if (key === 'walls') {
      alternatingCase += encodeWalls(value);
    } else if (typeof value === 'boolean') {
      alternatingCase += value ? 'true' : 'false';
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
  graphicProps.walls = decodeWalls(graphicProps.walls);

  if (typeof graphicProps.tappableLayer === 'string') {
    graphicProps.tappableLayer = +graphicProps.tappableLayer;
  }

  return graphicProps;
};

export const graphicPropsToUrlQuery = (graphicProps): string =>
  Object.keys(graphicProps).reduce((urlQuery, key, index) => {
    const value = graphicProps[key];

    urlQuery += (index ? '&' : '?') + key + '=';

    if (key === 'allocations') {
      urlQuery += encodeAllocations(value);
    } else if (key === 'walls') {
      urlQuery += encodeWalls(value);
    } else if (typeof value === 'boolean') {
      urlQuery += value ? 'true' : 'false';
    } else {
      urlQuery += value;
    }

    return urlQuery;
  }, '');
