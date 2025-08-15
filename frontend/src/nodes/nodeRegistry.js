import GenericNode from './GenericNode';
import TextNode from './TextNode';

export const defaultNodeTypes = {
  generic: GenericNode,
  text: TextNode,
};

function randomPosition() {
  const x = Math.round(200 + Math.random() * 600);
  const y = Math.round(120 + Math.random() * 400);
  return { x, y };
}

export function makeNodeFactories(generateId) {
  return {
    input: () => ({
      node: {
        id: generateId(),
        type: 'generic',
        data: {
          title: 'Input',
          subtitle: 'Pipeline Input',
          icon: '🟢',
          inputs: [],
          outputs: ['value'],
          content: () => null,
        },
      },
      position: randomPosition(),
    }),
    output: () => ({
      node: {
        id: generateId(),
        type: 'generic',
        data: {
          title: 'Output',
          subtitle: 'Pipeline Output',
          icon: '🏁',
          inputs: ['value'],
          outputs: [],
          content: () => null,
        },
      },
      position: randomPosition(),
    }),
    llm: () => ({
      node: {
        id: generateId(),
        type: 'generic',
        data: {
          title: 'LLM',
          subtitle: 'ChatGPT-like',
          icon: '🤖',
          inputs: ['prompt'],
          outputs: ['response'],
          content: () => <div style={{ color: 'var(--muted)' }}>Model: gpt-4o-mini</div>,
        },
      },
      position: randomPosition(),
    }),
    text: () => ({
      node: {
        id: generateId(),
        type: 'text',
        data: {
          value: '',
        },
      },
      position: randomPosition(),
    }),
    // additional 5 nodes demonstrating abstraction flexibility
    tool: () => ({
      node: {
        id: generateId(),
        type: 'generic',
        data: {
          title: 'Tool',
          subtitle: 'External API',
          icon: '🛠️',
          inputs: ['input'],
          outputs: ['result'],
          content: () => <div style={{ color: 'var(--muted)' }}>Endpoint: /search</div>,
        },
      },
      position: randomPosition(),
    }),
    prompt: () => ({
      node: {
        id: generateId(),
        type: 'generic',
        data: {
          title: 'Prompt',
          subtitle: 'Template',
          icon: '📝',
          inputs: ['vars'],
          outputs: ['prompt'],
          content: () => <div style={{ color: 'var(--muted)' }}>Few-shot: 2 examples</div>,
        },
      },
      position: randomPosition(),
    }),
    transform: () => ({
      node: {
        id: generateId(),
        type: 'generic',
        data: {
          title: 'Transform',
          subtitle: 'Map Function',
          icon: '🔁',
          inputs: ['in'],
          outputs: ['out'],
          content: () => <div style={{ color: 'var(--muted)' }}>fn: toUpperCase</div>,
        },
      },
      position: randomPosition(),
    }),
    filter: () => ({
      node: {
        id: generateId(),
        type: 'generic',
        data: {
          title: 'Filter',
          subtitle: 'Predicate',
          icon: '🔎',
          inputs: ['in'],
          outputs: ['pass', 'fail'],
          content: () => <div style={{ color: 'var(--muted)' }}>cond: length &gt; 10</div>,
        },
      },
      position: randomPosition(),
    }),
    branch: () => ({
      node: {
        id: generateId(),
        type: 'generic',
        data: {
          title: 'Branch',
          subtitle: 'Conditional',
          icon: '🌿',
          inputs: ['in'],
          outputs: ['A', 'B'],
          content: () => <div style={{ color: 'var(--muted)' }}>if/else</div>,
        },
      },
      position: randomPosition(),
    }),
  };
}