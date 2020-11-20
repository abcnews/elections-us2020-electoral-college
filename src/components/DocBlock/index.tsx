import React, { useRef, useState } from 'react';
import type { ScrollytellerDefinition } from '@abcnews/scrollyteller';
import { loadScrollyteller } from '@abcnews/scrollyteller';
import styles from './styles.scss';

const URL_LOCALSTORAGE_KEY = 'last-successfully-loaded-google-doc-url';

const IDENTITY = x => x;

type DocBlockProps<T> = {
  loadScrollytellerArgs?: {
    name?: string;
    className?: string;
    markerName?: string;
  };
  preprocessCoreEl?: (el: Element) => Element;
  postprocessScrollytellerDefinition?: (
    scrollytellerDefinition: ScrollytellerDefinition<T>
  ) => ScrollytellerDefinition<T>;
  renderPreview: (scrollytellerDefinition: ScrollytellerDefinition<T>) => React.ReactElement;
  renderFallbackImagesButton?: (scrollytellerDefinition: ScrollytellerDefinition<T>) => React.ReactElement;
};

function DocBlock<T>({
  loadScrollytellerArgs = {
    className: 'u-full',
    markerName: 'mark'
  },
  preprocessCoreEl,
  postprocessScrollytellerDefinition,
  renderPreview,
  renderFallbackImagesButton
}: DocBlockProps<T>): React.ReactElement {
  const { name, className, markerName } = loadScrollytellerArgs;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coreText, setCoreText] = useState<string>();
  const [coreHTML, setCoreHTML] = useState<string>();
  const [preview, setPreview] = useState<React.ReactElement>();
  const [fallbackImagesButton, setFallbackImagesButton] = useState<React.ReactElement>();

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

        const coreEls: Element[] = Array.from(body.children).map(preprocessCoreEl ? preprocessCoreEl : IDENTITY);

        const coreText = coreEls.reduce<string>((memo, el) => {
          const text = String(el.textContent).trim();

          memo = `${memo}\n${text ? `\n${text}` : ''}`;

          return memo;
        }, '');

        const coreHTML = coreEls.reduce<string>((memo, el) => {
          const text = String(el.textContent).trim();
          const html = el.outerHTML;

          memo = `${memo}${text ? `${html}` : ''}`;

          return memo;
        }, '');

        const { scrollytellingEls } = coreEls.reduce<{
          hasBegun: boolean;
          hasEnded: boolean;
          isRemoving: boolean;
          scrollytellingEls: Element[];
        }>(
          (memo, el) => {
            if (memo.hasEnded) {
              return memo;
            }

            const text = String(el.textContent).trim();

            if (text.indexOf('#remove') === 0) {
              memo.isRemoving = true;
            } else if (text.indexOf('#endremove') === 0) {
              memo.isRemoving = false;
            } else if (text.indexOf('#') === 0) {
              if (text.indexOf(`#scrollyteller${name ? `NAME${name}` : ''}`) === 0 && !memo.hasBegun) {
                memo.hasBegun = true;
              } else if (text.indexOf('#endscrollyteller') === 0) {
                memo.hasEnded = true;
              }

              memo.scrollytellingEls.push(mountTextToMountEl(text));
            } else if (!memo.hasBegun || memo.isRemoving || text === '') {
              // skip
            } else {
              memo.scrollytellingEls.push(el);
            }

            return memo;
          },
          {
            hasBegun: false,
            hasEnded: false,
            isRemoving: false,
            scrollytellingEls: []
          }
        );

        const tempContainerEl = document.createElement('div');

        tempContainerEl.className = styles.tempContainerEl;
        scrollytellingEls.forEach(scrollytellingEl => tempContainerEl.appendChild(scrollytellingEl));
        document.body.appendChild(tempContainerEl);

        let scrollytellerDefinition: ScrollytellerDefinition<T> = loadScrollyteller(name, className, markerName);

        document.body.removeChild(tempContainerEl);

        if (postprocessScrollytellerDefinition) {
          scrollytellerDefinition = postprocessScrollytellerDefinition(scrollytellerDefinition);
        }

        setPreview(renderPreview(scrollytellerDefinition));

        if (renderFallbackImagesButton) {
          setFallbackImagesButton(renderFallbackImagesButton(scrollytellerDefinition));
        }

        setCoreText(coreText);
        setCoreHTML(coreHTML);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <div className={styles.root} data-is-loading={isLoading ? '' : undefined}>
      <div className={styles.preview}>{preview}</div>
      <div className={styles.controls}>
        <div className={styles.row}>
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
        </div>
        {coreText && (
          <div className={styles.row}>
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
              Core Text
            </button>
            {fallbackImagesButton}
          </div>
        )}
      </div>
    </div>
  );
}

function mountTextToMountEl(mountText) {
  const mountEl = document.createElement('div');

  mountEl.setAttribute('data-mount', '');
  mountEl.setAttribute('id', mountText.slice(1));

  return mountEl;
}

export default DocBlock;
