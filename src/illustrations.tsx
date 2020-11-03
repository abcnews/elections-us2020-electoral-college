import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import Illustration, { IllustrationName } from './components/Illustration';

console.log(Object.values(IllustrationName));

whenDOMReady.then(() =>
  render(
    <article>
      <h1>Illustrations</h1>
      <div>
        {Object.values(IllustrationName).map(name => (
          <div key={name}>
            <h2>
              <code>{`#ecillustrationNAME${name}`}</code>
            </h2>
            <Illustration name={name} />
          </div>
        ))}
      </div>
    </article>,
    selectMounts('ecillustrations')[0]
  )
);
