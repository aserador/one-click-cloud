import React from 'react';
import Image from 'next/image';
import { Handle, NodeProps, Position } from 'reactflow';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getFocusedNodeId, setFocusedNodeId } from '@/redux/designer/slice/graphSlice';
import { IGraphNodeData } from '@/redux/designer/models';

export function IconNode({ id, data }: NodeProps<IGraphNodeData>) {
  const dispatch = useAppDispatch();
  const focusedNodeId = useAppSelector(getFocusedNodeId);
  const onClick = () => focusedNodeId !== id && dispatch(setFocusedNodeId(id));

  return (
    <div onClick={onClick}>
      <Handle 
        type="target" 
        position={Position.Top}
      />
      <div>
        <Image
          src={`svg/aws/${data.category}/${data.service}.svg`}
          alt={`${data.service} icon`}
          width={24}
          height={24}
        />
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="a" 
      />
    </div>
  );
}
