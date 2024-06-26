'use client';

import React from 'react';
import Image from 'next/image';
import Draggable from './Draggable';
import { IGraphDragData, NodeType } from '@/redux/designer/models';
import AWS_SCHEMAS from '@/schema/aws/schema';
import { useAppSelector } from '@/redux/hooks';
import { selectFilteredAwsServices } from '@/redux/designer/slice/accordianSlice';

import _ from 'lodash';

interface ICategoryProps {
  category: string;
}

function CollapseTitle({ category }: ICategoryProps) {
  return (
    <div className={`w-full h-full flex flex-row justify-start items-center`}>
      <div className="w-2" />
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
      <div className="w-4" />
      <Image
        src={`svg/aws/${category}/${service}.svg`}
        alt={`${service} icon`}
        width={24}
        height={24}
      />
      <span className="flex-1 flex flex-row justify-start items-center text-xs text-textWhite ml-2">
        {service}
      </span>
    </div>
  );
}

function Accordian() {
  const filteredAwsServices = useAppSelector(selectFilteredAwsServices);

  return (
    <div className="w-full h-full overflow-y-auto mt-2">
      {Object.keys(AWS_SCHEMAS)
        .sort()
        .map((category: string) => {
          if (
            filteredAwsServices !== null &&
            !(category in filteredAwsServices)
          ) {
            return;
          }
          return (
            <details
              key={category}
              className="collapse collapse-arrow bg-transparent"
              open={filteredAwsServices !== null}
            >
              <summary className="collapse-title">
                {<CollapseTitle category={category} />}
              </summary>
              <div className="collapse-content w-full flex flex-col justify-start pr-0">
                {Object.keys(AWS_SCHEMAS[category])
                  .sort()
                  .map((service: string) => {
                    if (
                      filteredAwsServices !== null &&
                      !filteredAwsServices?.[category]?.includes(service)
                    ) {
                      return;
                    }
                    const dragData: IGraphDragData = {
                      type: NodeType.ICON,
                      category,
                      service,
                    };
                    return (
                      <Draggable key={service} data={dragData}>
                        <CollapseItem category={category} service={service} />
                      </Draggable>
                    );
                  })}
              </div>
            </details>
          );
        })}
    </div>
  );
}

export default Accordian;
