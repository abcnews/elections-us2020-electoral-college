import { getGeneration, GENERATIONS } from '@abcnews/env-utils';
import { getMountValue, isMount, selectMounts } from '@abcnews/mount-utils';
import { loadScrollyteller, PanelDefinition, ScrollytellerDefinition } from '@abcnews/scrollyteller';
import React from 'react';
import { render } from 'react-dom';
import { PRESETS, StateID, STATES } from './constants';
import {
  alternatingCaseToGraphicProps,
  decodeAllocations,
  decodeFocuses,
  determineIfAllocationIsDefinitive,
  getStateAllocations
} from './utils';
import Block from './components/Block';
import blockStyles from './components/Block/styles.scss';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';
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
        applyColourToPanels(scrollytellerDefinition.panels);
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

const SORTED_STATES = STATES.sort((a, b) => b.name.length - a.name.length);

function applyColourToPanels(panels: PanelDefinition<PossiblyEncodedGraphicProps>[]) {
  const stateIntroductionTracker: { [key: string]: boolean } = {};

  panels.forEach(({ data, nodes }) => {
    const textNodes = nodes.reduce<Node[]>((memo, node) => memo.concat(textNodesUnder(node)), []);

    textNodes.forEach(node => {
      let text = node.textContent || '';

      SORTED_STATES.forEach(({ name }) => {
        const index = text.indexOf(name);
        if (index > -1 && text[index - 1] !== '|' && text[index + name.length] !== '|') {
          text = text.replace(name, `|||${name}|||`);
        }
      });

      if (text === node.textContent) {
        return;
      }

      const parentEl = node.parentElement;

      if (!parentEl) {
        return;
      }

      text.split('|||').forEach((part, index) => {
        const partTextNode = document.createTextNode(part);

        if (!(index % 2)) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const state = STATES.find(({ name }) => name === part);

        if (!state) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const partWrapperNode = document.createElement('span');
        const stateID = StateID[state.id];
        const { allocations, relative } = data as GraphicProps;
        const stateMainAllocation = allocations && getStateAllocations(stateID, allocations)[0];
        const isDefinitiveMainAllocation =
          stateMainAllocation && determineIfAllocationIsDefinitive(stateMainAllocation);
        const relativeAllocations = relative && PRESETS[relative]?.allocations;
        const stateRelativeMainAllocation = relativeAllocations && getStateAllocations(stateID, relativeAllocations)[0];

        if (!stateIntroductionTracker[stateID]) {
          stateIntroductionTracker[stateID] = true;
          partWrapperNode.setAttribute('data-is-first-encounter', '');
        }

        if (stateMainAllocation) {
          partWrapperNode.setAttribute('data-main-allocation', stateMainAllocation);
        }

        if (isDefinitiveMainAllocation) {
          partWrapperNode.setAttribute('data-is-definitive-main-allocation', '');
        }

        if (stateRelativeMainAllocation) {
          partWrapperNode.setAttribute('data-relative-main-allocation', stateRelativeMainAllocation);
        }

        partWrapperNode.setAttribute('data-state', stateID);
        partWrapperNode.className = blockStyles.state;
        partWrapperNode.appendChild(partTextNode);
        parentEl.insertBefore(partWrapperNode, node);
      });

      parentEl.removeChild(node);
    });
  });
}

function textNodesUnder(node: Node) {
  const textNodes: Node[] = [];
  const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  let textNode: Node | null;

  while ((textNode = walk.nextNode())) {
    textNodes.push(textNode);
  }

  return textNodes;
}
