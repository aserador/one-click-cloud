import React from 'react';
import Image from 'next/image';
import Draggable from './Draggable';
import { IGraphDragData, NodeType } from '@/redux/designer/models';
import AWS_SCHEMA_TEMPLATES from '@/schema/aws/schema';
import _ from 'lodash';

interface ICategoryProps {
  category: string;
}

function CollapseTitle({ category }: ICategoryProps) {
  return (
    <div className="w-full h-full flex flex-row justify-start items-center">
      <div className="w-2"/>
      <Image
        priority
        src={`svg/aws/${category}.svg`}
        alt={`${category} icon`}
        width={24}
        height={24}
      />
      <span className="text-xs text-textWhite ml-2">{category}</span>
    </div>
  );
}

interface ICollapseItemProps {
  category: string;
  service: string;
}

function CollapseItem({ category, service }: ICollapseItemProps) {
  return (
    <div className="collapse-item w-full h-full flex flex-row justify-start items-center">
      <div className="w-4"/>
      <Image
        priority
        loading="eager"
        src={`svg/aws/${category}/${service}.svg`}
        alt={`${service} icon`}
        width={24}
        height={24}
      />
      <span className="flex-1 flex flex-row justify-start items-center text-xs text-textWhite ml-2">{service}</span>
    </div>
  );
}

function Accordian() {
  const collapse_components = Object.keys(AWS_SCHEMA_TEMPLATES).map((category: string) => {
    return (
      <details key={category} className="collapse collapse-arrow bg-transparent"> 
        <summary className="collapse-title">
          {(<CollapseTitle category={category} />)}
        </summary>
        <div className="collapse-content w-full flex flex-col justify-start pr-0"> 
          {
            Object.keys(AWS_SCHEMA_TEMPLATES[category]).map((service: string) => {
              const dragData: IGraphDragData = { type: NodeType.ICON, category, service };
              return (
                <Draggable key={service} data={dragData}>
                  <CollapseItem category={category} service={service} />
                </Draggable>
              )
            })
          }
        </div>
      </details>
    );
  })

  return (
    <div className="w-full h-full overflow-y-auto mt-2">
      {collapse_components}
    </div>
  );
}

export default Accordian;