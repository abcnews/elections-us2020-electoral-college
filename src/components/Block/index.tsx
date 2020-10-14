import React from 'react';
import Graphic from '../Graphic';
import styles from './styles.scss';

interface BlockProps {
  projectName: string;
}

const Block: React.FC<BlockProps> = ({ projectName }) => {
  return (
    <div className={styles.root}>
      <h1>{projectName}</h1>
      <Graphic />
    </div>
  );
};

export default Block;
