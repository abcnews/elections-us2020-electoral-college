import React from 'react';
import styles from './styles.scss';

export enum IllustrationName {
  Preview = 'preview',
  TrumpWin = 'trumpwin',
  BidenWin = 'bidenwin',
  Tossup = 'tossup'
}

export type IllustrationProps = {
  name?: IllustrationName;
};

const Illustration: React.FC<IllustrationProps> = ({ name }) => {
  return (
    <div className={styles.root}>
      <div className={styles.graphic}>
        <iframe
          frameBorder="0"
          src={`${__webpack_public_path__}illustration/${name || IllustrationName.Preview}.svg`}
        />
      </div>
    </div>
  );
};

export default Illustration;
