import React from 'react';
import { IGraphDragData } from '@/redux/designer/models';

interface IDraggableProps {
  children: React.ReactNode;
  data: IGraphDragData;
}

function Draggable({ children, data }: IDraggableProps) {

  const onDragStart = (event: any) => {
    // Attach service data to drag event
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(data)
    );
    // Mystery requirement required for by reactflow for drag and drop to work
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-full h-full tooltip"  data-tip="Drag Me">
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event)}
        draggable
      >
        {children}
      </div>
    </div>
  );
}

export default Draggable;
