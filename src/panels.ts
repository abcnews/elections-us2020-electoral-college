import type { PanelDefinition } from '@abcnews/scrollyteller';
import { PRESETS, StateID, STATES } from './constants';
import { getStateAllocations } from './utils';
import blockStyles from './components/Block/styles.scss';
import type { GraphicProps, PossiblyEncodedGraphicProps } from './components/Graphic';

const SORTED_STATES = STATES.sort((a, b) => b.name.length - a.name.length);

export function applyColourToPanels(panels: PanelDefinition<PossiblyEncodedGraphicProps>[]) {
  const stateIntroductionTracker: { [key: string]: boolean } = {};

  panels.forEach(({ data, nodes }) => {
    const textNodes = nodes.reduce<Node[]>((memo, node) => memo.concat(textNodesUnder(node)), []);

    textNodes.forEach(node => {
      let text = node.textContent || '';

      SORTED_STATES.forEach(({ name }) => {
        const index = text.indexOf(name);
        if (index > -1 && text[index - 1] !== '|' && text[index + name.length] !== '|') {
          text = text.replace(name, `|||${name}|||`);
        }
      });

      if (text === node.textContent) {
        return;
      }

      const parentEl = node.parentElement;

      if (!parentEl) {
        return;
      }

      text.split('|||').forEach((part, index) => {
        const partTextNode = document.createTextNode(part);

        if (!(index % 2)) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const state = STATES.find(({ name }) => name === part);

        if (!state) {
          return parentEl.insertBefore(partTextNode, node);
        }

        const partWrapperNode = document.createElement('span');
        const stateID = StateID[state.id];
        const { allocations, relative } = data as GraphicProps;
        const stateMainAllocation = allocations && getStateAllocations(stateID, allocations)[0];
        const relativeAllocations = relative && PRESETS[relative]?.allocations;
        const stateRelativeMainAllocation = relativeAllocations && getStateAllocations(stateID, relativeAllocations)[0];

        if (!stateIntroductionTracker[stateID]) {
          stateIntroductionTracker[stateID] = true;
          partWrapperNode.setAttribute('data-is-first-encounter', '');
        }

        if (stateMainAllocation) {
          partWrapperNode.setAttribute('data-main-allocation', stateMainAllocation);
        }

        if (stateRelativeMainAllocation) {
          partWrapperNode.setAttribute('data-relative-main-allocation', stateRelativeMainAllocation);
        }

        partWrapperNode.setAttribute('data-state', stateID);
        partWrapperNode.className = blockStyles.state;
        partWrapperNode.appendChild(partTextNode);
        parentEl.insertBefore(partWrapperNode, node);
      });

      parentEl.removeChild(node);
    });
  });
}

function textNodesUnder(node: Node) {
  const textNodes: Node[] = [];
  const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
  let textNode: Node | null;

  while ((textNode = walk.nextNode())) {
    textNodes.push(textNode);
  }

  return textNodes;
}
