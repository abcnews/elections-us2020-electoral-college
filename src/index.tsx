import * as acto from '@abcnews/alternating-case-to-object';
import { getGeneration, GENERATIONS, getTier, TIERS } from '@abcnews/env-utils';
import { getMountValue, isMount, selectMounts } from '@abcnews/mount-utils';
import { loadScrollyteller, PanelDefinition, ScrollytellerDefinition } from '@abcnews/scrollyteller';
import React from 'react';
import { render } from 'react-dom';
import { PRESETS, StateID, STATES } from './constants';
import { alternatingCaseToGraphicProps, decodeAllocations, decodeFocuses, getStateAllocations } from './utils';
import Block from './components/Block';
import blockStyles from './components/Block/styles.scss';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';
import Graphic from './components/Graphic';
import Illustration, { IllustrationName } from './components/Illustration';
import Live from './components/Live';

export type OdysseySchedulerClient = {
  hasChanged: boolean;
  fixedHeight: number;
};

export type OdysseySchedulerSubscriber = (client: OdysseySchedulerClient) => void;

type OdysseyAPI = {
  scheduler: {
    subscribe: (subscriber: OdysseySchedulerSubscriber) => void;
    unsubscribe: (subscriber: OdysseySchedulerSubscriber) => void;
  };
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
    const liveMounts = selectMounts('eclive');

    const names = selectMounts('scrollytellerNAME', { markAsUsed: false })
      .map(mountEl => (getMountValue(mountEl).match(/NAME([a-z]+)/) || [])[1])
      .filter(name => typeof name === 'string');
    const scrollytellerDefinitions: ScrollytellerDefinition<PossiblyEncodedGraphicProps>[] = [];

    for (const name of names) {
      let scrollytellerDefinition: ScrollytellerDefinition<PossiblyEncodedGraphicProps>;

      try {
        scrollytellerDefinition = loadScrollyteller(name, 'u-full');

        // Decode encoded props
        scrollytellerDefinition.panels.forEach(({ data }) => {
          data.allocations = decodeAllocations((data.allocations as string) || '');
          data.focuses = decodeFocuses((data.focuses as string) || '');
        });

        // Upgrade scrollyteller' content to show coloured state names
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

    // Upgrade all scrollytellers' content to show live results
    liveMounts.forEach(mount => {
      const { state, hide } = acto(getMountValue(mount));

      if (typeof hide === 'boolean' && hide) {
        return (((mount as unknown) as HTMLElement).style.display = 'none');
      }

      render(<Live stateCode={state.toUpperCase()} />, mount);
    });

    // Return scrollyteller definitions
    resolve(scrollytellerDefinitions);
  })
);

whenScrollytellersLoaded.then(scrollytellerDefinitions => {
  (scrollytellerDefinitions as ScrollytellerDefinition<any>[]).forEach(scrollytellerDefinition =>
    render(<Block scrollytellerDefinition={scrollytellerDefinition} />, scrollytellerDefinition.mountNode)
  );
});

whenOdysseyLoaded.then(() => {
  const illustrationMounts = selectMounts('ecillustration');

  illustrationMounts.forEach(mount => {
    const parentEl = mount.parentElement;

    if (!parentEl) {
      return;
    }

    const titleEl = parentEl.querySelector('h1');

    if (titleEl) {
      const { name } = acto(getMountValue(mount));

      if (name && !Object.values(IllustrationName).includes(name)) {
        return;
      }

      mount.removeAttribute('class');
      parentEl.insertBefore(mount, titleEl);
      render(<Illustration name={name} />, mount);
    }
  });

  const standaloneGraphicMounts = selectMounts('ecgraphic');

  standaloneGraphicMounts.forEach(mount => {
    const graphicProps = alternatingCaseToGraphicProps(getMountValue(mount));

    mount.classList.add('u-pull');
    render(<Graphic {...graphicProps} />, mount);
  });

  // Fallback exporter

  if (getTier() === TIERS.PREVIEW) {
    const titleEl = document.querySelector('.Header h1');

    if (titleEl) {
      (titleEl as HTMLElement).style.cursor = 'copy';
      titleEl.addEventListener('click', () => {
        import(/* webpackChunkName: "fallbacks" */ './fallbacks').then(module => module.default(titleEl));
      });
    }
  }
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
        const relativeAllocations = relative && PRESETS[relative]?.allocations;
        const stateRelativeMainAllocation = relativeAllocations && getStateAllocations(stateID, relativeAllocations)[0];

        if (!stateIntroductionTracker[stateID]) {
          stateIntroductionTracker[stateID] = true;
          partWrapperNode.setAttribute('data-is-first-encounter', '');
        }

        if (stateMainAllocation) {
          partWrapperNode.setAttribute('data-main-allocation', stateMainAllocation);
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
