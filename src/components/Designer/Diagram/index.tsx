import React from 'react';
import Graph from './Graph';
import { useAppStore } from '@/redux/hooks';
import { IGraphNode, IGraphNodeData, NodeType } from '@/redux/designer/models';

function Diagram() {
  const store = useAppStore();
  const initialGraphNodes = store.getState().graph.graphNodes;
  
  
  const initialServices: Array<IGraphNode> = Object.keys(initialGraphNodes).map(
    (nodeId: string, index: number) => {
      return {
        id: nodeId,
        type: NodeType.ICON,
        position: { 
          x: 120 * (index + 1), 
          y: 80 * (index + 1)
        },
        data: { 
          label: initialGraphNodes[nodeId].id, 
          category: initialGraphNodes[nodeId].category,
          service: initialGraphNodes[nodeId].id,
        } as IGraphNodeData,
      }
    }
  );
  const initialEdges = store.getState().graph.graphEdges;
  
  return (
    <div className="flex-1 bg-black">
      <Graph
        initialServices={[]}
        initialEdges={[]}
      />
    </div>
  );
}

export default Diagram;
