import React, { useState, useEffect } from "react";
import DescriptionBar from "../components/descriptionbar";
import { ARCHITECTURES } from "../../templates/architectures";
import { SERVICES } from "../../templates/services";
import Link from "next/link";

interface Option {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  services: number[];
  edges: any[];
}

interface ArchitectureOptionProps {
  index: number;
  option: Option;
  isDisabled: boolean;
}

const ArchitectureOption: React.FC<ArchitectureOptionProps> = ({
  index,
  option,
  isDisabled,
}) => (
  <div 
    className={`flex flex-col bg-white shadow-md rounded p-6 m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${isDisabled ? "opacity-50" : ""}`}
  >
    <Link href={`/diagram?option=${index}`}>
        <h2 className="text-2xl font-bold mb-2">{option.name}</h2>
        <p className="mb-4">{option.description}</p>
        <h3 className="text-xl font-semibold mb-2">Pros</h3>
        <ul className="mb-4">
          {option.pros.map((pro: string, index: number) => (
            <li key={index} className="list-disc list-inside">
              {pro}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-semibold mb-2">Cons</h3>
        <ul>
          {option.cons.map((con: string, index: number) => (
            <li key={index} className="list-disc list-inside">
              {con}
            </li>
          ))}
        </ul>
    </Link>
  </div>
);

const BuildPage = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indices, setIndices] = useState<number[]>([]);
  const [options, setOptions] = useState<Option[]>([]);

  const handleSend = async () => {
    const response = await fetch("/api/gpthandler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: input }),
    });

    const data = await response.json();

    setOutput(
      JSON.stringify({
        archIndexes: data.archIndexes,
      })
    );

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
        What's your tech stack?
      </h1>
      <div className="flex flex-col my-2 w-full sm:w-full md:w-full lg:w-full">
  <DescriptionBar
    input={input}
    setInput={setInput}
    handleSend={handleSend}
  />
</div>
      <div className="mt-4 text-white">{output}</div>
      <div className="flex flex-row justify-center flex-wrap">
        {options.map((option: Option, index: number) => {
          const isDisabled = option.services.some(
            (serviceIndex) => SERVICES[serviceIndex].disabled
          );
          return (
            <ArchitectureOption
              key={indices[index]}
              index={indices[index]}
              option={option}
              isDisabled={isDisabled}
            />
          );
        })}
      </div>
    </div>
  </div>
);
      };
export default BuildPage;
