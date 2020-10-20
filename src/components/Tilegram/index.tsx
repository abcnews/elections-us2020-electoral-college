import React from 'react';
import { Allocation, Allocations, Wall, Walls, GroupID, GROUPS, StateID, STATES } from '../../constants';
import { getGroupIDsForStateID, getGroupIDForStateIDAndDelegateIndex } from '../../utils';
import { COUNTRY_PATHS, STATES_DELEGATE_HEXES, STATES_LABELS, STATES_SHAPES, HEXGRID_PROPS } from './data';
import styles from './styles.scss';

// inner stroke methods: https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn

export enum TappableLayer {
  Delegates,
  States
}

export type TilegramProps = {
  allocations?: Allocations;
  walls?: Walls;
  tappableLayer?: TappableLayer;
  onTapGroup?: (groupID: string) => void;
  onTapState?: (stateID: string) => void;
};

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
    if (onTapState && tappableLayer === TappableLayer.States && event.target instanceof SVGPolygonElement) {
      const stateID = event.target.dataset.state;

      if (stateID) {
        onTapState(stateID);
      }
    }
  };

  const svgWidth = HEXGRID_PROPS.width + 2 * HEXGRID_PROPS.margin;
  const svgHeight = HEXGRID_PROPS.height + 2 * HEXGRID_PROPS.margin;

  const svgAttrs = {
    width: svgWidth,
    height: svgHeight,
    viewBox: `0 0 ${svgWidth} ${svgHeight}`
  };

  return (
    <div className={`${styles.root}${isInteractive ? ` ${styles.isInteractive}` : ''}`} data-tappable={tappableLayer}>
      <svg className={styles.svg} {...svgAttrs}>
        <g transform={`translate(${HEXGRID_PROPS.margin} ${HEXGRID_PROPS.margin})`}>
          <g className={styles.country}>
            {COUNTRY_PATHS.map((d, index) => (
              <path key={`${d}_${index}`} d={d}></path>
            ))}
          </g>
          <g className={styles.delegates} onClick={onTapDelegateHex}>
            {Object.keys(STATES_DELEGATE_HEXES).reduce<JSX.Element[]>(
              (memo, stateID) =>
                memo.concat(
                  STATES_DELEGATE_HEXES[stateID].map((points, index) => {
                    const groupID = getGroupIDForStateIDAndDelegateIndex(stateID, index);
                    const allocation = allocations ? allocations[groupID] : Allocation.None;
                    const delegateID = `${stateID}-${index + 1}`;

                    return (
                      <polygon
                        key={delegateID}
                        data-allocation={allocation}
                        data-group={groupID}
                        data-delegate={delegateID}
                        className={styles.delegate}
                        points={points}
                      >
                        <title>{GROUPS.find(({ id }) => id === GroupID[groupID])?.name}</title>
                      </polygon>
                    );
                  })
                ),
              []
            )}
          </g>
          <g className={styles.states} onClick={onTapStateShape}>
            {Object.keys(STATES_SHAPES).reduce<JSX.Element[]>((memo, stateID) => {
              const wall = walls ? walls[stateID] : Wall.No;
              const hasAllocation = getGroupIDsForStateID(stateID).some(
                groupID => allocations && allocations[groupID] !== Allocation.None
              );

              return memo.concat(
                STATES_SHAPES[stateID].map((points, index) => (
                  <g key={`${stateID}_${index}`}>
                    <path
                      id={`${stateID}_${index}_path`}
                      data-wall={wall}
                      data-has-allocation={hasAllocation ? '' : undefined}
                      className={styles.stateWall}
                      d={`M${points}z`}
                      clipPath={`url(#${stateID}_${index}_clip)`}
                    >
                      <title>{STATES.find(({ id }) => id === StateID[stateID])?.name}</title>
                    </path>
                    <clipPath id={`${stateID}_${index}_clip`}>
                      <use xlinkHref={`#${stateID}_${index}_path`} />
                    </clipPath>
                    <polygon
                      key={`${stateID}_${index}_target`}
                      className={styles.stateTarget}
                      data-state={stateID}
                      data-has-allocation={hasAllocation}
                      points={points}
                    ></polygon>
                  </g>
                ))
              );
            }, [])}
          </g>
          <g className={styles.labels}>
            {Object.keys(STATES_LABELS).map(key => {
              const [x, y] = STATES_LABELS[key];
              const allocationsForState = getGroupIDsForStateID(key).map(groupID =>
                allocations ? allocations[groupID] : Allocation.None
              );
              const hasMostDefinitiveAllocated =
                allocationsForState.filter(allocation => allocation === Allocation.Dem || allocation === Allocation.Rep)
                  .length *
                  2 >
                allocationsForState.length;

              return (
                <text
                  key={key}
                  data-state={key}
                  data-most-definitively-allocated={hasMostDefinitiveAllocated ? '' : undefined}
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
