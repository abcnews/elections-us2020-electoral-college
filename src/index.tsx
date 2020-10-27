import { getGeneration, GENERATIONS } from '@abcnews/env-utils';
import { getMountValue, isMount, selectMounts } from '@abcnews/mount-utils';
import { loadScrollyteller, ScrollytellerDefinition } from '@abcnews/scrollyteller';
import React from 'react';
import { render } from 'react-dom';
import { alternatingCaseToGraphicProps, decodeAllocations, decodeFocuses } from './utils';
import Block from './components/Block';
import type { PossiblyEncodedGraphicProps } from './components/Graphic';
import Graphic from './components/Graphic';

type OdysseyAPI = {
  utils: {
    dom: {
      detach: (el: Element) => void;
    };
  };
};

declare global {
  interface Window {
    __ODYSSEY__: OdysseyAPI;
  }
}

const whenEnvReady = new Promise<void>(resolve =>
  getGeneration() !== GENERATIONS.P1
    ? resolve()
    : import(/* webpackChunkName: "env" */ './polyfills').then(() => resolve())
);

const whenOdysseyLoaded = new Promise(resolve =>
  whenEnvReady.then(() =>
    window.__ODYSSEY__
      ? resolve(window.__ODYSSEY__)
      : window.addEventListener('odyssey:api', () => resolve(window.__ODYSSEY__))
  )
);

const whenScrollytellersLoaded = new Promise((resolve, reject) =>
  whenOdysseyLoaded.then(odyssey => {
    const names = selectMounts('scrollytellerNAME', { markAsUsed: false })
      .map(mountEl => (getMountValue(mountEl).match(/NAME([a-z]+)/) || [])[1])
      .filter(name => typeof name === 'string');
    const scrollytellerDefinitions: ScrollytellerDefinition<PossiblyEncodedGraphicProps>[] = [];

    for (const name of names) {
      let scrollytellerDefinition: ScrollytellerDefinition<PossiblyEncodedGraphicProps>;

      try {
        scrollytellerDefinition = loadScrollyteller(name, 'u-full');
        scrollytellerDefinition.panels.forEach(({ data }) => {
          data.allocations = decodeAllocations((data.allocations as string) || '');
          data.focuses = decodeFocuses((data.focuses as string) || '');
        });
      } catch (err) {
        return reject(err);
      }

      // Keep the DOM tidy.
      if (scrollytellerDefinition && scrollytellerDefinition.mountNode) {
        while (isMount(scrollytellerDefinition.mountNode.nextElementSibling)) {
          (odyssey as OdysseyAPI).utils.dom.detach(scrollytellerDefinition.mountNode.nextElementSibling);
        }
      }

      scrollytellerDefinitions.push(scrollytellerDefinition);
    }

    resolve(scrollytellerDefinitions);
  })
);

whenScrollytellersLoaded.then(scrollytellerDefinitions => {
  (scrollytellerDefinitions as ScrollytellerDefinition<any>[]).forEach(scrollytellerDefinition =>
    render(<Block scrollytellerDefinition={scrollytellerDefinition} />, scrollytellerDefinition.mountNode)
  );
});

whenOdysseyLoaded.then(() => {
  const mounts = selectMounts('ecgraphic');

  mounts.forEach(mount => {
    const graphicProps = alternatingCaseToGraphicProps(getMountValue(mount));

    render(<Graphic {...graphicProps} />, mount);
  });
});
