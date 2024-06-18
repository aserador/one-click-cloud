import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import Image from 'next/image';
import { store } from '@/redux/store';
import { setFocus } from '@/redux/focusSlice';
import { ISchema } from '@/redux/models';

export function IconNode({ data }: NodeProps) {
  const onClick = () => {
    store.dispatch(
      setFocus(
        {
          id: data.metadata.service,
          continuous_deployment: data.continuous_deployment,
          cost: data.cost,
          enabled: data.enabled,
          schema: data.schema,
        } as ISchema
      )
    );
  }
  return (
    <div onClick={onClick}>
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
    </div>
  );
}
