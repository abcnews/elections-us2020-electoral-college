import type { ScrollytellerDefinition } from '@abcnews/scrollyteller';
import Scrollyteller from '@abcnews/scrollyteller';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PRESETS } from '../../constants';
import { determineIfAllocationIsDefinitive, determineIfAllocationIsMade, getStateAllocations } from '../../utils';
import type { GraphicProps } from '../Graphic';
import Graphic from '../Graphic';
import styles from './styles.scss';

interface BlockProps {
  scrollytellerDefinition: ScrollytellerDefinition<GraphicProps>;
}

const Block: React.FC<BlockProps> = ({ scrollytellerDefinition }) => {
  const [graphicProps, setGraphicProps] = useState(scrollytellerDefinition.panels[0].data);
  const onMarker = useCallback(graphicProps => setGraphicProps(graphicProps), []);
  const panelsStateEls = useRef<HTMLSpanElement[]>();

  const { allocations, relative } = graphicProps;
  const relativeAllocations = relative && PRESETS[relative]?.allocations;

  useEffect(() => {
    panelsStateEls.current = scrollytellerDefinition.panels.reduce<HTMLSpanElement[]>((memo, { nodes }) => {
      nodes.forEach(node => (memo = memo.concat(Array.from((node as Element).querySelectorAll(`.${styles.state}`)))));

      return memo;
    }, []);
  }, []);

  useEffect(() => {
    if (panelsStateEls.current) {
      panelsStateEls.current.forEach(el => {
        const stateID = el.getAttribute('data-state');

        if (stateID) {
          const stateMainAllocation = allocations && getStateAllocations(stateID, allocations)[0];
          const isDefinitiveMainAllocation =
            stateMainAllocation && determineIfAllocationIsDefinitive(stateMainAllocation);
          const stateRelativeMainAllocation =
            relativeAllocations && getStateAllocations(stateID, relativeAllocations)[0];

          if (stateMainAllocation) {
            el.setAttribute('data-main-allocation', stateMainAllocation);
          } else {
            el.removeAttribute('data-main-allocation');
          }

          if (isDefinitiveMainAllocation) {
            el.setAttribute('data-is-definitive-main-allocation', '');
          } else {
            el.removeAttribute('data-is-definitive-main-allocation');
          }

          if (stateRelativeMainAllocation) {
            el.setAttribute('data-relative-main-allocation', stateRelativeMainAllocation);
          } else {
            el.removeAttribute('data-relative-main-allocation');
          }
        }
      });
    }
  }, [graphicProps]);

  return (
    <Scrollyteller
      className={styles.scrollyteller}
      panelClassName={styles.panel}
      firstPanelClassName={styles.firstPanel}
      panels={scrollytellerDefinition.panels}
      onMarker={onMarker}
      theme="light"
    >
      <div className={styles.graphic}>
        <Graphic {...graphicProps} />
      </div>
    </Scrollyteller>
  );
};

export default Block;
