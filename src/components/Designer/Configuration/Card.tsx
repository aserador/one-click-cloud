import React from "react";

interface ICardProps {
  title: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  value: string | number | boolean;
  required: boolean;
  onChange: (value: string | number | boolean) => void;
}

function ConfigCard({ title, description, type, value, required, onChange}: ICardProps) {
  let InputComponent = null;
  switch (type) {
    case 'string':
      InputComponent = (
        <input 
          type="text"
          className="input input-bordered input-xs flex-1 w-xs bg-transparent rounded-sm ml-2"
          placeholder={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'number':
      InputComponent = (
        <input 
          type="number"
          className="input input-bordered input-xs flex-1 w-xs bg-transparent rounded-sm ml-2"
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case 'boolean':
      InputComponent = (
        <label className="cursor-pointer label ml-2 px-0">
          <span className="label-text text-xs mr-2 text-textWhite">False</span> 
          <input 
            type="checkbox" 
            className="toggle toggle-sm toggle-secondary" 
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="label-text text-xs ml-2 text-textWhite">True</span> 
        </label>
      );
      break;
  }
  return (
    <div className="w-full flex flex-col justify-start items-center border-b border-figmaBorder py-2">
      <div className="w-full flex flex-row justify-start items-center py-2">
        <div className="w-2"/>
        <span className="text-xs text-white ml-2">{title}</span>
      </div>
      <div className="w-full flex flex-row justify-start items-center pb-2">
        <div className="w-2"/>
        <span className="text-xs text-textGrey ml-2">{description}</span>
      </div>
      <div className="w-full flex flex-row justify-start items-center pb-2">
        <div className="w-2"/>
        {InputComponent}
        <div className="w-4"/>
      </div>
    </div>
  )
}

export default ConfigCard;