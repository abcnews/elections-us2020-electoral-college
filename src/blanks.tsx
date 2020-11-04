import { whenDOMReady } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import Blanks from './components/Blanks';
import { GraphicProps } from './components/Graphic';
import { alternatingCaseToGraphicProps } from './utils';

whenDOMReady.then(() => {
  const mounts = selectMounts('ecblanks');

  mounts.forEach(mount => {
    const mountValue = getMountValue(mount);
    const blanksProps =
      mountValue.indexOf('LIVE') > -1
        ? { isLive: true }
        : { initialGraphicProps: alternatingCaseToGraphicProps(mountValue) as GraphicProps };

    mount.classList.add('u-pull');
    render(<Blanks {...blanksProps} />, mount);
  });
});
