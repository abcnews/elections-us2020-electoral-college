import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Allocation,
  Allocations,
  Focus,
  Focuses,
  PRESETS,
  ELECTION_YEARS_ALLOCATIONS_CANDIDATES,
  DEFAULT_ELECTION_YEAR,
  ElectionYear
} from '../../constants';
import {
  determineIfAllocationIsDefinitive,
  determineIfAllocationIsMade,
  getGroupIDForStateIDAndDelegateIndex,
  getStateAllocations
} from '../../utils';
import { STATES_DELEGATE_HEXES, STATES_LABELS, STATES_SHAPES, HEXGRID_PROPS } from './data';
import Defs, { generateKey, generatePolyKeys } from './defs';
import styles from './styles.scss';

export enum TappableLayer {
  Delegates,
  States
}

export type TilegramProps = {
  allocations?: Allocations;
  focuses?: Focuses;
  year?: ElectionYear;
  relative?: ElectionYear | null;
  tappableLayer?: TappableLayer;
  onTapGroup?: (groupID: string) => void;
  onTapState?: (stateID: string) => void;
};

const generateComponentID = () => (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 8);

const Tilegram: React.FC<TilegramProps> = props => {
  const svgRef = useRef<SVGSVGElement>(null);
  const componentID = useMemo(generateComponentID, []);
  const { allocations, focuses, year, relative, tappableLayer, onTapGroup, onTapState } = props;
  const isInteractive = !!onTapGroup;
  const [isInspecting, setIsInspecting] = useState(false);
  const hasFocuses = focuses && Object.keys(focuses).some(key => focuses[key] !== Focus.No);
  const [incumbentAllocation, challengerAllocation] = Object.keys(
    ELECTION_YEARS_ALLOCATIONS_CANDIDATES[year || DEFAULT_ELECTION_YEAR]
  );
  const relativeAllocations = relative && PRESETS[relative]?.allocations;

  const onTapDelegateHex = (event: React.MouseEvent<SVGElement>) => {
    if (onTapGroup && tappableLayer === TappableLayer.Delegates && event.target instanceof SVGUseElement) {
      const groupID = event.target.getAttribute('data-group');

      if (groupID) {
        onTapGroup(groupID);
      }
    }
  };

  const onTapStateShape = (event: React.MouseEvent<SVGElement>) => {
    if (onTapState && tappableLayer === TappableLayer.States && event.target instanceof SVGUseElement) {
      const stateID = event.target.getAttribute('data-state');

      if (stateID) {
        onTapState(stateID);
      }
    }
  };

  // We need to trick svg4everyone into not nuking our <use> elements,
  // by making it think the <svg>'s nodeName isn't "svg"
  useLayoutEffect(() => {
    const svgEl = svgRef.current;

    if (!svgEl) {
      return;
    }

    Object.defineProperty(svgEl, 'nodeName', {
      value: 'savage',
      writable: false
    });
  }, []);

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
      <svg ref={svgRef} className={styles.svg} viewBox={svgViewBox}>
        <Defs componentID={componentID} />
        <g transform={`translate(${HEXGRID_PROPS.margin} ${HEXGRID_PROPS.margin})`}>
          <use xlinkHref={countryPathsHref} className={styles.countryOuter}></use>
          <use xlinkHref={countryPathsHref} className={styles.countryInner}></use>
          <g className={styles.delegates} onClick={onTapDelegateHex}>
            {Object.keys(STATES_DELEGATE_HEXES).reduce<JSX.Element[]>((memo, stateID) => {
              const hexes = STATES_DELEGATE_HEXES[stateID];
              const xOffsets = hexes.map<number>(points => +points.split(',')[0]);
              const orderedUniqueXOffsets = Array.from(new Set(xOffsets)).sort((a, b) => a - b);
              const focus = focuses ? focuses[stateID] : Focus.No;

              return memo.concat(
                hexes.map((points, index) => {
                  const xOffset = xOffsets[index];
                  const ltrIndex = orderedUniqueXOffsets.indexOf(xOffset);
                  const rtlIndex = orderedUniqueXOffsets.length - 1 - ltrIndex;
                  const groupID = getGroupIDForStateIDAndDelegateIndex(stateID, index);
                  const keys = generatePolyKeys(componentID, 'group', groupID, index);
                  const allocation = allocations ? allocations[groupID] : Allocation.None;
                  const relativeAllocation = relativeAllocations ? relativeAllocations[groupID] : undefined;
                  const isFlipping =
                    (relativeAllocation === Allocation.GOP && allocation === Allocation.Dem) ||
                    (relativeAllocation === Allocation.Dem && allocation === Allocation.GOP);
                  const [offsetX, offsetY] = points
                    .split(' ')[0]
                    .split(',')
                    .map(x => parseInt(x, 10));

                  return (
                    <g
                      key={groupID + index}
                      className={styles.delegate}
                      data-ltr-index={ltrIndex}
                      data-rtl-index={rtlIndex}
                      data-flip-direction={
                        incumbentAllocation === allocation
                          ? 'rtl'
                          : challengerAllocation === allocation
                          ? 'ltr'
                          : undefined
                      }
                      data-focus={focus}
                      clipPath={isFlipping ? `url(#${keys['clip']})` : undefined}
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
              const stateMainAllocation = stateAllocations && stateAllocations[0];
              const hasAllocation = stateAllocations && stateAllocations.some(determineIfAllocationIsMade);
              const hasDefinitiveAllocation =
                stateAllocations && stateAllocations.some(determineIfAllocationIsDefinitive);
              const stateRelativeMainAllocation =
                relativeAllocations && getStateAllocations(stateID, relativeAllocations)[0];

              return memo.concat(
                STATES_SHAPES[stateID].map((_points, index) => {
                  const keys = generatePolyKeys(componentID, 'state', stateID, index);

                  return (
                    <g
                      key={stateID + index}
                      className={styles.state}
                      data-focus={focus}
                      clipPath={
                        focus === Focus.Yes || stateRelativeMainAllocation ? `url(#${keys['clip']})` : undefined
                      }
                    >
                      <use
                        xlinkHref={`#${keys['path']}`}
                        className={styles.stateFocus}
                        data-focus={focus}
                        data-has-allocation={hasAllocation ? '' : undefined}
                        data-has-definitive-allocation={hasDefinitiveAllocation ? '' : undefined}
                        data-main-allocation={stateMainAllocation || undefined}
                        data-relative-main-allocation={stateRelativeMainAllocation || undefined}
                      ></use>
                      <use xlinkHref={`#${keys['target']}`} className={styles.stateTarget} data-state={stateID}></use>
                    </g>
                  );
                })
              );
            }, [])}
          </g>
          <g className={styles.statesPartitions}>
            {Object.keys(STATES_SHAPES).reduce<JSX.Element[]>((memo, stateID) => {
              const focus = focuses ? focuses[stateID] : Focus.No;
              const stateRelativeMainAllocation =
                relativeAllocations && getStateAllocations(stateID, relativeAllocations)[0];

              return memo.concat(
                STATES_SHAPES[stateID].map((_points, index) => {
                  const keys = generatePolyKeys(componentID, 'state', stateID, index);

                  return (
                    <use
                      key={stateID + index}
                      xlinkHref={`#${keys['path']}`}
                      className={styles.statePartition}
                      data-focus={focus}
                      data-relative-main-allocation={stateRelativeMainAllocation || undefined}
                    ></use>
                  );
                })
              );
            }, [])}
          </g>
          <g className={styles.labels}>
            {Object.keys(STATES_LABELS).map(stateID => {
              const [, , isOutlineRequiredOnSmallDevices] = STATES_LABELS[stateID];
              const key = generateKey(componentID, 'label', stateID);
              const focus = focuses ? focuses[stateID] : Focus.No;
              const stateAllocations = allocations && getStateAllocations(stateID, allocations);
              const stateMainAllocation = stateAllocations && stateAllocations[0];
              const stateRelativeMainAllocation =
                relativeAllocations && getStateAllocations(stateID, relativeAllocations)[0];
              const isPartiallyAllocated =
                stateAllocations &&
                stateMainAllocation !== Allocation.None &&
                stateAllocations.some(allocation => allocation !== Allocation.Dem && allocation !== Allocation.GOP);

              return (
                <g
                  key={stateID}
                  className={styles.label}
                  data-focus={focus}
                  data-state={stateID}
                  data-main-allocation={stateMainAllocation || undefined}
                  data-relative-main-allocation={stateRelativeMainAllocation || undefined}
                  data-is-partially-allocated={isPartiallyAllocated ? '' : undefined}
                >
                  {(isOutlineRequiredOnSmallDevices || isPartiallyAllocated) && (
                    <use xlinkHref={`#${key}`} className={styles.labelOutline}></use>
                  )}
                  <use xlinkHref={`#${key}`} className={styles.labelText}></use>
                </g>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Tilegram;
