import React, { useEffect, useMemo, useState } from 'react';
import { Allocations, INITIAL_WALLS, Walls } from '../../constants';
import { Allocation, Wall, INITIAL_ALLOCATIONS, MIXINS, PRESETS } from '../../constants';
import { graphicPropsToAlternatingCase, urlQueryToGraphicProps, graphicPropsToUrlQuery } from '../../utils';
import Graphic from '../Graphic';
import { TappableLayer } from '../Tilegram';
import styles from './styles.scss';

const DEFAULT_GRAPHIC_PROPS = {
  allocations: INITIAL_ALLOCATIONS,
  walls: INITIAL_WALLS,
  tappableLayer: TappableLayer.Delegates
};

const STORY_MARKERS = [
  { label: 'Standalone graphic', prefix: 'ecgraphic' },
  {
    label: 'Scrollyteller opener',
    note: `If you're placing multiple scrollytellers in a single story, each must have a unique NAME.`,
    prefix: 'scrollytellerNAMEecblock'
  },
  { label: 'Scrollyteller mark', prefix: 'mark' }
];

const SNAPSHOTS_LOCALSTORAGE_KEY = 'eceditorsnapshots';

const Editor: React.FC = () => {
  const initialUrlParamProps = {
    ...DEFAULT_GRAPHIC_PROPS,
    ...urlQueryToGraphicProps(String(window.location.search))
  };
  const [allocations, setAllocations] = useState<Allocations>(initialUrlParamProps.allocations);
  const [walls, setWalls] = useState<Walls>(initialUrlParamProps.walls);
  const [tappableLayer, setTappableLayer] = useState(initialUrlParamProps.tappableLayer);
  const [snapshots, setSnapshots] = useState(JSON.parse(localStorage.getItem(SNAPSHOTS_LOCALSTORAGE_KEY) || '{}'));

  const createSnapshot = (name: string, urlQuery: string) => {
    const nextSnapshots = {
      [name]: urlQuery,
      ...snapshots
    };

    localStorage.setItem(SNAPSHOTS_LOCALSTORAGE_KEY, JSON.stringify(nextSnapshots));
    setSnapshots(nextSnapshots);
  };

  const deleteSnapshot = (name: string) => {
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

  const mixinWalls = (mixin: Walls) =>
    setWalls({
      ...walls,
      ...mixin
    });

  const onTapState = (stateID: string) => {
    const wallsToMixin: Walls = {};

    switch (walls[stateID]) {
      case Wall.No:
        wallsToMixin[stateID] = Wall.Yes;
        break;
      case Wall.Yes:
        wallsToMixin[stateID] = Wall.Dem;
        break;
      case Wall.Dem:
        wallsToMixin[stateID] = Wall.Rep;
        break;
      case Wall.Rep:
        wallsToMixin[stateID] = Wall.No;
        break;
      default:
        // TODO: do we need to set this, or retain the original value?
        wallsToMixin[stateID] = Wall.No;
        break;
    }

    mixinWalls(wallsToMixin);
  };

  const graphicProps = useMemo(
    () => ({
      ...initialUrlParamProps,
      allocations,
      walls,
      tappableLayer
    }),
    [allocations, walls, tappableLayer]
  );

  const graphicPropsAsAlternatingCase = useMemo(() => graphicPropsToAlternatingCase(graphicProps), [graphicProps]);
  const graphicPropsAsUrlQuery = useMemo(() => graphicPropsToUrlQuery(graphicProps), [graphicProps]);

  const markersData = useMemo(
    () =>
      STORY_MARKERS.map(({ label, note, prefix }) => ({
        label,
        note,
        text: `#${prefix}${graphicPropsAsAlternatingCase}`
      })),
    [graphicPropsAsAlternatingCase]
  );

  useEffect(() => {
    history.replaceState(graphicProps, document.title, graphicPropsAsUrlQuery);
  }, [graphicPropsAsUrlQuery]);

  return (
    <div className={styles.root}>
      <div className={styles.graphic}>
        <Graphic
          tappableLayer={TappableLayer.States}
          onTapGroup={onTapGroup}
          onTapState={onTapState}
          {...graphicProps}
        />
      </div>
      <div className={styles.controls}>
        <label>Active layer</label>
        <div className={styles.flexRow}>
          <span>
            <label>
              <input
                type="radio"
                name="tappableDelegates"
                value={TappableLayer.Delegates}
                checked={TappableLayer.Delegates === tappableLayer}
                onChange={() => setTappableLayer(TappableLayer.Delegates)}
              ></input>
              Delegates (fills)
            </label>
          </span>
          <span>
            <label>
              <input
                type="radio"
                name="tappableStates"
                value={TappableLayer.States}
                checked={TappableLayer.States === tappableLayer}
                onChange={() => setTappableLayer(TappableLayer.States)}
              ></input>
              States (outlines)
            </label>
          </span>
        </div>
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
        {markersData.map(({ label, note, text }) => (
          <details key={label}>
            <summary>
              {label}
              <button onClick={() => navigator.clipboard.writeText(text)}>
                <svg viewBox="0 0 24 24">
                  <g fill="none" fillRule="evenodd">
                    <path d="M0 0h24v24H0z" />
                    <path
                      d="M15 13.406S5.458 11.47 3.003 19.031c0 0-.438-11.25 11.999-11.25V4.97L21 10.594l-6 5.625v-2.813z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </button>
            </summary>
            <pre>{text}</pre>
            {note && <small style={{ color: 'red' }}>{`Note: ${note}`}</small>}
          </details>
        ))}
        <label htmlFor="definitely-not-the-add-button">
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
            <svg viewBox="0 0 24 24">
              <g fill="none" fillRule="evenodd">
                <path d="M0 0h24v24H0z" />
                <path
                  d="M11.173 4.084h1.65v7.092h7.1v1.65h-7.1v7.09h-1.65v-7.09H4.077v-1.65h7.096V4.084z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </button>
        </label>
        <ul>
          {Object.keys(snapshots).map(name => (
            <li key={name}>
              <button onClick={() => deleteSnapshot(name)}>
                <svg viewBox="0 0 24 24">
                  <g fill="none" fillRule="evenodd">
                    <path d="M0 0h24v24H0z" />
                    <path
                      d="M4.218 4.36l-.031-.006 3.943-.508L8.649 2h6.87l.4 1.83 4.015.524-.066.006h.069l.415 1.609H3.648l.534-1.609h.036zm.44 2.724h14.805L18.38 22.031H5.919L4.658 7.084zm1.441 1.457l1.006 12.072h9.932l.864-12.072H6.099z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </button>{' '}
              <a href={snapshots[name]}>{name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Editor;
