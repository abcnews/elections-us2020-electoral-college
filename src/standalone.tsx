import { whenDOMReady } from '@abcnews/env-utils';
import { getMountValue, selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import { alternatingCaseToGraphicProps } from './utils';
import Graphic from './components/Graphic';

whenDOMReady.then(() => {
  const mounts = selectMounts('ecgraphic');

  mounts.forEach(mount => {
    const graphicProps = alternatingCaseToGraphicProps(getMountValue(mount));

    render(<Graphic {...graphicProps} />, mount);
  });
});
