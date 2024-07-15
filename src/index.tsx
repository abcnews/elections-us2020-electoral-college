import * as acto from '@abcnews/alternating-case-to-object';
import { getTier, TIERS } from '@abcnews/env-utils';
import { getMountValue, isMount, selectMounts } from '@abcnews/mount-utils';
import type { ScrollytellerDefinition } from '@abcnews/scrollyteller';
import { loadScrollyteller } from '@abcnews/scrollyteller';
import React from 'react';
import { render } from 'react-dom';
import { applyColourToPanels } from './panels';
import { alternatingCaseToGraphicProps, decodeAllocations, decodeFocuses } from './utils';
import Blanks from './components/Blanks';
import Block from './components/Block';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';
import Graphic from './components/Graphic';
import Illustration, { IllustrationName } from './components/Illustration';
import Live from './components/Live';
import { getOdyssey, whenOdysseyLoaded } from './utils/getOdyssey';



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
          odyssey.utils.dom.detach(scrollytellerDefinition.mountNode.nextElementSibling);
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
  (scrollytellerDefinitions as ScrollytellerDefinition<GraphicProps>[]).forEach(scrollytellerDefinition =>
    render(<Block panels={scrollytellerDefinition.panels} />, scrollytellerDefinition.mountNode)
  );
});

whenOdysseyLoaded.then(() => {
  const illustrationMounts = selectMounts('ecillustration');

  illustrationMounts.forEach(mount => {
    const parentEl = mount.parentElement;

    if (!parentEl) {
      return;
    }

    const { name } = acto(getMountValue(mount));

    if (name && !Object.values(IllustrationName).includes(name)) {
      return;
    }

    const titleEl = parentEl.querySelector('h1');

    if (titleEl && titleEl.parentElement === parentEl) {
      mount.removeAttribute('class');
      parentEl.insertBefore(mount, titleEl);
    }

    render(<Illustration name={name} />, mount);
  });

  const standaloneGraphicMounts = selectMounts('ecgraphic');

  standaloneGraphicMounts.forEach(mount => {
    const graphicProps = alternatingCaseToGraphicProps(getMountValue(mount));

    mount.classList.add('u-pull');
    render(<Graphic {...graphicProps} />, mount);
  });

  const blanksMounts = selectMounts('ecblanks');

  blanksMounts.forEach(mount => {
    const mountValue = getMountValue(mount);
    const blanksProps =
      mountValue.indexOf('LIVE') > -1
        ? { isLive: true, hasStatesResults: mountValue.indexOf('STATES') > -1 }
        : { initialGraphicProps: alternatingCaseToGraphicProps(mountValue) as GraphicProps };

    mount.classList.add('u-pull');
    render(<Blanks {...blanksProps} />, mount);
  });

  // Fallback exporter

  if (getTier() === TIERS.PREVIEW) {
    const titleEl = document.querySelector('.Header h1');

    if (titleEl) {
      (titleEl as HTMLElement).style.cursor = 'copy';
      titleEl.addEventListener('click', () => {
        import(/* webpackChunkName: "fallbacks" */ './fallbacks').then(module => module.default(titleEl, null));
      });
    }
  }
});
