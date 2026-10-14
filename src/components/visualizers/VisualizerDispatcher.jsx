import React from 'react';
import VDOMVisualizer from './VDOMVisualizer';
import StateBatchingVisualizer from './StateBatchingVisualizer';
import UseEffectTimeline from './UseEffectTimeline';
import RefVsStateVisualizer from './RefVsStateVisualizer';
import CustomHooksWorkshop from './CustomHooksWorkshop';
import ReRenderProfiler from './ReRenderProfiler';
import UseMemoBenchmark from './UseMemoBenchmark';
import UseReducerBank from './UseReducerBank';
import React19OptimisticDemo from './React19OptimisticDemo';
import { 
  PropsFlowVisualizer, 
  ListsKeysVisualizer, 
  ContextVisualizer, 
  React19ActionsVisualizer, 
  FiberVisualizer 
} from './AdditionalVisualizers';

export default function VisualizerDispatcher({ visualizerId }) {
  switch (visualizerId) {
    case 'vdom':
      return <VDOMVisualizer />;
    case 'props-flow':
      return <PropsFlowVisualizer />;
    case 'state-batching':
    case 'events-forms':
      return <StateBatchingVisualizer />;
    case 'lists-keys':
      return <ListsKeysVisualizer />;
    case 'effect-timeline':
      return <UseEffectTimeline />;
    case 'ref-vs-state':
      return <RefVsStateVisualizer />;
    case 'custom-hooks':
      return <CustomHooksWorkshop />;
    case 'context-demo':
    case 'portals-modal':
      return <ContextVisualizer />;
    case 'rerender-profiler':
      return <ReRenderProfiler />;
    case 'usememo-bench':
      return <UseMemoBenchmark />;
    case 'usereducer-bank':
      return <UseReducerBank />;
    case 'react19-optimistic':
      return <React19OptimisticDemo />;
    case 'react19-actions':
    case 'react19-use':
      return <React19ActionsVisualizer />;
    case 'fiber-reconciler':
      return <FiberVisualizer />;
    default:
      return <VDOMVisualizer />;
  }
}
