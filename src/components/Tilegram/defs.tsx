import React, { memo } from 'react';
import { GroupID, GROUPS, StateID, STATES } from '../../constants';
import { getGroupIDForStateIDAndDelegateIndex } from '../../utils';
import { COUNTRY_PATHS, STATES_DELEGATE_HEXES, STATES_SHAPES } from './data';

const KEY_NAMES = ['path', 'clip', 'target'];

export const generateKey = (componentID: string, group: string, id: string, index: number, key: string) =>
  `${componentID}_${group}_${id}_${index}_${key}`;

export const generateKeys = (componentID: string, group: string, id: string, index: number) =>
  KEY_NAMES.reduce((memo, key) => {
    memo[key] = generateKey(componentID, group, id, index, key);

    return memo;
  }, {});

export type DefsProps = {
  componentID: string;
};

const Defs: React.FC<DefsProps> = ({ componentID }) => {
  const countryPathsKey = componentID + '_country';

  return (
    <defs>
      <g key={countryPathsKey} id={countryPathsKey}>
        {COUNTRY_PATHS.map((d, index) => (
          <path key={index} d={d}></path>
        ))}
      </g>
      {Object.keys(STATES_DELEGATE_HEXES).reduce<JSX.Element[]>((memo, stateID) => {
        return memo.concat(
          STATES_DELEGATE_HEXES[stateID].reduce<JSX.Element[]>((memo, points, index) => {
            const groupID = getGroupIDForStateIDAndDelegateIndex(stateID, index);
            const keys = generateKeys(componentID, 'group', groupID, index);

            return memo.concat([
              <path key={keys['path']} id={keys['path']} d={`M${points}z`}></path>,
              <clipPath key={keys['clip']} id={keys['clip']}>
                <use xlinkHref={`#${keys['path']}`} />
              </clipPath>,
              <polygon key={keys['target']} id={keys['target']} points={points}>
                <title>{GROUPS.find(({ id }) => id === GroupID[groupID])?.name}</title>
              </polygon>
            ]);
          }, [])
        );
      }, [])}
      {Object.keys(STATES_SHAPES).reduce<JSX.Element[]>((memo, stateID) => {
        return memo.concat(
          STATES_SHAPES[stateID].reduce<JSX.Element[]>((memo, points, index) => {
            const keys = generateKeys(componentID, 'state', stateID, index);

            return memo.concat([
              <path key={keys['path']} id={keys['path']} d={`M${points}z`}></path>,
              <clipPath key={keys['clip']} id={keys['clip']}>
                <use xlinkHref={`#${keys['path']}`} />
              </clipPath>,
              <polygon key={keys['target']} id={keys['target']} points={points}>
                <title>{STATES.find(({ id }) => id === StateID[stateID])?.name}</title>
              </polygon>
            ]);
          }, [])
        );
      }, [])}
    </defs>
  );
};

export default memo(Defs);
