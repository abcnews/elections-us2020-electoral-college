import type { ScrollytellerDefinition } from '@abcnews/scrollyteller';
import Scrollyteller from '@abcnews/scrollyteller';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
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

    let prevTop: number = 0;
    let prevBottom: number = 0;
    let prevStage: string = 'initial';

    const onUpdate: OdysseySchedulerSubscriber = ({ fixedHeight }) => {
      const { top, bottom } = blockEl.getBoundingClientRect();
      const isAbove = top > 0;
      const isBelow = bottom < fixedHeight;
      const stage = isAbove ? 'above' : isBelow ? 'below' : 'during';

      if (stage !== prevStage) {
        mediaEl.setAttribute('data-stage', stage);

        if (prevStage !== 'initial' && mediaEl.animate) {
          const catchupDiff = isBelow ? prevBottom - bottom : top - prevTop;

          mediaEl.animate([{ transform: `translate3D(0, ${catchupDiff}px, 0)` }, { transform: 'none' }], {
            duration: 250,
            easing: 'cubic-bezier(0.22,0.61,0.36,1)',
            fill: 'both',
            iterations: 1
          });
        }
      }

      prevTop = top;
      prevBottom = bottom;
      prevStage = stage;
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
