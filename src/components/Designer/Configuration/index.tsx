import React, { ReactNode, useState } from 'react';
import 'react-resizable/css/styles.css';
import ConfigCard from './Card';
import { useAppSelector } from '@/redux/hooks';
import { getFocused } from '@/redux/designer/slice/graphSlice';

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
  const focused = useAppSelector(getFocused);

  if (!focused) {
    return;
  }

  const [[nodeId, schema]] = Object.entries(focused);

  return (
    <div className="w-full h-full flex flex-col justify-start">
      {/* Title */}
      <div className="w-full flex flex-row justify-start text-stratusPurple text-base border-b border-figmaBorder pb-1">
        <div className="w-2" />
        {schema.id}
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
          Object.keys(schema.config).sort().map((property: string) => {
            return (
              <ConfigCard 
                key={`${schema.id}-${property}`}
                title={schema.config[property].title}
                description={schema.config[property].hint}
                type={schema.config[property].type}
                value={schema.config[property].value}
                required={schema.config[property].required}
                onChange={(value: string | number | boolean) => console.log(value)}
              />
            )
          })
        }
      </TabContent>
      <TabContent isActive={DEPLOY === activeTab}>
        {
          Object.keys(schema.deploy).sort().map((property: string) => {
            return (
              <ConfigCard 
                key={`${schema.id}-${property}`}
                title={schema.deploy[property].title}
                description={schema.deploy[property].hint}
                type={schema.deploy[property].type}
                value={schema.deploy[property].value}
                required={schema.deploy[property].required}
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
