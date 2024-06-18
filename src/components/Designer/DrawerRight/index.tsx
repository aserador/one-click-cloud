import React, { ReactNode, useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { ChevronDoubleLeft, ChevronDoubleRight } from '../icons';
import 'react-resizable/css/styles.css';

interface DrawerRightProps {
  children?: ReactNode;
}

function DrawerRight({ children = null }: DrawerRightProps) {
  const [isOpen, setExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const justify = isOpen ? 'justify-start' : 'justify-around';

  useEffect(() => {
    const drawerRight = document.querySelector('.drawer-right');
    if (!drawerRight) {
      return;
    }
    const resizeHandle = drawerRight.querySelector('.react-resizable-handle-w');
    if (!resizeHandle) {
      return;
    }
    if (isDragging) {
      resizeHandle.classList.add('react-resizable-handle-w-dragging');
    } else {
      resizeHandle.classList.remove('react-resizable-handle-w-dragging');
    }
  }, [isDragging]);

  return (
    <ResizableBox
      className="drawer-right"
      width={isOpen ? 240 : 32}
      height={Infinity}
      minConstraints={[240, Infinity]}
      maxConstraints={[500, Infinity]}
      axis="x"
      resizeHandles={isOpen ? ['w'] : []}
      onResizeStart={() => setIsDragging(true)}
      onResizeStop={() => setIsDragging(false)}
    >
      <div className="h-full w-full flex flex-col bg-figmaGrey">
        <div className={`w-full flex flex-row ${justify}`}>
          <button
            type="button"
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5"
          >
            {isOpen ? <ChevronDoubleRight /> : <ChevronDoubleLeft />}
          </button>
        </div>
        <div className="w-full flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </ResizableBox>
  );
}

export default DrawerRight;
