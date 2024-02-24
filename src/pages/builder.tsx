import React, { useState, useEffect } from 'react';
import DescriptionBar from '../components/descriptionbar';
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

const BuildPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indices, setIndices] = useState<number[]>([]);
  const [options, setOptions] = useState<Option[]>([]);

  const handleSend = async () => {
    const response = await fetch('/api/gpthandler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: input }),
    });

    const data = await response.json();

    setOutput(JSON.stringify({ 
      archIndexes: data.archIndexes,
    }));

    setIndices(data.archIndexes);
  };

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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center min-w-full">
        <h1 className="text-6xl font-bold m-5 text-center text-white">
          Describe your project
        </h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2 w-1/2 sm:w-2/3 md:w-1/2 lg:w-1/3">
          <DescriptionBar input={input} setInput={setInput} handleSend={handleSend} />
        </div>
        <div className="mt-4 text-white">
          {output}
        </div>
        <div className="flex flex-wrap justify-around items-stretch">
          {options.map((option: Option, index: number) => (
            <ArchitectureOption key={index} option={option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildPage;