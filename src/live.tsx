import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import Graphic, { GraphicProps } from './components/Graphic';
import Live from './components/Live';
import liveStyles from './components/Live/styles.scss';
import { TappableLayer } from './components/Tilegram';
import { STATE_IDS } from './constants';
import { loadData } from './data';
import { liveResultsToGraphicProps } from './utils';

const MarkerText = ({ text }) => (
  <button onClick={() => navigator.clipboard.writeText(text)} style={{ cursor: 'copy', padding: '0.25rem 0.5rem' }}>
    <code>{text}</code>
  </button>
);

const Article = () => {
  const [graphicProps, setGraphicProps] = useState<GraphicProps>({});

  useEffect(() => {
    loadData({}).then(data => setGraphicProps(liveResultsToGraphicProps(data)));
  }, []);

  function jumpToState(stateID) {
    window.location.hash = `#${stateID}`;
  }

  return (
    <article style={{ fontFamily: 'ABCSans' }}>
      <style>
        {`
.graphic {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
}
.graphic > * {
  margin: auto;
  width: 100%;
  max-width: 48rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
}
@media (min-width: 48rem) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 72rem) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 96rem) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.state:target .${liveStyles.root} {
  border: 1px solid black;
}
article .${liveStyles.root} {
  margin: 0 !important;
}
[data-loading]::after {
  content: attr(data-loading) ' not reporting yet';
  display: inline-block;
  padding: 0 0 3.125rem;
  width: 100%;
}
button {
  margin-top: 0.5rem;
}
      `}
      </style>
      <h1>Live Results</h1>
      <div className="graphic">
        <Graphic tappableLayer={TappableLayer.States} onTapState={jumpToState} {...graphicProps} />
      </div>
      <div className="grid">
        {STATE_IDS.map(stateID => (
          <div className="state" key={stateID} id={stateID}>
            <Live stateCode={stateID} />
            <MarkerText text={`#ecliveSTATE${stateID.toLowerCase()}`}></MarkerText>
          </div>
        ))}
      </div>
    </article>
  );
};

whenDOMReady.then(() => render(<Article />, selectMounts('ecalllive')[0]));
