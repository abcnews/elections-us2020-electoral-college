import React, { useEffect, useMemo, useRef } from 'react';
import { Allocation, Allocations } from '../../constants';
import { getVoteCountsForAllocations } from '../../utils';
import styles from './styles.scss';

const MAX_VOTES = 538;
const WIN_VOTES = Math.ceil((MAX_VOTES + 1) / 2);

const YEARS_ALLOCATIONS_CANDIDATES = {
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

export type TotalsYear = keyof typeof YEARS_ALLOCATIONS_CANDIDATES;

export const YEARS = Object.keys(YEARS_ALLOCATIONS_CANDIDATES)
  .reverse()
  .map(x => +x as TotalsYear);
export const DEFAULT_YEAR = YEARS[0];

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export type TotalsProps = {
  year?: TotalsYear;
  allocations?: Allocations;
};

const Totals: React.FC<TotalsProps> = props => {
  const { allocations, year } = props;
  const voteCounts = useMemo(() => getVoteCountsForAllocations(allocations || {}), [allocations]);
  const sides = useMemo(() => YEARS_ALLOCATIONS_CANDIDATES[year || DEFAULT_YEAR], [year]);
  const incumbent = useMemo(() => Object.keys(sides)[0], [sides]);
  const previousIncumbent = usePrevious(incumbent);

  const tX = (votes: number, side: Allocation) =>
    side === incumbent ? (votes / MAX_VOTES) * 100 - 100 : (votes / MAX_VOTES) * -100 + 100;

  return (
    <div
      className={styles.root}
      data-incumbent={incumbent}
      data-consistent-incumbent={incumbent === previousIncumbent ? '' : undefined}
    >
      <div className={styles.text}>
        {Object.keys(sides).map(allocation => (
          <div key={allocation} className={styles.side} data-allocation={allocation}>
            <span className={styles.label}>{sides[allocation]}</span>
            <span className={styles.value}>{voteCounts[allocation]}</span>
          </div>
        ))}
      </div>
      <div className={styles.track}>
        <div
          className={styles.bar}
          title={`Likely Dem.: ${voteCounts[Allocation.LikelyDem]}`}
          data-allocation={Allocation.LikelyDem}
          style={{
            transform: `translate(${tX(
              voteCounts[Allocation.Dem] + voteCounts[Allocation.LikelyDem],
              Allocation.Dem
            )}%, 0)`
          }}
        ></div>
        <div
          className={styles.bar}
          title={`Likely GOP: ${voteCounts[Allocation.LikelyGOP]}`}
          data-allocation={Allocation.LikelyGOP}
          style={{
            transform: `translate(${tX(
              voteCounts[Allocation.GOP] + voteCounts[Allocation.LikelyGOP],
              Allocation.GOP
            )}%, 0)`
          }}
        ></div>
        <div
          className={styles.bar}
          title={`Dem.: ${voteCounts[Allocation.Dem]}`}
          data-allocation={Allocation.Dem}
          style={{ transform: `translate(${tX(voteCounts[Allocation.Dem], Allocation.Dem)}%, 0)` }}
        ></div>
        <div
          className={styles.bar}
          title={`GOP: ${voteCounts[Allocation.GOP]}`}
          data-allocation={Allocation.GOP}
          style={{ transform: `translate(${tX(voteCounts[Allocation.GOP], Allocation.GOP)}%, 0)` }}
        ></div>
        <div className={styles.midpoint}>
          <div className={styles.midpointLabel}>{`${WIN_VOTES} to win`}</div>
        </div>
      </div>
    </div>
  );
};

export default Totals;
