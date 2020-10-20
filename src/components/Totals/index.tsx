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
        `Democrats: ${voteCounts[Allocation.Dem]}`,
        `Democrats (likely): ${voteCounts[Allocation.LikelyDem]}`,
        `Tossup: ${voteCounts[Allocation.Tossup]}`,
        `Republicans (likely): ${voteCounts[Allocation.LikelyRep]}`,
        `Republicans: ${voteCounts[Allocation.Rep]}`,
        `Unallocated: ${voteCounts[Allocation.None]}`
      ].join('; ')}
    </div>
  );
};

export default Totals;
