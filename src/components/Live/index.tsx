import type { Combined, PartyId } from 'elections-us2020-results-data';
import React, { useEffect, useState } from 'react';
import {
  Allocation,
  State,
  StateID,
  STATES,
  ELECTION_YEARS_ALLOCATIONS_CANDIDATES,
  DEFAULT_ELECTION_YEAR
} from '../../constants';
import { loadData } from '../../data';
import styles from './styles.scss';

interface LiveProps {
  stateCode: string;
}

const ALLOCATIONS_CANDIDATES = ELECTION_YEARS_ALLOCATIONS_CANDIDATES[DEFAULT_ELECTION_YEAR];
ALLOCATIONS_CANDIDATES[Allocation.Tossup] = 'Other';

const getAllocationForPartyId = (partyId: PartyId): Allocation =>
  partyId === 'dem' ? Allocation.Dem : partyId === 'gop' ? Allocation.GOP : Allocation.Tossup;

const getPartyIdForAllocation = (allocation: Allocation): PartyId =>
  allocation === Allocation.Dem ? 'dem' : allocation === Allocation.GOP ? 'gop' : 'oth';

const Live: React.FC<LiveProps> = ({ stateCode }) => {
  const stateID: number | undefined = StateID[stateCode];

  if (typeof stateID !== 'number') {
    return <div data-unrecognised-state={stateCode}></div>;
  }

  useEffect(() => {
    // loadData('firebase').then(data => setData(setStateData(data.s.)); // When Andrew stops updating /dat/
    loadData().then(data => setResult(data.s[stateCode]));
  }, []);

  const state: State = STATES.find(({ id }) => stateID === id) as State; // We can assume stateID will match
  const [result, setResult] = useState<Combined.Result>();

  if (!result) {
    return <div data-loading={stateCode}></div>;
  }

  return (
    <div className={styles.root}>
      <h4 className={styles.title}>{state.name}</h4>
      <div className={styles.votes}>{`Electoral college votes: ${result.e}`}</div>
      <div className={styles.results}>
        {(Object.keys(ALLOCATIONS_CANDIDATES) as Allocation[]).map(allocation => {
          const { v, vp, e } = result[getPartyIdForAllocation(allocation)];
          return (
            <div key={allocation} className={styles.result} data-allocation={allocation}>
              <strong>{ALLOCATIONS_CANDIDATES[allocation]}</strong>
              {` ${vp}%`}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Live;
