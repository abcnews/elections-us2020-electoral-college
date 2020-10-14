import React from 'react';
import { Allocation, ALLOCATIONS, Allocations } from '../../constants';
import { GroupID, GROUPS } from '../../constants';
import { getGroupIDForDelegateID } from '../../utils';
import { DELEGATES_HEXES, STATES_LABELS, STATES_SHAPES, SVG_PROPS } from './data';
import styles from './styles.scss';

interface TilegramProps {
  allocations?: Allocations;
  onTapGroup?: (groupID: string) => void;
}

const Tilegram: React.FC<TilegramProps> = props => {
  const {allocations, onTapGroup} = props;
  const isInteractive = !!onTapGroup;

  const onTapDelegate = (event: React.MouseEvent<SVGElement>) => {
    if (props.onTapGroup && event.target instanceof SVGPolygonElement) {
      const groupID = event.target.dataset.group;

      if (groupID) {
        props.onTapGroup(groupID);
      }
    }
  };

  return (
    <div className={`${styles.root}${isInteractive ? ` ${styles.isInteractive}` : ''}`}>
      <svg className={styles.svg} {...SVG_PROPS}>
        <g className={styles.delegates} onClick={onTapDelegate}>
          {Object.keys(DELEGATES_HEXES).map(key => {
            const groupID = getGroupIDForDelegateID(key);
            const allocation = allocations ? allocations[groupID] : Allocation.None;

            return (
              <polygon
                key={key}
                data-allocation={allocation}
                data-group={groupID}
                data-delegate={key}
                className={styles.delegate}
                points={DELEGATES_HEXES[key]}
              >
                <title>{GROUPS.find(({ id }) => id === GroupID[groupID])?.name}</title>
              </polygon>
            );
          })}
        </g>
        <g className={styles.states}>
          {Object.keys(STATES_SHAPES).reduce((memo, key) => {
            return memo.concat(
              STATES_SHAPES[key].map((points, index) => (
                <polygon key={`${key}_${index}`} data-state={key} className={styles.state} points={points}></polygon>
              ))
            );
          }, [])}
        </g>
        <g className={styles.labels}>
          {Object.keys(STATES_LABELS).map(key => {
            const [x, y] = STATES_LABELS[key];

            return (
              <text key={key} data-state={key} className={styles.label} x={x} y={y}>
                {key}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default Tilegram;
