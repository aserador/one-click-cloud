import React from 'react';
import router from 'next/router';
import { ReactFlowProvider } from 'reactflow';
import DrawerLeft from '@/components/Designer/DrawerLeft';
import DrawerRight from '@/components/Designer/DrawerRight';
import Toolbar from '@/components/Designer/Toolbar';
import Diagram from '@/components/Designer/Diagram';
import Accordian from '@/components/Designer/Accordian';
import Configuration from '@/components/Designer/Configuration';

function Designer() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <ReactFlowProvider>
        <Toolbar 
          onSubmit={() => router.push("/download")}
        />
        <div className="w-full flex-1 flex flex-row">
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
          <DrawerRight>
            <Configuration />
          </DrawerRight>
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default Designer;