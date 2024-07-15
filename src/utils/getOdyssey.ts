export type OdysseySchedulerClient = {
  hasChanged: boolean;
  fixedHeight: number;
};

export type OdysseySchedulerSubscriber = (client: OdysseySchedulerClient) => void;

type OdysseyAPI = {
  scheduler: {
    subscribe: (subscriber: OdysseySchedulerSubscriber) => void;
    unsubscribe: (subscriber: OdysseySchedulerSubscriber) => void;
  };
  utils: {
    dom: {
      detach: (el: Element) => void;
    };
  };
};

/**
 * Get Odyssey API
 *
 * Throws an error when not available, so you must put this call behind a
 * `whenOdysseyLoaded.then()` check.
 */
export const getOdyssey = (): OdysseyAPI => {
  // @ts-ignore
  const odyssey: OdysseyAPI = window.__ODYSSEY__;

  if (!odyssey) {
    throw new Error('Odyssey not found');
  }

  return odyssey;
}


/** Promise that resolves when Odyssey API is available */
export const whenOdysseyLoaded: Promise<OdysseyAPI> = new Promise(resolve => {
  try {
    resolve(getOdyssey());
  } catch (e) {
    window.addEventListener('odyssey:api', () => resolve(getOdyssey()))
  }
});