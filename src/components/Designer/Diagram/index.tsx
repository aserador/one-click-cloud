import React from 'react';
import Graph from './Graph';

function Diagram() {
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
