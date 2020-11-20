import type { OdysseySchedulerClient, OdysseySchedulerSubscriber } from '../..';

const subscribers = new Set<OdysseySchedulerSubscriber>();

const notifySubscribers = (event: Event) => {
  const client: OdysseySchedulerClient = { hasChanged: event.type === 'resize', fixedHeight: window.innerHeight };

  Array.from(subscribers).map(fn => fn(client));
};

window.addEventListener('scroll', notifySubscribers);
window.addEventListener('resize', notifySubscribers);

window.__ODYSSEY__ = {
  scheduler: {
    subscribe: fn => subscribers.add(fn),
    unsubscribe: fn => subscribers.delete(fn)
  },
  utils: {
    dom: {
      detach: () => {}
    }
  }
};
