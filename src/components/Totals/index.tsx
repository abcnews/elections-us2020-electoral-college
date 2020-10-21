import React, { useMemo } from 'react';
import { Allocation, Allocations } from '../../constants';
import { getVoteCountsForAllocations } from '../../utils';
import styles from './styles.scss';

export type TotalsProps = {
  allocations?: Allocations;
};

const MAX_VOTES = 538;
const WIN_VOTES = Math.ceil(MAX_VOTES / 2);

const Totals: React.FC<TotalsProps> = props => {
  const { allocations } = props;
  const voteCounts = useMemo(() => getVoteCountsForAllocations(allocations || {}), [allocations]);
  const isMostlyAllocated = MAX_VOTES - voteCounts[Allocation.Dem] - voteCounts[Allocation.GOP] < 100;
  // const isCloseToLine =
  //   Math.abs(WIN_VOTES - voteCounts[Allocation.Dem]) < 25 || Math.abs(WIN_VOTES - voteCounts[Allocation.GOP]) < 25;

  return (
    <div
      className={styles.root}
      // data-is-close-to-line={isCloseToLine ? '' : undefined}
      data-is-mostly-allocated={isMostlyAllocated ? '' : undefined}
    >
      <div className={styles.track}>
        <div className={styles.winLine}>
          <div className={styles.label}>270 to win</div>
        </div>
        <div className={styles.bar}></div>
        <div
          className={styles.bar}
          title={`Likely Dem.: ${voteCounts[Allocation.LikelyDem]}`}
          data-allocation={Allocation.LikelyDem}
          style={{
            transform: `translate(${
              ((voteCounts[Allocation.Dem] + voteCounts[Allocation.LikelyDem]) / MAX_VOTES) * -100 + 100
            }%, 0)`
          }}
        >
          <div className={styles.edge}></div>
        </div>
        <div
          className={styles.bar}
          title={`Likely GOP: ${voteCounts[Allocation.LikelyGOP]}`}
          data-allocation={Allocation.LikelyGOP}
          style={{
            transform: `translate(${
              ((voteCounts[Allocation.GOP] + voteCounts[Allocation.LikelyGOP]) / MAX_VOTES) * 100 - 100
            }%, 0)`
          }}
        >
          <div className={styles.edge}></div>
        </div>
        <div
          className={styles.bar}
          title={`Dem.: ${voteCounts[Allocation.Dem]}`}
          data-allocation={Allocation.Dem}
          style={{ transform: `translate(${(voteCounts[Allocation.Dem] / MAX_VOTES) * -100 + 100}%, 0)` }}
        >
          <div className={styles.edge}>
            <div className={styles.label} data-votes={voteCounts[Allocation.Dem]}>
              {voteCounts[Allocation.Dem]}
            </div>
          </div>
        </div>
        <div
          className={styles.bar}
          title={`GOP: ${voteCounts[Allocation.GOP]}`}
          data-allocation={Allocation.GOP}
          style={{ transform: `translate(${(voteCounts[Allocation.GOP] / MAX_VOTES) * 100 - 100}%, 0)` }}
        >
          <div className={styles.edge}>
            <div className={styles.label} data-votes={voteCounts[Allocation.GOP]}>
              {voteCounts[Allocation.GOP]}
            </div>
          </div>
        </div>
        <div className={styles.winLine}></div>
        <div className={styles.icon} data-allocation={Allocation.Dem}></div>
        <div className={styles.icon} data-allocation={Allocation.GOP}></div>
      </div>
    </div>
  );
};

export default Totals;
