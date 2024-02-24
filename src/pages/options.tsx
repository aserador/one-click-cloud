import React, { useEffect, useState } from 'react';
import { ARCHITECTURES } from "../../templates/architectures";

interface Option {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  services: number[];
  edges: any[];
}

const ArchitectureOption: React.FC<{ option: Option }> = ({ option }) => (
  <div className={`flex flex-col bg-white shadow-md rounded p-6 m-4 ${option.services.includes(0) ? 'opacity-50' : ''}`}>
    <h2 className="text-2xl font-bold mb-2">{option.name}</h2>
    <p className="mb-4">{option.description}</p>
    <h3 className="text-xl font-semibold mb-2">Pros</h3>
    <ul className="mb-4">
      {option.pros.map((pro: string, index: number) => (
        <li key={index} className="list-disc list-inside">{pro}</li>
      ))}
    </ul>
    <h3 className="text-xl font-semibold mb-2">Cons</h3>
    <ul>
      {option.cons.map((con: string, index: number) => (
        <li key={index} className="list-disc list-inside">{con}</li>
      ))}
    </ul>
  </div>
);

interface ArchitectureOptionsProps {
  indices: number[];
}

const ArchitectureOptions: React.FC<ArchitectureOptionsProps> = ({ indices }) => {
    const [options, setOptions] = useState<Option[]>([]);
    console.log(indices)
  
    useEffect(() => {
      const architectureData = ARCHITECTURES as Option[]; 
  
      let newOptions: Option[] = [];
      if (indices) {
        newOptions = indices.reduce((acc: Option[], index: number) => {
          if (index < architectureData.length) {
            acc.push(architectureData[index]);
          }
          return acc;
        }, []);
      }
  
      setOptions(newOptions);
    }, [indices]);

  return (
    <div className="flex flex-wrap justify-around items-stretch">
      {options.map((option: Option, index: number) => (
        <ArchitectureOption key={index} option={option} />
      ))}
    </div>
  );
};

export default ArchitectureOptions;