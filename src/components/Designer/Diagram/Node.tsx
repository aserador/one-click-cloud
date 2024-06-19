import React from 'react';
import Image from 'next/image';
import { Handle, NodeProps, Position } from 'reactflow';
import { useAppDispatch } from '@/redux/hooks';
import { INodeId } from '@/redux/designer/payload';
import { setFocused } from '@/redux/designer/slice/graphSlice';
import { IGraphNodeData } from '@/redux/designer/models';

export function IconNode({ id, data }: NodeProps<IGraphNodeData>) {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(setFocused({nodeId: id} as INodeId));
  }

  return (
    <div onClick={onClick}>
      <Handle type="target" position={Position.Top} />
      <div>
        <Image
          priority
          loading="eager"
          src={`svg/aws/${data.category}/${data.service}.svg`}
          alt={`${data.service} icon`}
          width={24}
          height={24}
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
