import React, { useEffect, useMemo, useState } from 'react';
import {
  Allocation,
  Allocations,
  ALLOCATIONS,
  DEFAULT_ELECTION_YEAR,
  DEFAULT_RELATIVE_ELECTION_YEAR,
  Focus
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
    const allocationIndex = ALLOCATIONS.indexOf(allocation);
    const nextAudienceAllocations = {
      ...audienceAllocations
    };

    // Cycle to the next Allocation in the enum (or the first if we don't recognise it)
    nextAudienceAllocations[groupID] = ALLOCATIONS[
      allocationIndex === ALLOCATIONS.length - 1 ? 0 : allocationIndex + 1
    ] as Allocation;

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
