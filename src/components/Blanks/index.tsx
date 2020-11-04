import React, { useEffect, useMemo, useState } from 'react';
import {
  Allocation,
  Allocations,
  DEFAULT_ELECTION_YEAR,
  DEFAULT_RELATIVE_ELECTION_YEAR,
  Focus,
  PRESETS
} from '../../constants';
import { loadData } from '../../data';
import { getStateIDForGroupID, liveResultsToGraphicProps } from '../../utils';
import Graphic, { GraphicProps } from '../Graphic';
import { TappableLayer } from '../Tilegram';
import styles from './styles.scss';

export type BlanksProps = {
  isLive?: boolean;
  initialGraphicProps?: GraphicProps;
};

const defaultGraphicProps = {
  year: DEFAULT_ELECTION_YEAR,
  relative: DEFAULT_RELATIVE_ELECTION_YEAR
};

const Blanks: React.FC<BlanksProps> = ({ isLive, initialGraphicProps }) => {
  const [fixedGraphicProps, setFixedGraphicProps] = useState<GraphicProps>(defaultGraphicProps);
  const [audienceAllocations, setAudienceAllocations] = useState<Allocations>({});

  const onTapGroup = (groupID: string) => {
    if (!fixedGraphicProps || !fixedGraphicProps.allocations) {
      return console.error('No fixed results yet');
    }

    if (
      fixedGraphicProps.allocations[groupID] === Allocation.Dem ||
      fixedGraphicProps.allocations[groupID] === Allocation.GOP
    ) {
      return console.error(`${groupID} is already called`);
    }

    const allocation = audienceAllocations[groupID] || Allocation.None;
    const nextAudienceAllocations = {
      ...audienceAllocations
    };

    // Strategy 1)
    // Cycle to the next Allocation in the enum (or the first if we don't recognise it)
    // const allocationIndex = ALLOCATIONS.indexOf(allocation);
    // nextAudienceAllocations[groupID] = ALLOCATIONS[
    //   allocationIndex === ALLOCATIONS.length - 1 ? 0 : allocationIndex + 1
    // ] as Allocation;

    // Strategy 2)
    // If not allocated to either party, allocate to the incumbent (if we have a relative year) or Dem.
    // If alloated to a party, allocate to the other.
    // const relativeAllocation = PRESETS[fixedGraphicProps.relative || DEFAULT_RELATIVE_ELECTION_YEAR].allocations[groupID] || Allocation.Dem
    // nextAudienceAllocations[groupID] =
    //   allocation === Allocation.Dem
    //     ? Allocation.GOP
    //     : allocation === Allocation.GOP
    //     ? Allocation.Dem
    //     : relativeAllocation;

    // Strategy 3)
    // Same as Strategy 2, but allocates Likely{X} instead
    const relativeAllocation =
      PRESETS[fixedGraphicProps.relative || DEFAULT_RELATIVE_ELECTION_YEAR].allocations[groupID] || Allocation.Dem;
    nextAudienceAllocations[groupID] =
      allocation === Allocation.LikelyDem
        ? Allocation.LikelyGOP
        : allocation === Allocation.LikelyGOP
        ? Allocation.LikelyDem
        : relativeAllocation === Allocation.Dem
        ? Allocation.LikelyDem
        : Allocation.LikelyGOP;

    setAudienceAllocations(nextAudienceAllocations);
  };

  const graphicProps = useMemo(() => {
    return {
      ...defaultGraphicProps,
      ...fixedGraphicProps,
      allocations: {
        ...fixedGraphicProps.allocations,
        ...audienceAllocations
      },
      tappableLayer: TappableLayer.Delegates,
      onTapGroup
    };
  }, [fixedGraphicProps, audienceAllocations]);

  useEffect(() => {
    function registerFixedGraphicsProps(graphicProps) {
      const allocations = graphicProps.allocations || {};
      const focuses = {};

      Object.keys(allocations).forEach(groupID => {
        const allocation = allocations[groupID];
        const stateID = getStateIDForGroupID(groupID);

        focuses[stateID] = allocation === Allocation.Dem || allocation === Allocation.GOP ? Focus.No : Focus.Yes;
      });

      setFixedGraphicProps({
        ...graphicProps,
        allocations,
        focuses
      });
    }

    if (initialGraphicProps) {
      registerFixedGraphicsProps(initialGraphicProps);
    } else if (isLive) {
      loadData({}).then(data => registerFixedGraphicsProps(liveResultsToGraphicProps(data)));
    } else {
      console.error('No graphic props to register');
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.graphic}>
        <Graphic {...graphicProps} />
      </div>
    </div>
  );
};

export default Blanks;
