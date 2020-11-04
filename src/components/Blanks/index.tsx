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
  const [hasInteracted, setHasInteracted] = useState(false);

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

    if (!hasInteracted) {
      setHasInteracted(true);
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
    // const relativeAllocation =
    //   PRESETS[fixedGraphicProps.relative || DEFAULT_RELATIVE_ELECTION_YEAR].allocations[groupID] || Allocation.Dem;
    // nextAudienceAllocations[groupID] =
    //   allocation === Allocation.LikelyDem
    //     ? Allocation.LikelyGOP
    //     : allocation === Allocation.LikelyGOP
    //     ? Allocation.LikelyDem
    //     : relativeAllocation === Allocation.Dem
    //     ? Allocation.LikelyDem
    //     : Allocation.LikelyGOP;

    // Strategy 4)
    // Cycle between relative incumbent, challenger and none
    const relativeIncumbentAllocation =
      PRESETS[fixedGraphicProps.relative || DEFAULT_RELATIVE_ELECTION_YEAR].allocations[groupID] || Allocation.Dem;
    const relativeChallengerAllocation =
      relativeIncumbentAllocation === Allocation.Dem ? Allocation.GOP : Allocation.Dem;

    switch (allocation) {
      case relativeIncumbentAllocation:
        nextAudienceAllocations[groupID] = relativeChallengerAllocation;
        break;
      case relativeChallengerAllocation:
        nextAudienceAllocations[groupID] = Allocation.None;
        break;
      default:
        nextAudienceAllocations[groupID] = relativeIncumbentAllocation;
        break;
    }

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
    <div className={styles.root} data-has-interacted={hasInteracted ? '' : undefined}>
      <div className={styles.graphic}>
        <Graphic {...graphicProps} />
      </div>
      {hasInteracted ? null : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 255" width="80" height="104" className={styles.hint}>
          <g>
            <path
              d="M49.5 140.2v-2.5V24.4c0-7.1 4.3-13.1 11-15.3 6.5-2.2 13.7.1 17.9 5.7 2.1 2.8 3.1 6.1 3.1 9.6V78.7c5.4-6.2 11.7-7.9 18.9-4.7 7.1 3.1 9.8 9.1 9.4 17.2 5.1-5.4 11.1-6.8 17.6-5.1 6.8 1.8 10.6 6.4 11.7 13.6.7-.4 1.2-.8 1.7-1.1 5.3-3.5 10.7-3.8 16.2-.8s8.4 7.8 8.4 14.2v74c0 27.2-19.6 51-46.3 56.3-25.3 5-49.9-6.4-62.6-28.9-16.6-29.6-33.4-59.1-50.2-88.6-.9-1.5-.7-2.3.5-3.5 9.5-9.3 23.2-8.1 30.9 2.8 3.5 4.9 7 9.8 10.5 14.8.4.1.7.5 1.3 1.3z"
              fill="#b3b3b3"
            />
          </g>
        </svg>
      )}
    </div>
  );
};

export default Blanks;
