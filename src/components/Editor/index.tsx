import React, { useEffect, useMemo, useState } from 'react';
import {
  Allocation,
  Allocations,
  ALLOCATIONS,
  INITIAL_ALLOCATIONS,
  Focus,
  Focuses,
  FOCUSES,
  INITIAL_FOCUSES,
  MIXINS,
  PRESETS
} from '../../constants';
import {
  getGroupIDsForStateID,
  graphicPropsToAlternatingCase,
  urlQueryToGraphicProps,
  graphicPropsToUrlQuery
} from '../../utils';
import type { GraphicProps } from '../Graphic';
import Graphic from '../Graphic';
import graphicStyles from '../Graphic/styles.scss';
import { TappableLayer } from '../Tilegram';
import tilegramStyles from '../Tilegram/styles.scss';
import totalsStyles from '../Totals/styles.scss';
import styles from './styles.scss';

const COMPONENTS_STYLES = {
  Graphic: graphicStyles,
  Totals: totalsStyles,
  Tilegram: tilegramStyles
};

const DEFAULT_GRAPHIC_PROPS = {
  allocations: INITIAL_ALLOCATIONS,
  focuses: INITIAL_FOCUSES,
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
  const [focuses, setFocuses] = useState<Focuses>(initialUrlParamProps.focuses);
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

  const mixinGraphicProps = (mixin: GraphicProps) => {
    setAllocations({
      ...allocations,
      ...mixin.allocations
    });
    setFocuses({
      ...focuses,
      ...mixin.focuses
    });
  };

  const replaceGraphicProps = (replacement: GraphicProps) => {
    setAllocations({
      ...INITIAL_ALLOCATIONS,
      ...replacement.allocations
    });
    setFocuses({
      ...INITIAL_FOCUSES,
      ...replacement.focuses
    });
  };

  const onTapGroup = (groupID: string) => {
    const allocationsToMixin: Allocations = {};
    const focusesToMixin: Focuses = {};

    const allocation = allocations[groupID];
    const allocationIndex = ALLOCATIONS.indexOf(allocation);

    // Cycle to the next Allocation in the enum (or the first if we don't recognise it)
    allocationsToMixin[groupID] = ALLOCATIONS[
      allocationIndex === ALLOCATIONS.length - 1 ? 0 : allocationIndex + 1
    ] as Allocation;

    // Clear the respective focus if we just changed any of its state's electors
    const [stateID] = groupID.split('_');

    focusesToMixin[stateID] = Focus.No;

    mixinGraphicProps({ allocations: allocationsToMixin, focuses: focusesToMixin });
  };

  const onTapState = (stateID: string) => {
    const focusesToMixin: Focuses = {};

    // Don't allow state toggling while any of that state's electors are currently allocated
    const hasAllocation = getGroupIDsForStateID(stateID).some(
      groupID => allocations && allocations[groupID] !== Allocation.None
    );

    if (hasAllocation) {
      return;
    }

    switch (focuses[stateID]) {
      case Focus.No:
        focusesToMixin[stateID] = Focus.Yes;
        break;
      case Focus.Yes:
        focusesToMixin[stateID] = Focus.Dem;
        break;
      case Focus.Dem:
        focusesToMixin[stateID] = Focus.GOP;
        break;
      case Focus.GOP:
        focusesToMixin[stateID] = Focus.No;
        break;
      default:
        // TODO: do we need to set this, or retain the original value?
        focusesToMixin[stateID] = Focus.No;
        break;
    }

    const focus = focuses[stateID];
    const focusIndex = FOCUSES.indexOf(focus);

    // Cycle to the next Focus in the enum (or the first if we don't recognise it)
    focusesToMixin[stateID] = FOCUSES[focusIndex === FOCUSES.length - 1 ? 0 : focusIndex + 1] as Focus;

    mixinGraphicProps({ focuses: focusesToMixin });
  };

  const graphicProps = useMemo(
    () => ({
      ...initialUrlParamProps,
      allocations,
      focuses,
      tappableLayer
    }),
    [allocations, focuses, tappableLayer]
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

  const fallbackAutomationBaseURL = useMemo(
    () =>
      `https://fallback-automation.drzax.now.sh/api?url=${encodeURIComponent(
        String(document.location.href).split('?')[0] + graphicPropsAsUrlQuery
      )}&width=600&selector=.`,
    [graphicPropsAsUrlQuery]
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
              Delegates (vote assignment)
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
              States (focus toggles)
            </label>
          </span>
        </div>
        <label>
          Mix-ins <small>(added to the map)</small>
        </label>
        <div className={styles.flexRow}>
          {Object.keys(MIXINS).map(key => {
            const { name, ...graphicProps } = MIXINS[key];

            return (
              <button key={key} onClick={() => mixinGraphicProps(graphicProps)}>
                {name || key}
              </button>
            );
          })}
        </div>
        <label>
          Presets <small>(replace the whole map)</small>
        </label>
        <div className={styles.flexRow}>
          <button key="empty" onClick={() => replaceGraphicProps({})}>
            Empty
          </button>
          {Object.keys(PRESETS).map(key => {
            const { name, ...graphicProps } = PRESETS[key];

            return (
              <button key={key} onClick={() => replaceGraphicProps(graphicProps)}>
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
              <button
                onClick={() =>
                  navigator.clipboard.writeText(String(window.location.href).split('?')[0] + snapshots[name])
                }
              >
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
              <a
                href={snapshots[name]}
                onClick={event => {
                  event.preventDefault();
                  replaceGraphicProps(urlQueryToGraphicProps(snapshots[name]));
                }}
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
        <label>Static image downloads</label>
        <ul>
          {Object.keys(COMPONENTS_STYLES).map(key => (
            <li key={key}>
              <a
                href={`${fallbackAutomationBaseURL}${encodeURIComponent(COMPONENTS_STYLES[key].root)}`}
                download={`fallback-${key}-${graphicPropsAsAlternatingCase}.png`}
              >
                {key}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Editor;
