import type { ScrollytellerDefinition } from '@abcnews/scrollyteller';
import Scrollyteller from '@abcnews/scrollyteller';
import React, { useCallback, useState } from 'react';
import type { GraphicProps } from '../Graphic';
import Graphic from '../Graphic';
import styles from './styles.scss';

interface BlockProps {
  scrollytellerDefinition: ScrollytellerDefinition<GraphicProps>;
}

const Block: React.FC<BlockProps> = ({ scrollytellerDefinition }) => {
  const [graphicProps, setGraphicProps] = useState(scrollytellerDefinition.panels[0].data);
  const onMarker = useCallback(graphicProps => setGraphicProps(graphicProps), []);

  return (
    <Scrollyteller
      className={styles.scrollyteller}
      panelClassName={styles.panel}
      firstPanelClassName={styles.firstPanel}
      panels={scrollytellerDefinition.panels}
      onMarker={onMarker}
    >
      <div className={styles.graphic}>
        <Graphic {...graphicProps} />
      </div>
    </Scrollyteller>
  );
};

export default Block;
