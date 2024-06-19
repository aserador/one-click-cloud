import React, { ReactNode, useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { ChevronDoubleLeft, ChevronDoubleRight } from '../icons';
import 'react-resizable/css/styles.css';

interface DrawerLeftProps {
  title: string;
  children?: ReactNode;
}

function DrawerLeft({ title, children = null }: DrawerLeftProps) {
  const [isOpen, setExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const justify = isOpen ? 'justify-end' : 'justify-around';

  useEffect(() => {
    const drawerLeft = document.querySelector('.drawer-left');
    if (!drawerLeft) {
      return;
    }
    const resizeHandle = drawerLeft.querySelector('.react-resizable-handle-e');
    if (!resizeHandle) {
      return;
    }
    if (isDragging) {
      resizeHandle.classList.add('react-resizable-handle-e-dragging');
    } else {
      resizeHandle.classList.remove('react-resizable-handle-e-dragging');
    }
  }, [isDragging]);

  return (
    <ResizableBox
      className="drawer-left"
      width={isOpen ? 240 : 32}
      height={Infinity}
      minConstraints={[240, Infinity]}
      maxConstraints={[500, Infinity]}
      axis="x"
      resizeHandles={isOpen ? ['e'] : []}
      onResizeStart={() => setIsDragging(true)}
      onResizeStop={() => setIsDragging(false)}
    >
      <div className="h-full w-full flex flex-col bg-figmaGrey">
        <div className={`w-full flex flex-row ${justify}`}>
          {isOpen && (
            <div className="flex flex-col justify-center items-center text-xs text-textWhite ml-2">
              {title}
            </div>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5"
          >
            {isOpen ? <ChevronDoubleLeft /> : <ChevronDoubleRight />}
          </button>
        </div>
        <div className="w-full flex flex-col flex-auto overflow-y-auto">
          {isOpen && children}
        </div>
      </div>
    </ResizableBox>
  );
}

export default DrawerLeft;
