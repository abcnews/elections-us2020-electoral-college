import type { Combined } from 'elections-us2020-results-data';

const ABC_URL_BASE = 'https://www.abc.net.au/dat/news/elections/international/us-2020/';
const FIREBASE_URL_BASE = 'https://elections-us2020-results-data.web.app/';

type DataPromises = {
  [key: string]: Promise<Combined.Results>;
};

const dataPromises: DataPromises = {};

type LoadDataOptions = {
  server?: 'abc' | 'firebase';
  forceRefresh?: boolean;
  test?: number;
};

export const loadData = ({ server, forceRefresh, test }: LoadDataOptions) => {
  const id = typeof test === 'number' && server === 'abc' ? `test/${test}` : 'latest';

  if (!dataPromises[id] || forceRefresh) {
    dataPromises[id] = fetch(`${server === 'abc' ? ABC_URL_BASE : FIREBASE_URL_BASE}${id}.json`).then(response =>
      response.json()
    );
  }

  return dataPromises[id];
};
