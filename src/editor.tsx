import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import Editor from './components/Editor';

whenDOMReady.then(() => render(<Editor />, selectMounts('eceditor')[0]));
