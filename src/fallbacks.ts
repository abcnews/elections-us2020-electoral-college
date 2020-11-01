import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import type { GraphicProps } from './components/Graphic';
import { DEFAULT_PROPS as DEFAULT_GRAPHIC_PROPS } from './components/Graphic';
import graphicStyles from './components/Graphic/styles.scss';
import tilegramStyles from './components/Tilegram/styles.scss';
import { graphicPropsToUrlQuery } from './utils';

export default function run(initiatingElement) {
  const graphicsProps: GraphicProps[] = [];
  const filenames: string[] = [];

  Object.keys(window.__scrollytellers).forEach(key => {
    window.__scrollytellers[key].panels.forEach(panel => {
      const { data, nodes } = panel;

      graphicsProps.push({
        ...DEFAULT_GRAPHIC_PROPS,
        ...data
      } as GraphicProps);
      filenames.push(String(nodes[0].textContent).trim().replace(/\W+/g, '-').slice(0, 30).toLowerCase());
    });
  });

  const imageURLs = graphicsProps.map(
    graphicProps =>
      `https://cors-anywhere.herokuapp.com/https://fallback-automation.drzax.now.sh/api?url=${encodeURIComponent(
        `${__webpack_public_path__}editor/${graphicPropsToUrlQuery(graphicProps, DEFAULT_GRAPHIC_PROPS)}`
      )}&width=600&selector=.${graphicProps.counting ? graphicStyles.root : tilegramStyles.root}`
  );

  // When developing, fallback-automation.drzax.now.sh needs a public URL
  // const imageURLs = graphicsProps.map(
  //   graphicProps =>
  //     `https://cors-anywhere.herokuapp.com/https://fallback-automation.drzax.now.sh/api?url=${encodeURIComponent(
  //       `https://www.abc.net.au/res/sites/news-projects/elections-us2020-electoral-college/1.2.0/editor/${graphicPropsToUrlQuery(
  //         graphicProps,
  //         DEFAULT_GRAPHIC_PROPS
  //       )}`
  //     )}&width=600&selector=.${graphicProps.counting ? '_1Ykpoi' : '_3-hRFt'}`
  // );

  const zip = new JSZip();
  const imageBlobPromises = imageURLs.map(url => fetch(url).then(response => response.blob()));

  (initiatingElement as HTMLElement).style.pointerEvents = 'none';

  const end = () => {
    (initiatingElement as HTMLElement).style.pointerEvents = 'initial';
  };

  Promise.all(imageBlobPromises)
    .then(blobs => {
      blobs.forEach((blob, index) => {
        if (blob) {
          zip.file(`${String(index).padStart(3, '0')}-${filenames[index]}.png`, blob);
        }
      });
      zip
        .generateAsync({ type: 'blob' })
        .then(content => {
          saveAs(content, `ec-fallback-bundle-${Date.now()}.zip`);
          end();
        })
        .catch(end);
    })
    .catch(end);
}
