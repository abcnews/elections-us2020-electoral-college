import * as acto from '@abcnews/alternating-case-to-object';
import { ALLOCATIONS, Allocations, Group } from './constants';
import { Allocation, GroupID, GROUP_IDS } from './constants';

export const votesForGroups = (groups: Group[]) => {
  return groups.reduce((memo, group) => {
    return memo + group.votes;
  }, 0);
};

export const getGroupIDForDelegateID = (delegateID: string) => {
  const [stateID, delegateIndex] = delegateID.split('-');

  return `${stateID}${GroupID[stateID] != null ? '' : `_${Math.max(0, parseInt(delegateIndex) - 2)}`}`;
};

export const decodeAllocations = (encodedAllocations: string): Allocations => {
  encodedAllocations =
    encodedAllocations.length === GROUP_IDS.length ? encodedAllocations : Allocation.None.repeat(GROUP_IDS.length);

  return GROUP_IDS.reduce((allocations, id, index) => {
    const allocation = encodedAllocations[index];
    allocations[id] = ALLOCATIONS.indexOf(allocation) > -1 ? allocation : Allocation.None;
    return allocations;
  }, {});
};

export const encodeAllocations = (allocations: Allocations): string =>
  GROUP_IDS.reduce((memo, id) => (memo += allocations[id] || Allocation.None), '');

export const alternatingCaseToGraphicProps = (alternatingCase: string) => {
  const graphicProps = acto(alternatingCase);

  graphicProps.allocations = decodeAllocations(graphicProps.allocations);

  return graphicProps;
};

export const graphicPropsToAlternatingCase = (graphicProps): string =>
  Object.keys(graphicProps).reduce((alternatingCase, key) => {
    const value = graphicProps[key];

    alternatingCase += key.toUpperCase();

    if (key === 'allocations') {
      alternatingCase += encodeAllocations(value);
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

  return graphicProps;
};

export const graphicPropsToUrlQuery = (graphicProps): string =>
  Object.keys(graphicProps).reduce((urlQuery, key, index) => {
    const value = graphicProps[key];

    urlQuery += (index ? '&' : '?') + key + '=';

    if (key === 'allocations') {
      urlQuery += encodeAllocations(value);
    } else if (typeof value === 'boolean') {
      urlQuery += value ? 'true' : 'false';
    } else {
      urlQuery += value;
    }

    return urlQuery;
  }, '');
