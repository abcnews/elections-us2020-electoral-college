import React, { useMemo } from 'react';
import { Allocation, Allocations } from '../../constants';
import { getVoteCountsForAllocations } from '../../utils';
import styles from './styles.scss';

export type TotalsProps = {
  allocations?: Allocations;
};

const MAX_VOTES = 538;
const WIN_VOTES = Math.ceil((MAX_VOTES + 1) / 2);

const Totals: React.FC<TotalsProps> = props => {
  const { allocations } = props;
  const voteCounts = useMemo(() => getVoteCountsForAllocations(allocations || {}), [allocations]);

  return (
    <div className={styles.root}>
      <div className={styles.text}>
        <div className={styles.side} data-allocation={Allocation.GOP}>
          <span className={styles.value}>{voteCounts[Allocation.GOP]}</span>
          <span className={styles.label}>Trump</span>
        </div>
        <div className={styles.side} data-allocation={Allocation.Dem}>
          <span className={styles.label}>Biden</span>
          <span className={styles.value}>{voteCounts[Allocation.Dem]}</span>
        </div>
      </div>
      <div className={styles.track}>
        <div
          className={styles.bar}
          title={`Likely Dem.: ${voteCounts[Allocation.LikelyDem]}`}
          data-allocation={Allocation.LikelyDem}
          style={{
            transform: `translate(${
              ((voteCounts[Allocation.Dem] + voteCounts[Allocation.LikelyDem]) / MAX_VOTES) * -100 + 100
            }%, 0)`
          }}
        ></div>
        <div
          className={styles.bar}
          title={`Likely GOP: ${voteCounts[Allocation.LikelyGOP]}`}
          data-allocation={Allocation.LikelyGOP}
          style={{
            transform: `translate(${
              ((voteCounts[Allocation.GOP] + voteCounts[Allocation.LikelyGOP]) / MAX_VOTES) * 100 - 100
            }%, 0)`
          }}
        ></div>
        <div
          className={styles.bar}
          title={`Dem.: ${voteCounts[Allocation.Dem]}`}
          data-allocation={Allocation.Dem}
          style={{ transform: `translate(${(voteCounts[Allocation.Dem] / MAX_VOTES) * -100 + 100}%, 0)` }}
        ></div>
        <div
          className={styles.bar}
          title={`GOP: ${voteCounts[Allocation.GOP]}`}
          data-allocation={Allocation.GOP}
          style={{ transform: `translate(${(voteCounts[Allocation.GOP] / MAX_VOTES) * 100 - 100}%, 0)` }}
        ></div>
        <div className={styles.midpoint}>
          <div className={styles.midpointLabel}>{`${WIN_VOTES} to win`}</div>
        </div>
      </div>
    </div>
  );
};

export default Totals;
