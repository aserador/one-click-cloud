import React, { useState } from 'react';
import Image from 'next/image';
import { Handle, HandleType, NodeProps, Position } from 'reactflow';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getFocusedNodeId,
  setFocusedNodeId,
} from '@/redux/designer/slice/graphSlice';
import { IGraphNodeData } from '@/redux/designer/models';

interface IFancyHandleProps {
  id: string;
  position: Position;
  handleType: HandleType;
  isHidden: boolean;
}

function FancyHandle({
  id,
  position,
  handleType,
  isHidden,
}: IFancyHandleProps) {
  const hiddenStyle = isHidden ? 'opacity-0' : '';
  return (
    <Handle
      className={hiddenStyle}
      type={handleType}
      position={position}
      id={id}
    />
  );
}

export function IconNode({ id, data }: NodeProps<IGraphNodeData>) {
  const [hideHandles, setHideHandles] = useState(true);

  const dispatch = useAppDispatch();
  const focusedNodeId = useAppSelector(getFocusedNodeId);
  const onClick = () => focusedNodeId !== id && dispatch(setFocusedNodeId(id));

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHideHandles(false)}
      onMouseLeave={() => setHideHandles(true)}
    >
      <div className='p-1'>
        <Image
          src={`svg/aws/${data.category}/${data.service}.svg`}
          alt={`${data.service} icon`}
          width={24}
          height={24}
        />
      </div>
      <FancyHandle
        handleType="target"
        position={Position.Left}
        id="left"
        isHidden={hideHandles}
      />
      <FancyHandle
        handleType="target"
        position={Position.Bottom}
        id="bottom"
        isHidden={hideHandles}
      />
      <FancyHandle
        handleType="source"
        position={Position.Right}
        id="right"
        isHidden={hideHandles}
      />
      <FancyHandle
        handleType="source"
        position={Position.Top}
        id="top"
        isHidden={hideHandles}
      />
    </div>
  );
}
