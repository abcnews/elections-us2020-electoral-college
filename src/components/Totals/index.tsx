import React, { useMemo } from 'react';
import { Allocation, Allocations } from '../../constants';
import { getVoteCountsForAllocations } from '../../utils';
import styles from './styles.scss';

export type TotalsProps = {
  allocations?: Allocations;
};

const Totals: React.FC<TotalsProps> = props => {
  const { allocations } = props;
  const voteCounts = useMemo(() => getVoteCountsForAllocations(allocations || {}), [allocations]);

  return (
    <div className={styles.root}>
      {[
        `Dem.: ${voteCounts[Allocation.Dem]}`,
        `Likely Dem.: ${voteCounts[Allocation.LikelyDem]}`,
        `Tossup: ${voteCounts[Allocation.Tossup]}`,
        `Likely GOP: ${voteCounts[Allocation.LikelyGOP]}`,
        `GOP: ${voteCounts[Allocation.GOP]}`,
        `Unallocated: ${voteCounts[Allocation.None]}`
      ].join('; ')}
    </div>
  );
};

export default Totals;
