import type { Combined } from 'elections-us2020-results-data';

const ABC_URL_BASE = 'https://www.abc.net.au/dat/news/elections/international/us-2020/';
const FIREBASE_URL_BASE = 'https://elections-us2020-results-data.web.app/';

let dataPromise: Promise<Combined.Results> | undefined;

type LoadDataOptions = {
  server?: string;
  forceRefresh?: boolean;
  test?: number;
};

export const loadData = ({ server, forceRefresh, test }: LoadDataOptions) => {
  if (!dataPromise || forceRefresh) {
    dataPromise = fetch(
      `${server === 'firebase' ? FIREBASE_URL_BASE : ABC_URL_BASE}${
        typeof test === 'number' && server !== 'firebase' ? `test/${test}` : 'latest'
      }.json`
    ).then(response => response.json());
  }

  return dataPromise;
};
