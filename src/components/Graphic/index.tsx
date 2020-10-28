import React from 'react';
import type { TilegramProps } from '../Tilegram';
import Tilegram from '../Tilegram';
import type { TotalsProps } from '../Totals';
import Totals from '../Totals';
import styles from './styles.scss';

export type GraphicProps = {
  title?: string;
  counting?: boolean;
} & TilegramProps &
  TotalsProps;

export type PossiblyEncodedGraphicProps =
  | {
      allocations: string;
      focuses: string;
    }
  | GraphicProps;

const Graphic: React.FC<GraphicProps> = props => {
  const { title, counting, year, allocations, children, ...otherTilegramProps } = props;
  const isCounting = typeof counting !== 'boolean' || counting;

  return (
    <div className={styles.root} title={title}>
      <header className={styles.header} data-is-counting={isCounting ? '' : undefined}>
        <Totals allocations={allocations} year={year} />
      </header>
      <Tilegram allocations={allocations} {...otherTilegramProps} />
    </div>
  );
};

export default Graphic;
