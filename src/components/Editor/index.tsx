import React, { useEffect, useMemo, useState } from 'react';
import type { Allocations } from '../../constants';
import { Allocation, INITIAL_ALLOCATIONS, MIXINS, PRESETS } from '../../constants';
import { decodeAllocations, encodeAllocations } from '../../utils';
import Graphic from '../Graphic';
import styles from './styles.scss';

const getUrlParamProps = () => {
  const [, encodedAllocations] = /[?&]allocations=([^&#]*)/i.exec(String(window.location)) || [, ''];

  return {
    allocations: decodeAllocations(encodedAllocations)
  };
};

const setUrlParamProps = props => {
  const encodedAllocations = encodeAllocations(props.allocations || {});

  history.replaceState(props, document.title, `?allocations=${encodedAllocations}`);
};

const Editor: React.FC = () => {
  const initialUrlParamProps = getUrlParamProps();
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

  useEffect(() => {
    setUrlParamProps(graphicProps);
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
      </div>
    </div>
  );
};

export default Editor;
