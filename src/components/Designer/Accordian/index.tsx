import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Draggable from './Draggable';

interface ICategoryProps {
  category: string;
}

function CollapseTitle({ category }: ICategoryProps) {
  return (
    <div className="w-full h-full flex flex-row justify-start items-center ml-2">
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
      <Image
        priority
        className="ml-4"
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
  const [schema, setSchema] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const data = await import('../../../../schemas/aws/schema.json')
      setSchema(data)
    })()
  }, [])

  if (!schema) {
    return <div>Loading...</div>
  }

  const collapse_components = Object.keys(schema).map((category: string) => {
    return (
      <details className="collapse bg-transparent"> 
        <summary className="collapse-title">
          {(<CollapseTitle category={category} />)}
        </summary>
        <div className="collapse-content w-full flex flex-col justify-start pr-0"> 
          {
            Object.keys(schema[category]).map((service: string) => {
              return (
                <Draggable>
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