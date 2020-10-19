import React from 'react';
import { Allocation, Allocations, Wall, Walls, GroupID, GROUPS, StateID, STATES } from '../../constants';
import { getGroupIDForDelegateID } from '../../utils';
import { DELEGATES_HEXES, STATES_LABELS, STATES_SHAPES, LANDMASS_PROPS } from './data';
import styles from './styles.scss';

// inner stroke methods: https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn

export enum TappableLayer {
  Delegates,
  States
}

export interface TilegramProps {
  allocations?: Allocations;
  walls?: Walls;
  tappableLayer?: TappableLayer;
  onTapGroup?: (groupID: string) => void;
  onTapState?: (stateID: string) => void;
}

const Tilegram: React.FC<TilegramProps> = props => {
  const { allocations, walls, tappableLayer, onTapGroup, onTapState } = props;
  const isInteractive = !!onTapGroup;

  const onTapDelegateHex = (event: React.MouseEvent<SVGElement>) => {
    if (onTapGroup && tappableLayer === TappableLayer.Delegates && event.target instanceof SVGPolygonElement) {
      const groupID = event.target.dataset.group;

      if (groupID) {
        onTapGroup(groupID);
      }
    }
  };

  const onTapStateShape = (event: React.MouseEvent<SVGElement>) => {
    if (onTapState && tappableLayer === TappableLayer.States && event.target instanceof SVGPathElement) {
      const stateID = event.target.dataset.state;

      if (stateID) {
        onTapState(stateID);
      }
    }
  };

  const svgWidth = LANDMASS_PROPS.width + 2 * LANDMASS_PROPS.margin;
  const svgHeight = LANDMASS_PROPS.height + 2 * LANDMASS_PROPS.margin;

  const svgAttrs = {
    width: svgWidth,
    height: svgHeight,
    viewBox: `0 0 ${svgWidth} ${svgHeight}`
  };

  return (
    <div className={`${styles.root}${isInteractive ? ` ${styles.isInteractive}` : ''}`} data-tappable={tappableLayer}>
      <svg className={styles.svg} {...svgAttrs}>
        <g transform={`translate(${LANDMASS_PROPS.margin} ${LANDMASS_PROPS.margin})`}>
          <g className={styles.shoreline}>
            {Object.keys(STATES_SHAPES).reduce((memo, key, index) => {
              return memo.concat(
                STATES_SHAPES[key].map((points, index) => <polygon key={`${key}_${index}`} points={points}></polygon>)
              );
            }, [])}
          </g>
          <g className={styles.landmass}>
            {Object.keys(STATES_SHAPES).reduce((memo, key, index) => {
              return memo.concat(
                STATES_SHAPES[key].map((points, index) => <polygon key={`${key}_${index}`} points={points}></polygon>)
              );
            }, [])}
          </g>
          <g className={styles.delegates} onClick={onTapDelegateHex}>
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
          <g className={styles.states} onClick={onTapStateShape}>
            {Object.keys(STATES_SHAPES).reduce((memo, key) => {
              const stateID = key;
              const wall = walls ? walls[stateID] : Wall.No;

              return memo.concat(
                STATES_SHAPES[key].map((points, index) => (
                  <g key={`${key}_${index}`}>
                    <path
                      id={`${key}_${index}_path`}
                      data-wall={wall}
                      data-state={stateID}
                      className={styles.state}
                      d={`M${points}z`}
                      clipPath={`url(#${key}_${index}_clip)`}
                    >
                      <title>{STATES.find(({ id }) => id === StateID[stateID])?.name}</title>
                    </path>
                    <clipPath id={`${key}_${index}_clip`}>
                      <use xlinkHref={`#${key}_${index}_path`} />
                    </clipPath>
                  </g>
                ))
              );
            }, [])}
          </g>
          <g className={styles.labels}>
            {Object.keys(STATES_LABELS).map(key => {
              const [x, y] = STATES_LABELS[key];
              const stateAllocation = allocations ? allocations[key] || allocations[key + '_0'] : Allocation.None;

              return (
                <text
                  key={key}
                  data-state={key}
                  data-state-allocation={stateAllocation}
                  className={styles.label}
                  x={x}
                  y={y}
                >
                  {key}
                </text>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Tilegram;
