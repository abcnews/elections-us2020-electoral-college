import React from 'react';
import type { Allocations } from '../../constants';
import Tilegram from '../Tilegram';
import styles from './styles.scss';

interface GraphicProps {
  allocations?: Allocations;
  onTapGroup?: (groupID: string) => void;
}

const Graphic: React.FC<GraphicProps> = (props) => {
  const {allocations, onTapGroup} = props;

  return (
    <div className={styles.root}>
      <Tilegram allocations={allocations} onTapGroup={onTapGroup} />
    </div>
  );
};

export default Graphic;
