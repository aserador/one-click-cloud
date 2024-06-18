import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import Image from 'next/image';

export function IconNode({ id, data }: NodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div>
        <Image
          priority
          loading="eager"
          src={`svg/aws/${data.metadata.category}/${data.metadata.service}.svg`}
          alt={`${data.service} icon`}
          width={24}
          height={24}
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
