import * as acto from '@abcnews/alternating-case-to-object';
import { whenDOMReady } from '@abcnews/env-utils';
import { isMount, selectMounts } from '@abcnews/mount-utils';
import type { PanelDefinition } from '@abcnews/scrollyteller';
import React from 'react';
import { render } from 'react-dom';
import Block from './components/Block';
import DocBlock from './components/DocBlock';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';
import Live from './components/Live';
import { applyColourToPanels } from './panels';
import { decodeAllocations, decodeFocuses, graphicPropsToAlternatingCase, urlQueryToGraphicProps } from './utils';
import type { OdysseySchedulerClient, OdysseySchedulerSubscriber } from '.';

const subscribers = new Set<OdysseySchedulerSubscriber>();

const notifySubscribers = (event: Event) => {
  const client: OdysseySchedulerClient = { hasChanged: event.type === 'resize', fixedHeight: window.innerHeight };

  Array.from(subscribers).map(fn => fn(client));
};

window.addEventListener('scroll', notifySubscribers);
window.addEventListener('resize', notifySubscribers);

window.__ODYSSEY__ = {
  scheduler: {
    subscribe: fn => subscribers.add(fn),
    unsubscribe: fn => subscribers.delete(fn)
  },
  utils: {
    dom: {
      detach: () => {}
    }
  }
};

const LOAD_SCROLLYTELLER_ARGS = { name: 'ecblock', markerName: 'mark' };
const MARKER_WITH_PROPS_PATTERN = /#(scrollyteller|mark)/;

whenDOMReady.then(() =>
  render(
    <DocBlock<PossiblyEncodedGraphicProps>
      preprocessCoreEl={el => {
        const text = String(el.textContent).trim();
        const linkEl: HTMLAnchorElement | null = el.querySelector('a[href]');
        const urlQuery = linkEl && (new URL(linkEl.href).searchParams.get('q') || '').split('?')[1];
        const markerMatch = text.match(MARKER_WITH_PROPS_PATTERN);

        if (urlQuery && markerMatch) {
          const markerPrefix =
            markerMatch[1] === 'scrollyteller'
              ? `scrollytellerNAME${LOAD_SCROLLYTELLER_ARGS.name}`
              : LOAD_SCROLLYTELLER_ARGS.markerName;
          const graphicProps = urlQueryToGraphicProps('?' + urlQuery);
          const pEl = document.createElement('p');

          pEl.textContent = `#${markerPrefix}${graphicPropsToAlternatingCase(graphicProps)}`;

          return pEl;
        }

        return el;
      }}
      loadScrollytellerArgs={LOAD_SCROLLYTELLER_ARGS}
      postprocessScrollytellerDefinition={scrollytellerDefinition => {
        scrollytellerDefinition.panels.forEach(({ data, nodes }) => {
          data.allocations = decodeAllocations((data.allocations as string) || '');
          data.focuses = decodeFocuses((data.focuses as string) || '');

          nodes.forEach(el => {
            if (isMount(el, 'eclive')) {
              const { state, test, hide } = acto(el.id || '');

              if (typeof hide !== 'boolean' || !hide) {
                render(<Live stateCode={state.toUpperCase()} test={test} />, el);
              }
            }
          });
        });

        applyColourToPanels(scrollytellerDefinition.panels);

        return scrollytellerDefinition;
      }}
      renderPreview={({ panels }) => <Block panels={panels as PanelDefinition<GraphicProps>[]} />}
      renderFallbackImagesButton={({ panels }) => (
        <button
          onClick={event => {
            const buttonEl = event.target;

            if (panels) {
              import(/* webpackChunkName: "fallbacks" */ './fallbacks').then(module =>
                module.default(buttonEl, panels as PanelDefinition<GraphicProps>[])
              );
            }
          }}
        >
          Fallback Images
        </button>
      )}
    />,
    selectMounts('ecdb')[0]
  )
);
