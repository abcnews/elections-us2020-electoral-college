import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import { STATE_IDS } from './constants';
import Live from './components/Live';
import liveStyles from './components/Live/styles.scss';

const MarkerText = ({ text }) => (
  <button onClick={() => navigator.clipboard.writeText(text)} style={{ cursor: 'copy', padding: '0.25rem 0.5rem' }}>
    <code>{text}</code>
  </button>
);

const Article = () => (
  <article style={{ fontFamily: 'ABCSans' }}>
    <style>
      {`
      article .${liveStyles.root} {
        margin: 0 !important;
      }
      [data-loading]::after {
        content: attr(data-loading) ' not reporting yet'
      }
      `}
    </style>
    <h1>Live Results</h1>
    <div>
      {STATE_IDS.map(stateID => (
        <div key={stateID} style={{ margin: '0 0 2rem' }}>
          <div style={{ margin: '0 0 0.5rem', maxWidth: '32rem' }}>
            <Live stateCode={stateID} />
          </div>
          <MarkerText text={`#ecliveSTATE${stateID.toLowerCase()}`}></MarkerText>
        </div>
      ))}
    </div>
  </article>
);

whenDOMReady.then(() => render(<Article />, selectMounts('ecalllive')[0]));
