import React from 'react';
import type { TilegramProps } from '../Tilegram';
import Tilegram from '../Tilegram';
import Totals from '../Totals';
import styles from './styles.scss';

export type GraphicProps = {
  title?: string;
} & TilegramProps;

export type PossiblyEncodedGraphicProps =
  | {
      allocations: string;
      walls: string;
    }
  | GraphicProps;

const Graphic: React.FC<GraphicProps> = props => {
  const { title, allocations, ...otherTilegramProps } = props;

  return (
    <div className={styles.root} title={title}>
      <header>
        <Totals allocations={allocations} />
      </header>
      <Tilegram allocations={allocations} {...otherTilegramProps} />
    </div>
  );
};

export default Graphic;
