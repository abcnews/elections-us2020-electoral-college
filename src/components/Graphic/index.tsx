import React from 'react';
import type { TilegramProps } from '../Tilegram';
import Tilegram from '../Tilegram';
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
  const { title, ...tilegramProps } = props;

  return (
    <div className={styles.root} title={title}>
      <Tilegram {...tilegramProps} />
    </div>
  );
};

export default Graphic;
