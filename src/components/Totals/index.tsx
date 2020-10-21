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

  return (
    <div className={styles.root}>
      <div className={styles.track}>
        <div
          className={styles.bar}
          title={`Likely Dem.: ${voteCounts[Allocation.LikelyDem]}`}
          data-allocation={Allocation.LikelyDem}
          style={{
            transform: `scale(${(voteCounts[Allocation.Dem] + voteCounts[Allocation.LikelyDem]) / MAX_VOTES}, 1)`
          }}
        ></div>
        <div
          className={styles.bar}
          title={`Likely GOP: ${voteCounts[Allocation.LikelyGOP]}`}
          data-allocation={Allocation.LikelyGOP}
          style={{
            transform: `scale(${(voteCounts[Allocation.GOP] + voteCounts[Allocation.LikelyGOP]) / MAX_VOTES}, 1)`
          }}
        ></div>
        <div
          className={styles.bar}
          title={`Dem.: ${voteCounts[Allocation.Dem]}`}
          data-allocation={Allocation.Dem}
          style={{ transform: `scale(${voteCounts[Allocation.Dem] / MAX_VOTES}, 1)` }}
        ></div>
        <div
          className={styles.bar}
          title={`GOP: ${voteCounts[Allocation.GOP]}`}
          data-allocation={Allocation.GOP}
          style={{ transform: `scale(${voteCounts[Allocation.GOP] / MAX_VOTES}, 1)` }}
        ></div>
        <div className={styles.win}>
          <div className={styles.winLabel}>270 to win</div>
        </div>
        <div className={styles.icon} data-allocation={Allocation.Dem}></div>
        <div className={styles.icon} data-allocation={Allocation.GOP}></div>
      </div>
    </div>
  );
};

export default Totals;
