import type { PanelDefinition } from '@abcnews/scrollyteller';
import Scrollyteller from '@abcnews/scrollyteller';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { OdysseySchedulerSubscriber } from '../../index';
import type { GraphicProps } from '../Graphic';
import Graphic from '../Graphic';
import styles from './styles.scss';

interface BlockProps {
  panels: PanelDefinition<GraphicProps>[];
}

const Block: React.FC<BlockProps> = ({ panels }) => {
  const { subscribe, unsubscribe } = window.__ODYSSEY__.scheduler;
  const graphicRef = useRef<HTMLDivElement>(null);
  const [graphicProps, setGraphicProps] = useState(panels[0].data);
  const onMarker = useCallback(graphicProps => {
    setGraphicProps(graphicProps);
  }, []);

  useLayoutEffect(() => {
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

    if (window.navigator.userAgent.indexOf('Trident/') > -1) {
      mediaEl.setAttribute('data-ie', '');
    }

    let recentTops: number[] = [];
    let lastUpdateTime: number = 0;
    let prevStage: string = 'initial';

    const onUpdate: OdysseySchedulerSubscriber = ({ fixedHeight }) => {
      const updateTime = Date.now();
      const { top, bottom } = blockEl.getBoundingClientRect();
      const stage = top > 0 ? 'above' : bottom < fixedHeight ? 'below' : 'during';

      if (stage !== prevStage) {
        mediaEl.setAttribute('data-stage', stage);

        if (prevStage !== 'initial' && mediaEl.animate) {
          const catchupDistance = top - recentTops[0];
          const catchupDuration = 250 / recentTops.length;

          mediaEl.animate([{ transform: `translate3D(0, ${catchupDistance}px, 0)` }, { transform: 'none' }], {
            duration: catchupDuration,
            easing: 'cubic-bezier(0.22,0.61,0.36,1)',
            fill: 'both',
            iterations: 1
          });

          recentTops = [];
        }
      } else {
        // Retain last 3 top values (resets when stage changes or 30ms passes between frames)
        if (updateTime - lastUpdateTime > 30) {
          recentTops = [];
        } else if (recentTops.length >= 3) {
          recentTops.shift();
        }

        recentTops.push(top);
      }

      prevStage = stage;
      lastUpdateTime = updateTime;
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
      panels={panels}
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
