import React, { useEffect, useMemo, useState } from 'react';
import { Allocation, Allocations, Focus, Focuses, PRESETS } from '../../constants';
import {
  determineIfAllocationIsDefinitive,
  determineIfAllocationIsMade,
  determineIfMostStateAllocationsAreDefinitive,
  getGroupIDForStateIDAndDelegateIndex,
  getStateAllocations
} from '../../utils';
import { STATES_DELEGATE_HEXES, STATES_LABELS, STATES_SHAPES, HEXGRID_PROPS } from './data';
import Defs, { generateKeys } from './defs';
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

const generateComponentID = () => (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 8);

const Tilegram: React.FC<TilegramProps> = props => {
  const componentID = useMemo(generateComponentID, []);
  const { allocations, focuses, relative, tappableLayer, onTapGroup, onTapState } = props;
  const isInteractive = !!onTapGroup;
  const [isInspecting, setIsInspecting] = useState(false);
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== Focus.No);
  const relativeAllocations = relative && PRESETS[relative]?.allocations;

  const onTapDelegateHex = (event: React.MouseEvent<SVGElement>) => {
    if (onTapGroup && tappableLayer === TappableLayer.Delegates && event.target instanceof SVGUseElement) {
      const groupID = event.target.dataset.group;

      if (groupID) {
        onTapGroup(groupID);
      }
    }
  };

  const onTapStateShape = (event: React.MouseEvent<SVGElement>) => {
    if (onTapState && tappableLayer === TappableLayer.States && event.target instanceof SVGUseElement) {
      const stateID = event.target.dataset.state;

      if (stateID) {
        onTapState(stateID);
      }
    }
  };

  useEffect(() => {
    if (!isInteractive) {
      return;
    }

    function handler(event: KeyboardEvent) {
      setIsInspecting(event.altKey);
    }

    window.addEventListener('keydown', handler, false);
    window.addEventListener('keyup', handler, false);

    return () => {
      window.removeEventListener('keydown', handler, false);
      window.removeEventListener('keyup', handler, false);
    };
  }, [isInteractive]);

  const svgWidth = HEXGRID_PROPS.width + 2 * HEXGRID_PROPS.margin;
  const svgHeight = HEXGRID_PROPS.height + 2 * HEXGRID_PROPS.margin;
  const svgViewBox = `0 0 ${svgWidth} ${svgHeight}`;
  const countryPathsHref = `#${componentID}_country`;

  return (
    <div
      className={styles.root}
      data-has-focuses={hasFocuses ? '' : undefined}
      data-is-interactive={isInteractive ? '' : undefined}
      data-is-inspecting={isInspecting ? '' : undefined}
      data-tappable={tappableLayer}
      style={{ paddingBottom: `${(svgHeight / svgWidth) * 100}%` }}
    >
      <svg className={styles.svg} viewBox={svgViewBox}>
        <Defs componentID={componentID} />
        <g transform={`translate(${HEXGRID_PROPS.margin} ${HEXGRID_PROPS.margin})`}>
          <use xlinkHref={countryPathsHref} className={styles.countryOuter}></use>
          <use xlinkHref={countryPathsHref} className={styles.countryInner}></use>
          <g className={styles.delegates} onClick={onTapDelegateHex}>
            {Object.keys(STATES_DELEGATE_HEXES).reduce<JSX.Element[]>((memo, stateID) => {
              const focus = focuses ? focuses[stateID] : Focus.No;

              return memo.concat(
                STATES_DELEGATE_HEXES[stateID].map((points, index) => {
                  const groupID = getGroupIDForStateIDAndDelegateIndex(stateID, index);
                  const keys = generateKeys(componentID, 'group', groupID, index);
                  const allocation = allocations ? allocations[groupID] : Allocation.None;
                  const relativeAllocation = relativeAllocations ? relativeAllocations[groupID] : undefined;
                  const [offsetX, offsetY] = points
                    .split(' ')[0]
                    .split(',')
                    .map(x => parseInt(x, 10));

                  return (
                    <g
                      key={groupID + index}
                      className={styles.delegate}
                      data-focus={focus}
                      clipPath={`url(#${keys['clip']})`}
                    >
                      <use
                        xlinkHref={`#${keys['path']}`}
                        className={styles.delegateAllocation}
                        data-relative-allocation={relativeAllocation}
                        data-allocation={allocation}
                        style={{ transformOrigin: `${offsetX + 15}px ${offsetY}px` }}
                      />
                      <use
                        xlinkHref={`#${keys['target']}`}
                        className={styles.delegateTarget}
                        data-group={groupID}
                      ></use>
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
                STATES_SHAPES[stateID].map((_points, index) => {
                  const keys = generateKeys(componentID, 'state', stateID, index);

                  return (
                    <g
                      key={stateID + index}
                      className={styles.state}
                      data-focus={focus}
                      clipPath={`url(#${keys['clip']})`}
                    >
                      <use
                        xlinkHref={`#${keys['path']}`}
                        className={styles.stateFocus}
                        data-focus={focus}
                        data-has-allocation={hasAllocation ? '' : undefined}
                        data-has-definitive-allocation={hasDefinitiveAllocation ? '' : undefined}
                        data-relative-main-allocation={stateRelativeMainAllocation || undefined}
                      ></use>
                      <use xlinkHref={`#${keys['target']}`} className={styles.stateTarget} data-state={stateID}></use>
                    </g>
                  );
                })
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
                  y={y + 5 /* shift baseline down */}
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
