import React, { useEffect, useMemo, useState } from 'react';
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

const Editor: React.FC = () => {
  const initialUrlParamProps = urlQueryToGraphicProps(String(window.location.search)) || DEFAULT_GRAPHIC_PROPS;
  const [allocations, setAllocations] = useState<Allocations>(initialUrlParamProps.allocations);

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

  const mountsData = useMemo(
    () =>
      Object.keys(MOUNT_LABELS_PREFIXES).reduce((mountsData, label) => {
        mountsData[label] = `#${MOUNT_LABELS_PREFIXES[label]}${graphicPropsAsAlternatingCase}`;

        return mountsData;
      }, {}),
    [graphicProps]
  );

  useEffect(() => {
    history.replaceState(graphicProps, document.title, graphicPropsToUrlQuery(graphicProps));
  }, [graphicProps]);

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
        <hr />
        <label>Story markers</label>
        {Object.keys(mountsData).map(key => (
          <details key={key}>
            <summary>
              {key}
              <button onClick={() => navigator.clipboard.writeText(mountsData[key])}>Copy to clipboard</button>
            </summary>
            <pre>{mountsData[key]}</pre>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Editor;
