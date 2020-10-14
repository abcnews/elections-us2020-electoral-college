import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import Graphic from './components/Graphic';

whenDOMReady.then(() => render(<Graphic />, selectMounts('ecgraphic')[0]));
