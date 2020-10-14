import { ALLOCATIONS, Allocations, Group } from './constants';
import { Allocation, GroupID, GROUP_IDS } from './constants';

// type State = {
//   distribution: Distribution;
//   groups: Group[];
// };

const isGroup = (x: Group | undefined): x is Group => x !== undefined;

// export const groupsForDistribution = (state: State, key: keyof Distribution) => {
//   return state.distribution[key].map(groupID => state.groups.find(({ id }) => id === groupID)).filter(isGroup);
// };

export const votesForGroups = (groups: Group[]) => {
  return groups.reduce((memo, group) => {
    return memo + group.votes;
  }, 0);
};

// export const votesForDistribution = (state: State, key: keyof Distribution) => {
//   return votesForGroups(groupsForDistribution(state, key));
// };

export const getGroupIDForDelegateID = (delegateID: string) => {
  const [stateID, delegateIndex] = delegateID.split('-');

  return `${stateID}${GroupID[stateID] != null ? '' : `_${Math.max(0, parseInt(delegateIndex) - 2)}`}`;
};

export const decodeAllocations = (encodedAllocations): Allocations => {
  encodedAllocations =
    encodedAllocations.length === GROUP_IDS.length ? encodedAllocations : Allocation.None.repeat(GROUP_IDS.length);

  return GROUP_IDS.reduce((allocations, id, index) => {
    const allocation = encodedAllocations[index];
    allocations[id] = ALLOCATIONS.indexOf(allocation) > -1 ? allocation : Allocation.None;
    return allocations;
  }, {});
};

export const encodeAllocations = allocations =>
  GROUP_IDS.reduce((memo, id) => (memo += allocations[id] || Allocation.None), '');
