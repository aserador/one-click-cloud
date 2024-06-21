import React from 'react';
import router from 'next/router';
import { ReactFlowProvider } from 'reactflow';
import DrawerLeft from '@/components/Designer/DrawerLeft';
import Toolbar from '@/components/Designer/Toolbar';
import Search from '@/components/Designer/Search';
import Accordian from '@/components/Designer/Accordian';
import Diagram from '@/components/Designer/Diagram';
import DrawerRight from '@/components/Designer/DrawerRight';
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
            <Search />
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