import React, { useEffect, useMemo, useState } from 'react';
import { create } from 'react-test-renderer';
import type { Allocations } from '../../constants';
import { Allocation, INITIAL_ALLOCATIONS, MIXINS, PRESETS } from '../../constants';
import { graphicPropsToAlternatingCase, urlQueryToGraphicProps, graphicPropsToUrlQuery } from '../../utils';
import Graphic from '../Graphic';
import styles from './styles.scss';

const DEFAULT_GRAPHIC_PROPS = { allocations: INITIAL_ALLOCATIONS };

const MOUNT_LABELS_PREFIXES = {
  'Standalone graphic': 'ecgraphic',
  'Scrollyteller opener': 'scrollytellerNAMEecblock',
  'Scrollyteller mark': 'mark'
};

const SNAPSHOTS_LOCALSTORAGE_KEY = 'eceditorsnapshots';

const Editor: React.FC = () => {
  const initialUrlParamProps = urlQueryToGraphicProps(String(window.location.search)) || DEFAULT_GRAPHIC_PROPS;
  const [allocations, setAllocations] = useState<Allocations>(initialUrlParamProps.allocations);
  const [snapshots, setSnapshots] = useState(JSON.parse(localStorage.getItem(SNAPSHOTS_LOCALSTORAGE_KEY) || '{}'));

  const createSnapshot = (name, urlQuery) => {
    const nextSnapshots = {
      [name]: urlQuery,
      ...snapshots
    };

    localStorage.setItem(SNAPSHOTS_LOCALSTORAGE_KEY, JSON.stringify(nextSnapshots));
    setSnapshots(nextSnapshots);
  };

  const deleteSnapshot = name => {
    const nextSnapshots = { ...snapshots };

    delete nextSnapshots[name];

    localStorage.setItem(SNAPSHOTS_LOCALSTORAGE_KEY, JSON.stringify(nextSnapshots));
    setSnapshots(nextSnapshots);
  };

  const mixinAllocations = (mixin: Allocations) =>
    setAllocations({
      ...allocations,
      ...mixin
    });

  const replaceAllocations = (replacement: Allocations) => {
    setAllocations({
      ...INITIAL_ALLOCATIONS,
      ...replacement
    });
  };

  const onTapGroup = (groupID: string) => {
    const allocationsToMixin: Allocations = {};

    switch (allocations[groupID]) {
      case Allocation.None:
        allocationsToMixin[groupID] = Allocation.Dem;
        break;
      case Allocation.Dem:
        allocationsToMixin[groupID] = Allocation.Rep;
        break;
      case Allocation.Rep:
        allocationsToMixin[groupID] = Allocation.None;
        break;
      default:
        // TODO: do we need to set this, or retain the original value?
        allocationsToMixin[groupID] = Allocation.None;
        break;
    }

    mixinAllocations(allocationsToMixin);
  };

  const graphicProps = useMemo(
    () => ({
      ...initialUrlParamProps,
      allocations
    }),
    [allocations]
  );

  const graphicPropsAsAlternatingCase = useMemo(() => graphicPropsToAlternatingCase(graphicProps), [graphicProps]);
  const graphicPropsAsUrlQuery = useMemo(() => graphicPropsToUrlQuery(graphicProps), [graphicProps]);

  const mountsData = useMemo(
    () =>
      Object.keys(MOUNT_LABELS_PREFIXES).reduce((mountsData, label) => {
        mountsData[label] = `#${MOUNT_LABELS_PREFIXES[label]}${graphicPropsAsAlternatingCase}`;

        return mountsData;
      }, {}),
    [graphicPropsAsAlternatingCase]
  );

  useEffect(() => {
    history.replaceState(graphicProps, document.title, graphicPropsAsUrlQuery);
  }, [graphicPropsAsUrlQuery]);

  return (
    <div className={styles.root}>
      <div className={styles.graphic}>
        <Graphic onTapGroup={onTapGroup} {...graphicProps} />
      </div>
      <div className={styles.controls}>
        <label>
          Mix-ins <small>(added to the map)</small>
        </label>
        <div className={styles.flexRow}>
          {Object.keys(MIXINS).map(key => {
            const { allocations, name } = MIXINS[key];

            return (
              <button key={key} onClick={() => mixinAllocations(allocations)}>
                {name || key}
              </button>
            );
          })}
        </div>
        <label>
          Presets <small>(replace the whole map)</small>
        </label>
        <div className={styles.flexRow}>
          <button key="empty" onClick={() => replaceAllocations({})}>
            Empty
          </button>
          {Object.keys(PRESETS).map(key => {
            const { allocations, name } = PRESETS[key];

            return (
              <button key={key} onClick={() => replaceAllocations(allocations)}>
                {name || key}
              </button>
            );
          })}
        </div>
        <label>Story markers</label>
        {Object.keys(mountsData).map(label => (
          <details key={label}>
            <summary>
              {label}
              <button onClick={() => navigator.clipboard.writeText(mountsData[label])}>📋</button>
            </summary>
            <pre>{mountsData[label]}</pre>
          </details>
        ))}
        <label>
          Snapshots
          <button
            onClick={() => {
              const name = prompt('What would you like to call this snapshot?');

              if (!name || !name.length) {
                return alert('No name was provided');
              } else if (snapshots[name]) {
                return alert(`Can't overwrite existing snapshot`);
              }

              createSnapshot(name, graphicPropsAsUrlQuery);
            }}
          >
            ➕
          </button>
        </label>
        <ul>
          {Object.keys(snapshots).map(name => (
            <li key={name}>
              <button onClick={() => deleteSnapshot(name)}>🗑</button> <a href={snapshots[name]}>{name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Editor;
