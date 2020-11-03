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
  PRESETS,
  ElectionYear,
  ELECTION_YEARS
} from '../../constants';
import { loadData } from '../../data';
import {
  alternatingCaseToGraphicProps,
  graphicPropsToAlternatingCase,
  urlQueryToGraphicProps,
  graphicPropsToUrlQuery,
  liveResultsToGraphicProps
} from '../../utils';
import type { GraphicProps } from '../Graphic';
import Graphic, { DEFAULT_PROPS as DEFAULT_GRAPHIC_PROPS } from '../Graphic';
import graphicStyles from '../Graphic/styles.scss';
import Icon from '../Icon';
import { TappableLayer } from '../Tilegram';
import tilegramStyles from '../Tilegram/styles.scss';
import totalsStyles from '../Totals/styles.scss';
import styles from './styles.scss';

const COMPONENTS_STYLES = {
  Graphic: graphicStyles,
  Totals: totalsStyles,
  Tilegram: tilegramStyles
};

const INITIAL_GRAPHIC_PROPS = {
  allocations: { ...INITIAL_ALLOCATIONS },
  focuses: { ...INITIAL_FOCUSES },
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
  const initialUrlParamProps = useMemo(
    () => ({
      ...INITIAL_GRAPHIC_PROPS,
      ...DEFAULT_GRAPHIC_PROPS,
      ...urlQueryToGraphicProps(String(window.location.search))
    }),
    []
  );
  const [allocations, setAllocations] = useState<Allocations>(initialUrlParamProps.allocations);
  const [focuses, setFocuses] = useState<Focuses>(initialUrlParamProps.focuses);
  const [year, setYear] = useState<ElectionYear>(initialUrlParamProps.year);
  const [relative, setRelative] = useState<number | null>(initialUrlParamProps.relative);
  const [counting, setCounting] = useState(initialUrlParamProps.counting);
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
    setYear(mixin.year || year);
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
    setYear(replacement.year || DEFAULT_GRAPHIC_PROPS.year);
  };

  const importMarker = (marker: string) => {
    const graphicProps = alternatingCaseToGraphicProps(marker);

    replaceGraphicProps(graphicProps);
    setRelative(graphicProps.relative || DEFAULT_GRAPHIC_PROPS.relative);
    setCounting(graphicProps.counting || DEFAULT_GRAPHIC_PROPS.counting);
  };

  const loadLiveResults = () => {
    loadData({ forceRefresh: true }).then(data => {
      const graphicProps = liveResultsToGraphicProps(data);

      replaceGraphicProps(graphicProps);
      setRelative(graphicProps.relative || DEFAULT_GRAPHIC_PROPS.relative);
    });
  };

  const onTapGroup = (groupID: string) => {
    const allocationsToMixin: Allocations = {};

    const allocation = allocations[groupID];
    const allocationIndex = ALLOCATIONS.indexOf(allocation);

    // Cycle to the next Allocation in the enum (or the first if we don't recognise it)
    allocationsToMixin[groupID] = ALLOCATIONS[
      allocationIndex === ALLOCATIONS.length - 1 ? 0 : allocationIndex + 1
    ] as Allocation;

    mixinGraphicProps({ allocations: allocationsToMixin });
  };

  const onTapState = (stateID: string) => {
    const focusesToMixin: Focuses = {};

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
      year,
      relative,
      counting,
      tappableLayer
    }),
    [allocations, focuses, year, relative, counting, tappableLayer]
  );

  const graphicPropsAsAlternatingCase = useMemo(
    () => graphicPropsToAlternatingCase(graphicProps, DEFAULT_GRAPHIC_PROPS),
    [graphicProps]
  );
  const graphicPropsAsUrlQuery = useMemo(() => graphicPropsToUrlQuery(graphicProps, DEFAULT_GRAPHIC_PROPS), [
    graphicProps
  ]);

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
                name="tappableLayer"
                value={TappableLayer.Delegates}
                checked={TappableLayer.Delegates === tappableLayer}
                onChange={() => setTappableLayer(TappableLayer.Delegates)}
              ></input>
              Assigned delegates
            </label>
          </span>
          <span>
            <label>
              <input
                type="radio"
                name="tappableLayer"
                value={TappableLayer.States}
                checked={TappableLayer.States === tappableLayer}
                onChange={() => setTappableLayer(TappableLayer.States)}
              ></input>
              Focused states
            </label>
          </span>
        </div>
        <label>
          Current year <small>(set candidate names &amp; sides)</small>
        </label>
        <div className={styles.flexRow}>
          {ELECTION_YEARS.map(_year => (
            <span key={_year}>
              <label>
                <input
                  type="radio"
                  name="year"
                  value={_year}
                  checked={_year === year}
                  onChange={() => setYear(_year)}
                ></input>
                {_year}
              </label>
            </span>
          ))}
        </div>
        <label>
          Relative year <small>(show incumbent outlines &amp; flips)</small>
        </label>
        <div className={styles.flexRow}>
          <span key="none">
            <label>
              <input
                type="radio"
                name="relative"
                value={'none'}
                checked={null === relative}
                onChange={() => setRelative(null)}
              ></input>
              None
            </label>
          </span>
          {Object.keys(PRESETS)
            .map(key => parseInt(key, 10))
            .filter(key => !isNaN(key))
            .reverse()
            .map(year => (
              <span key={year}>
                <label>
                  <input
                    type="radio"
                    name="relative"
                    value={year}
                    checked={year === relative}
                    onChange={() => setRelative(year)}
                  ></input>
                  {year}
                </label>
              </span>
            ))}
        </div>
        <label>Counting</label>
        <div className={styles.flexRow}>
          <span key="none">
            <label>
              <input
                type="checkbox"
                name="counting"
                value="counting"
                checked={counting}
                onChange={() => setCounting(!counting)}
              ></input>
              Show totals
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
          <button key="live" onClick={loadLiveResults}>
            Live results
          </button>
        </div>
        <label>
          Story markers
          <button
            onClick={() => {
              const marker = prompt('Paste a marker here to import its configuration');

              if (!marker || !marker.length) {
                return alert('No marker was provided');
              }

              importMarker(marker);
            }}
          >
            <Icon name="edit" />
          </button>
        </label>
        {markersData.map(({ label, note, text }) => (
          <details key={label}>
            <summary>
              {label}
              <button onClick={() => navigator.clipboard.writeText(text)}>
                <Icon name="share" />
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
            <Icon name="add" />
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
                <Icon name="share" />
              </button>
              <button onClick={() => deleteSnapshot(name)}>
                <Icon name="delete" />
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
