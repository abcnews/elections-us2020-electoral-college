import { whenDOMReady } from '@abcnews/env-utils';
import { selectMounts } from '@abcnews/mount-utils';
import React from 'react';
import { render } from 'react-dom';
import Block from './components/Block';

import { GroupID, GROUPS } from './constants';

const PROJECT_NAME: string = 'elections-us2020-electoral-college';

whenDOMReady.then(() => render(<Block projectName={PROJECT_NAME} />, selectMounts('ecblock')[0]));
