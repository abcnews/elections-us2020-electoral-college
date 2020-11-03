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
import { getPartyIdForAllocation } from '../../utils';
import { loadData } from '../../data';
import styles from './styles.scss';

interface LiveProps {
  stateCode: string;
  test?: number;
}

const ALLOCATIONS_CANDIDATES = {
  ...ELECTION_YEARS_ALLOCATIONS_CANDIDATES[DEFAULT_ELECTION_YEAR],
  [Allocation.Tossup]: 'Other'
};

const MONTH_SHORTNAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const Live: React.FC<LiveProps> = ({ stateCode, test }) => {
  const stateID: number | undefined = StateID[stateCode];

  if (typeof stateID !== 'number') {
    return <div data-unrecognised-state={stateCode}></div>;
  }

  useEffect(() => {
    // loadData({ server: 'firebase', test }).then(data => setResult(data.s[stateCode])); // When Andrew stops updating /dat/
    loadData({ test }).then(data => setResult(data.s[stateCode]));
  }, []);

  const state: State = STATES.find(({ id }) => stateID === id) as State; // We can assume stateID will match
  const [result, setResult] = useState<Combined.Result>();

  if (!result || !result.cp) {
    return <div data-loading={stateCode}></div>;
  }

  const timeUpdated = result.t !== null ? new Date(result.t) : null;

  return (
    <div className={styles.root} data-test={typeof test === 'number' ? test : undefined}>
      <div className={styles.flex}>
        <h4 className={styles.title}>{state.name}</h4>
        {timeUpdated && <div>{`Updated ${formatTimeUpdated(timeUpdated)}`}</div>}
      </div>
      <div className={styles.flex}>
        <div>{`Electoral college votes: ${result.e}`}</div>
        <div className={styles.results}>
          {(Object.keys(ALLOCATIONS_CANDIDATES) as Allocation[]).map(allocation => {
            const { vp } = result[getPartyIdForAllocation(allocation)];
            return (
              <div key={allocation} className={styles.result} data-allocation={allocation}>
                <strong>{ALLOCATIONS_CANDIDATES[allocation]}</strong>
                {` ${vp}%`}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Live;

const formatTimeUpdated = (time: Date) => {
  const timeString = time.toString();

  return isToday(time)
    ? `${time.getHours() % 12}:${String(time.getMinutes()).padStart(2, '0')}${
        time.getHours() > 12 ? 'a' : 'p'
      }m ${timeString.substring(timeString.indexOf('(')).replace(/([a-z\s]+)/g, '')}`
    : `${time.getDate()} ${MONTH_SHORTNAMES[time.getMonth()]}`;
};
