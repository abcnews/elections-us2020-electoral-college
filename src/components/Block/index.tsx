import type { ScrollytellerDefinition } from '@abcnews/scrollyteller';
import Scrollyteller from '@abcnews/scrollyteller';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { OdysseySchedulerSubscriber } from '../../index';
import type { GraphicProps } from '../Graphic';
import Graphic from '../Graphic';
import styles from './styles.scss';

interface BlockProps {
  scrollytellerDefinition: ScrollytellerDefinition<GraphicProps>;
}

const Block: React.FC<BlockProps> = ({ scrollytellerDefinition }) => {
  const { subscribe, unsubscribe } = window.__ODYSSEY__.scheduler;
  const graphicRef = useRef<HTMLDivElement>(null);
  const [graphicProps, setGraphicProps] = useState(scrollytellerDefinition.panels[0].data);
  const onMarker = useCallback(graphicProps => setGraphicProps(graphicProps), []);

  useEffect(() => {
    const graphicEl = graphicRef.current;

    if (!graphicEl) {
      return;
    }

    const mediaEl = graphicEl.parentElement;

    if (!mediaEl) {
      return;
    }

    const blockEl = mediaEl.parentElement;

    if (!blockEl) {
      return;
    }

    let tY: number = 0;

    const onUpdate: OdysseySchedulerSubscriber = ({ fixedHeight }) => {
      const { top, bottom } = blockEl.getBoundingClientRect();
      const prevTY = tY;

      tY =
        top > 0
          ? Math.min(top / fixedHeight, 1)
          : bottom < fixedHeight
          ? Math.max((bottom - fixedHeight) / fixedHeight, -1)
          : 0;

      if (tY !== prevTY) {
        mediaEl.style.transform = `translate3d(0, ${tY * 100}%, 0)`;
      }
    };

    subscribe(onUpdate);

    return () => unsubscribe(onUpdate);
  }, [graphicRef.current]);

  return (
    <Scrollyteller
      className={styles.scrollyteller}
      panelClassName={styles.panel}
      firstPanelClassName={styles.firstPanel}
      lastPanelClassName={styles.lastPanel}
      panels={scrollytellerDefinition.panels}
      onMarker={onMarker}
      theme="light"
    >
      <div ref={graphicRef} className={styles.graphic}>
        <Graphic {...graphicProps} />
      </div>
    </Scrollyteller>
  );
};

export default Block;
