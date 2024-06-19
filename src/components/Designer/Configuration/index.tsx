import { getSchema } from '@/redux/focusSlice';
import { ISchema } from '@/redux/models';
import React, { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import 'react-resizable/css/styles.css';
import ConfigCard from './Card';

const CONFIG = 'Config';
const DEPLOY = 'Deploy';

interface TabProps {
  isActive: boolean;
  title: string;
  onClick: () => void;
}

function Tab({ isActive, title, onClick}: TabProps) {
  return (
    <div className="w-15 h-10 flex justify-center items-center cursor-pointer" onClick={onClick}>
      <span className={`text-xs ${isActive ? 'text-white' : 'text-textGrey'}`}>{title}</span>
    </div>
  )
}

interface TabContentProps {
  isActive: boolean;
  children: ReactNode;
}

function TabContent({ isActive, children }: TabContentProps) {
  return (
    <div className={`w-full flex-auto flex flex-col overflow-y-auto ${isActive ? '' : 'hidden'}`}>
      {children}
    </div>
  );
}

function Configuration() {
  const [activeTab, setActiveTab] = useState<string>(CONFIG);
  const focused: ISchema | null = useSelector(getSchema);

  if (!focused) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col justify-start">
      {/* Title */}
      <div className="w-full flex flex-row justify-start text-stratusPurple text-base border-b border-figmaBorder pb-1">
        <div className="w-2" />
        {focused?.id}
      </div>
      {/* Tab Headers */}
      <div className="w-full flex flex-row justify-start border-b border-figmaBorder">
        <div className="w-2" />
        <Tab isActive={CONFIG === activeTab} title={CONFIG} onClick={() => setActiveTab(CONFIG)} />
        <div className="w-4" />
        <Tab isActive={DEPLOY === activeTab} title={DEPLOY} onClick={() => setActiveTab(DEPLOY)}/>
      </div>
      {/* Tab Content */}
      <TabContent isActive={CONFIG === activeTab}>
        {
          Object.keys(focused?.schema).sort().map((property: string) => {
            return (
              <ConfigCard 
                key={`${focused.id}-${property}`}
                title={focused.schema[property].title}
                description={focused.schema[property].hint}
                type={focused.schema[property].type}
                value={focused.schema[property].value}
                required={focused.schema[property].required}
                onChange={(value: string | number | boolean) => console.log(value)}
              />
            )
          })
        }
      </TabContent>
      <TabContent isActive={DEPLOY === activeTab}>
        {
          Object.keys(focused?.continuous_deployment).sort().map((property: string) => {
            console.log(focused.continuous_deployment[property])
            return (
              <ConfigCard 
                key={`${focused.id}-${property}`}
                title={focused.continuous_deployment[property].title}
                description={focused.continuous_deployment[property].hint}
                type={focused.continuous_deployment[property].type}
                value={focused.continuous_deployment[property].value}
                required={focused.continuous_deployment[property].required}
                onChange={(value: string | number | boolean) => console.log(value)}
              />
            )
          })
        }
      </TabContent>
    </div>
  );
}

export default Configuration;
