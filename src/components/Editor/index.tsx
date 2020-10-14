import React, { useEffect, useMemo, useState } from 'react';
import { Allocation } from '../../constants';
import { decodeAllocations, encodeAllocations } from '../../utils';
import Graphic from '../Graphic';
import styles from './styles.scss';

const getUrlParamProps = () => {
  const [, encodedAllocations] = /[?&]allocations=([^&#]*)/i.exec(String(window.location)) || [, ''];

  return {
    allocations: decodeAllocations(encodedAllocations)
  };
};

const setUrlParamProps = props => {
  const encodedAllocations = encodeAllocations(props.allocations || {});

  history.replaceState(props, document.title, `?allocations=${encodedAllocations}`);
};

const Editor: React.FC = () => {
  const initialUrlParamProps = getUrlParamProps();
  const [allocations, setAllocations] = useState(initialUrlParamProps.allocations);

  const onTapGroup = (groupID: string) => {
    const nextAllocations = { ...allocations };

    switch (allocations[groupID]) {
      case Allocation.None:
        nextAllocations[groupID] = Allocation.Dem;
        break;
      case Allocation.Dem:
        nextAllocations[groupID] = Allocation.Rep;
        break;
      case Allocation.Rep:
        nextAllocations[groupID] = Allocation.None;
        break;
      default:
        // TODO: do we need to set this, or retain the original value?
        nextAllocations[groupID] = Allocation.None;
        break;
    }

    setAllocations(nextAllocations);
  };

  const graphicProps = useMemo(
    () => ({
      ...initialUrlParamProps,
      allocations
    }),
    [allocations]
  );

  useEffect(() => {
    setUrlParamProps(graphicProps);
  }, [graphicProps]);

  return (
    <div className={styles.root}>
      <div className={styles.graphic}>
        <Graphic onTapGroup={onTapGroup} {...graphicProps} />
      </div>
      <div className={styles.controls}></div>
    </div>
  );
};

export default Editor;
