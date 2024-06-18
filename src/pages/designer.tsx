import React from 'react';

import { ReactFlowProvider } from 'reactflow';

import DrawerLeft from '@/components/Designer/DrawerLeft';
import DrawerRight from '@/components/Designer/DrawerRight';
import Toolbar from '@/components/Designer/Toolbar';
import Diagram from '@/components/Designer/Diagram';
import Accordian from '@/components/Designer/Accordian';

function Designer() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Toolbar />
      <div className="w-full flex-1 flex flex-row">
        <ReactFlowProvider>
          <DrawerLeft title="Find cloud services">
            <div className="w-full flex flex-row justify-start mt-1">
              <input 
                type="text"
                className="input input-bordered input-xs w-11/12 w-xs bg-transparent rounded-sm ml-2 italic"
                placeholder="Starting with..."
              />
            </div>
            <Accordian />
          </DrawerLeft>
          <Diagram />
        </ReactFlowProvider>
        <DrawerRight />
      </div>
    </div>
  );
}

export default Designer;