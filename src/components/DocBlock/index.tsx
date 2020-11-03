import * as acto from '@abcnews/alternating-case-to-object';
import { getMountValue, isMount } from '@abcnews/mount-utils';
import React, { useRef, useState } from 'react';
import { render } from 'react-dom';
import type { PanelDefinition } from '@abcnews/scrollyteller';
import { applyColourToPanels } from '../../panels';
import { decodeAllocations, decodeFocuses, graphicPropsToAlternatingCase, urlQueryToGraphicProps } from '../../utils';
import Live from '../Live';
import Block from '../Block';
import type { GraphicProps } from '../Graphic';
import styles from './styles.scss';
import type { OdysseySchedulerClient, OdysseySchedulerSubscriber } from '../..';

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

const URL_LOCALSTORAGE_KEY = 'ecdburl';

const DocBlock: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coreText, setCoreText] = useState<string>();
  const [coreHTML, setCoreHTML] = useState<string>();
  const [panels, setPanels] = useState<PanelDefinition<GraphicProps>[]>();

  const load = () => {
    const url = inputRef.current?.value;

    if (!url) {
      return;
    }

    setIsLoading(true);

    new Promise<Response>(resolve => {
      const pubURL = url.replace(/\/[^\/]+?$/, '/pub');

      fetch(pubURL)
        .then(resolve)
        .catch(() => fetch(`https://cors-anywhere.herokuapp.com/${pubURL}`).then(resolve));
    })
      .then(response => response.text())
      .then(html => {
        localStorage.setItem(URL_LOCALSTORAGE_KEY, url);

        const body = new DOMParser().parseFromString(html, 'text/html').querySelector('#contents > div');

        if (!body) {
          throw new Error('Body not found');
        }

        Array.from(body.querySelectorAll('*')).forEach(el => {
          el.removeAttribute('class');
          el.removeAttribute('id');
        });

        const nodes = Array.from(body.children).map(el => {
          const text = String(el.textContent).trim();
          const linkEl: HTMLAnchorElement | null = el.querySelector('a[href]');
          const urlQuery = linkEl && (new URL(linkEl.href).searchParams.get('q') || '').split('?')[1];
          const markerMatch = text.match(/#(scrollyteller|mark)/);

          if (urlQuery && markerMatch) {
            const markerPrefix = markerMatch[1] === 'scrollyteller' ? 'scrollytellerNAMEecblock' : 'mark';
            const graphicProps = urlQueryToGraphicProps('?' + urlQuery);
            const pEl = document.createElement('p');

            pEl.textContent = `#${markerPrefix}${graphicPropsToAlternatingCase(graphicProps)}`;

            return pEl;
          }

          return el;
        });

        const coreText = nodes.reduce((memo, node) => {
          const text = String(node.textContent).trim();

          memo = `${memo}\n${text ? `\n${text}` : ''}`;

          return memo;
        }, '');

        const coreHTML = nodes.reduce((memo, node) => {
          const text = String(node.textContent).trim();
          const html = node.outerHTML;

          memo = `${memo}${text ? `${html}` : ''}`;

          return memo;
        }, '');

        const panels = loadPanels(
          nodes.reduce<{ isRemoving: boolean; config: LoadPanelsConfig }>(
            (memo, el) => {
              const { config } = memo;
              const text = String(el.textContent).trim();

              if (text.indexOf('#remove') === 0) {
                memo.isRemoving = true;
              } else if (text.indexOf('#endremove') === 0) {
                memo.isRemoving = false;
              } else if (text.indexOf('#eclive') === 0) {
                const { state, hide } = acto(text.slice(1));

                if (typeof hide !== 'boolean' || !hide) {
                  render(<Live stateCode={state.toUpperCase()} />, el);
                  config.nodes.push(el);
                }
              } else if (text.indexOf('#scrollyteller') === 0 && !config.initialProps) {
                config.initialProps = acto(text.slice(1));
              } else if (!config.initialProps || config.name || memo.isRemoving || text === '') {
                // skip
              } else if (text.indexOf('#endscrollyteller') === 0) {
                config.name = 'mark';
              } else if (text.indexOf('#mark') === 0) {
                const mountEl = document.createElement('div');

                mountEl.setAttribute('data-mount', '');
                mountEl.setAttribute('id', text.slice(1));
                config.nodes.push(mountEl);
              } else {
                config.nodes.push(el);
              }

              return memo;
            },
            {
              config: {
                nodes: []
              },
              isRemoving: false
            }
          ).config
        );

        applyColourToPanels(panels);
        setPanels(panels);
        setCoreText(coreText);
        setCoreHTML(coreHTML);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <div className={styles.root} data-is-loading={isLoading ? '' : undefined}>
      <div className={styles.block}>{panels && <Block panels={panels} />}</div>
      <div className={styles.controls}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Public Google Doc URL"
          onKeyDown={event => event.keyCode === 13 && load()}
          defaultValue={localStorage.getItem(URL_LOCALSTORAGE_KEY) || ''}
        ></input>
        <button disabled={isLoading} onClick={load}>
          Load
        </button>
        {coreText && (
          <button
            onClick={() => {
              const listener = event => {
                event.clipboardData.setData('text/plain', coreText);

                if (coreHTML) {
                  event.clipboardData.setData('text/html', coreHTML);
                }

                event.preventDefault();
              };

              document.addEventListener('copy', listener);
              document.execCommand('copy');
              document.removeEventListener('copy', listener);
            }}
          >
            Export
          </button>
        )}
      </div>
    </div>
  );
};

export default DocBlock;

const piecemeal = Symbol('piecemeal');

type LoadPanelsConfig = { nodes: Node[]; initialProps?: GraphicProps; name?: string };

const loadPanels = ({ nodes, initialProps, name }: LoadPanelsConfig): PanelDefinition<GraphicProps>[] => {
  name = name || 'mark';

  console.debug({ nodes, initialProps, name });

  let panels: PanelDefinition<GraphicProps>[] = [];
  let nextProps: GraphicProps = initialProps || {};
  let nextNodes: Node[] = [];

  // Commit the current nodes to a marker
  function pushPanel() {
    if (nextNodes.length === 0) return;

    panels.push({
      data: nextProps,
      nodes: nextNodes
    });
    nextNodes = [];
  }

  // Check the section nodes for panels and marker content
  nodes.forEach((node: Node, index: number) => {
    if (isMount(node, name)) {
      // Found a new marker so we should commit the last one
      pushPanel();

      // If marker has no config then just use the previous config
      let ac: string = getMountValue(node, name);

      if (ac) {
        const props = acto(ac);

        props.allocations = decodeAllocations((props.allocations as string) || '');
        props.focuses = decodeFocuses((props.focuses as string) || '');

        nextProps = props as GraphicProps;
      } else {
        // Empty marks should stop the piecemeal flow
        nextProps[piecemeal] = false;
      }
    } else {
      // Any other nodes just get grouped for the next marker
      nextNodes.push(node);
    }

    // Any trailing nodes just get added as a last marker
    if (index === nodes.length - 1) {
      pushPanel();
    }

    // If piecemeal is on/true then each node has its own box
    if (nextProps[piecemeal]) {
      pushPanel();
    }
  });

  return panels;
};
