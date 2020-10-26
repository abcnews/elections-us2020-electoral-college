import React from 'react';
import { Allocation, Allocations, Focus, Focuses, GroupID, GROUPS, PRESETS, StateID, STATES } from '../../constants';
import {
  determineIfAllocationIsDefinitive,
  determineIfAllocationIsMade,
  determineIfMostStateAllocationsAreDefinitive,
  getGroupIDForStateIDAndDelegateIndex,
  getStateAllocations
} from '../../utils';
import { COUNTRY_PATHS, STATES_DELEGATE_HEXES, STATES_LABELS, STATES_SHAPES, HEXGRID_PROPS } from './data';
import styles from './styles.scss';

// inner stroke methods: https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn

export enum TappableLayer {
  Delegates,
  States
}

export type TilegramProps = {
  allocations?: Allocations;
  focuses?: Focuses;
  relative?: number;
  tappableLayer?: TappableLayer;
  onTapGroup?: (groupID: string) => void;
  onTapState?: (stateID: string) => void;
};

const Tilegram: React.FC<TilegramProps> = props => {
  const { allocations, focuses, relative, tappableLayer, onTapGroup, onTapState } = props;
  const isInteractive = !!onTapGroup;
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== Focus.No);
  const relativeAllocations = relative && PRESETS[relative]?.allocations;

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
  const svgViewBox = `0 0 ${svgWidth} ${svgHeight}`;

  return (
    <div
      className={styles.root}
      data-has-focuses={hasFocuses ? '' : undefined}
      data-is-interactive={isInteractive ? '' : undefined}
      data-tappable={tappableLayer}
    >
      <svg className={styles.svg} viewBox={svgViewBox}>
        <g transform={`translate(${HEXGRID_PROPS.margin} ${HEXGRID_PROPS.margin})`}>
          <g className={styles.countryOuter}>
            {COUNTRY_PATHS.map((d, index) => (
              <path key={`${d}_${index}`} d={d}></path>
            ))}
          </g>
          <g className={styles.countryInner}>
            {COUNTRY_PATHS.map((d, index) => (
              <path key={`${d}_${index}`} d={d}></path>
            ))}
          </g>
          <g className={styles.delegates} onClick={onTapDelegateHex}>
            {Object.keys(STATES_DELEGATE_HEXES).reduce<JSX.Element[]>((memo, stateID) => {
              const focus = focuses ? focuses[stateID] : Focus.No;

              return memo.concat(
                STATES_DELEGATE_HEXES[stateID].map((points, index) => {
                  const groupID = getGroupIDForStateIDAndDelegateIndex(stateID, index);
                  const allocation = allocations ? allocations[groupID] : Allocation.None;
                  const relativeAllocation = relativeAllocations ? relativeAllocations[groupID] : undefined;
                  const delegateID = `${stateID}-${index + 1}`;
                  const [offsetX, offsetY] = points
                    .split(' ')[0]
                    .split(',')
                    .map(x => parseInt(x, 10));

                  return (
                    <g
                      key={`${delegateID}_${index}`}
                      className={styles.delegate}
                      data-index={index}
                      data-focus={focus}
                      clipPath={`url(#${delegateID}_${index}_clip)`}
                    >
                      <path
                        id={`${delegateID}_${index}_path`}
                        className={styles.delegateAllocation}
                        data-relative-allocation={relativeAllocation}
                        data-allocation={allocation}
                        d={`M${points}z`}
                        style={{ transformOrigin: `${offsetX + 15}px ${offsetY}px` }}
                      >
                        <title>{STATES.find(({ id }) => id === StateID[stateID])?.name}</title>
                      </path>
                      <clipPath id={`${delegateID}_${index}_clip`}>
                        <use xlinkHref={`#${delegateID}_${index}_path`} />
                      </clipPath>
                      <polygon
                        key={`${delegateID}_${index}_target`}
                        className={styles.delegateTarget}
                        data-group={groupID}
                        points={points}
                      >
                        <title>{GROUPS.find(({ id }) => id === GroupID[groupID])?.name}</title>
                      </polygon>
                    </g>
                  );
                })
              );
            }, [])}
          </g>
          <g className={styles.states} onClick={onTapStateShape}>
            {Object.keys(STATES_SHAPES).reduce<JSX.Element[]>((memo, stateID) => {
              const focus = focuses ? focuses[stateID] : Focus.No;
              const stateAllocations = allocations && getStateAllocations(stateID, allocations);
              const hasAllocation = stateAllocations && stateAllocations.some(determineIfAllocationIsMade);
              const hasDefinitiveAllocation =
                stateAllocations && stateAllocations.some(determineIfAllocationIsDefinitive);
              const stateRelativeMainAllocation =
                relativeAllocations && getStateAllocations(stateID, relativeAllocations)[0];

              return memo.concat(
                STATES_SHAPES[stateID].map((points, index) => (
                  <g
                    key={`${stateID}_${index}`}
                    className={styles.state}
                    data-focus={focus}
                    clipPath={`url(#${stateID}_${index}_clip)`}
                  >
                    <path
                      id={`${stateID}_${index}_path`}
                      data-focus={focus}
                      data-has-allocation={hasAllocation ? '' : undefined}
                      data-has-definitive-allocation={hasDefinitiveAllocation ? '' : undefined}
                      data-relative-main-allocation={stateRelativeMainAllocation || undefined}
                      className={styles.stateFocus}
                      d={`M${points}z`}
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
                      points={points}
                    ></polygon>
                  </g>
                ))
              );
            }, [])}
          </g>
          <g className={styles.labels}>
            {Object.keys(STATES_LABELS).map(stateID => {
              const focus = focuses ? focuses[stateID] : Focus.No;
              const [x, y] = STATES_LABELS[stateID];

              return (
                <text
                  key={stateID}
                  className={styles.label}
                  data-focus={focus}
                  data-state={stateID}
                  data-most-definitively-allocated={
                    allocations && determineIfMostStateAllocationsAreDefinitive(stateID, allocations) ? '' : undefined
                  }
                  x={x}
                  y={y}
                >
                  {stateID}
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
