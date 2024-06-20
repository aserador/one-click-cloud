import React from 'react';
import Graph from './Graph';
import { useAppStore } from '@/redux/hooks';
import { IGraphNode, IGraphNodeData, NodeType } from '@/redux/designer/models';
import { Edge } from 'reactflow';

function Diagram() {
  const store = useAppStore();
  const initialGraph = store.getState().graph;
  const initialGraphNodes = initialGraph.graphNodes;
  const initialGraphEdges = initialGraph.graphEdges;
  const initialNodes: Array<IGraphNode> = Object.keys(initialGraphNodes).map(
    (nodeId: string, index: number) => ({
        id: nodeId,
        type: NodeType.ICON,
        position: { 
          x: 42 * (index + 1), 
          y: 80 * (index + 1)
        },
        data: { 
          label: initialGraphNodes[nodeId].id, 
          category: initialGraphNodes[nodeId].category,
          service: initialGraphNodes[nodeId].id,
        } as IGraphNodeData,
      })
  );
  const initialEdges: Array<Edge> = Object.keys(initialGraphEdges).map(
    (edgeId: string) => ({
        id: edgeId,
        source: initialGraphEdges[edgeId].source,
        target: initialGraphEdges[edgeId].target,
        type: 'step'
      })
  );

  return (
    <div className="flex-1 bg-figmaBlack">
      <Graph
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
    </div>
  );
}

export default Diagram;
