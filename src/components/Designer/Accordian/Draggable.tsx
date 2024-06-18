import React from 'react';

interface IDraggableProps {
  children: React.ReactNode;
}

function Draggable({ children }: IDraggableProps) {

  // Dragging a service from the sidebar to the graph
  const onDragStart = (event: any) => {
    // Hack to attach service data to drag event
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({})
    );

    // Mystery requirement required for by reactflow for drag and drop to work
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="dndnode"
      onDragStart={(event) => onDragStart(event)}
      draggable
    >
      {children}
    </div>
  );
}

export default Draggable;