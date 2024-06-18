import { getSchema } from '@/redux/focusSlice';
import { ISchema } from '@/redux/models';
import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';

const CONFIG = 'Config';
const DEPLOY = 'Deploy';

interface TabPanelProps {
  children?: ReactNode;
}

function TabPanel({ children }: TabPanelProps) {
  return <div role="tabpanel" className="tab-content w-full h-full pl-2 border-t border-figmaBorder overflow-y-auto">{children}</div>
}

function Configuration() {

  const [activeTab, setActiveTab] = useState<string>(CONFIG);
  const focused: ISchema | null = useSelector(getSchema);

  if (!focused) {
    return null;
  }
  
  const configurationTabActive = activeTab === CONFIG;
  const continuousDeploymentTabActive = activeTab === DEPLOY;

  return (
    <div className="w-full h-full flex flex-col justify-start">
      {/* Title */}
      <div className="w-full flex flex-row justify-start text-stratusPurple text-base border-b border-figmaBorder pb-1">
        <div className="w-2" />
        {focused?.id}
      </div>
      {/* Tab Headers */}
      <div role="tablist" className="tabs w-full">
        <input 
          type="radio" 
          name="my_tabs_1" 
          role="tab" 
          className={`tab configuration w-10 px-2 text-xs ${configurationTabActive ? 'text-white' : 'text-textGrey'}`} 
          aria-label="Config" 
          checked={configurationTabActive}
          onChange={(e) => e.target.checked ? setActiveTab(CONFIG) : setActiveTab(DEPLOY)}
        />
        <TabPanel>Tab content 1</TabPanel>
        <input 
          type="radio" 
          name="my_tabs_1" 
          role="tab" 
          className={`tab continuous_deployment w-10 px-2 text-xs ${continuousDeploymentTabActive ? 'text-white' : 'text-textGrey'}`}  
          aria-label="Deploy" 
          checked={continuousDeploymentTabActive}
          onChange={(e) => e.target.checked ? setActiveTab(DEPLOY) : setActiveTab(CONFIG)}
        />
        <TabPanel>Tab content 2</TabPanel>
      </div>
    </div>
  );
}

export default Configuration;
