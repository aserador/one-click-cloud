import React from 'react';

interface IDraggableProps {
  children: React.ReactNode;
  data: object;
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