import React from 'react';
import styles from './styles.scss';

export enum IllustrationName {
  Preview = 'preview',
  TrumpWin = 'trumpwin',
  BidenAhead = 'bidenahead',
  BidenWin = 'bidenwin',
  Tossup = 'tossup',
  Hand = 'hand'
}

const ASPECT_OVERRIDES = {
  [IllustrationName.BidenAhead]: '3:2'
};

const EXTENSION_OVERRIDES = {
  [IllustrationName.BidenAhead]: 'jpg'
};

export type IllustrationProps = {
  name?: IllustrationName;
};

const Illustration: React.FC<IllustrationProps> = ({ name }) => {
  const aspect = (name && ASPECT_OVERRIDES[name]) || '1:1';
  const extension = (name && EXTENSION_OVERRIDES[name]) || 'svg';
  const src = `${__webpack_public_path__}illustration/${name || IllustrationName.Preview}.${extension}`;

  return (
    <div className={styles.root} data-aspect={aspect}>
      <div className={styles.graphic}>
        {extension === 'svg' ? <iframe frameBorder="0" src={src} /> : <img src={src} />}
      </div>
    </div>
  );
};

export default Illustration;
