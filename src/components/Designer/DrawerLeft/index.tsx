import React, { ReactNode, useEffect, useState } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

function ChevronDoubleLeft() {
  return (
    <svg
      className="h-4 w-4 text-textGrey hover:text-textWhite"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.3639 7.75735L16.9497 6.34314L11.2929 12L16.9497 17.6568L18.3639 16.2426L14.1213 12L18.3639 7.75735Z"
        fill="currentColor"
      />
      <path
        d="M11.2929 6.34314L12.7071 7.75735L8.46447 12L12.7071 16.2426L11.2929 17.6568L5.63605 12L11.2929 6.34314Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronDoubleRight() {
  return (
    <svg
      className="h-4 w-4 text-textGrey hover:text-textWhite"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.63605 7.75735L7.05026 6.34314L12.7071 12L7.05029 17.6568L5.63608 16.2426L9.87869 12L5.63605 7.75735Z"
        fill="currentColor"
      />
      <path
        d="M12.7071 6.34314L11.2929 7.75735L15.5356 12L11.2929 16.2426L12.7072 17.6568L18.364 12L12.7071 6.34314Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
            <div className="h-full flex flex-col justify-center items-center text-xs text-textWhite ml-2">
              {title}
            </div>
          )}
          <div className="flex-1"></div>
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
