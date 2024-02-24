import React, { useState } from 'react';
import DescriptionBar from '../components/descriptionbar'; 

const BuildPage = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

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
      serviceIndexChosen: data.serviceIndexChosen, 
      shortExplanationWhy: data.shortExplanationWhy 
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center min-w-full">
        <h1 className="text-6xl font-bold m-5 text-center">
          Describe your project
        </h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2 w-1/2 sm:w-2/3 md:w-1/2 lg:w-1/3">
          <DescriptionBar input={input} setInput={setInput} handleSend={handleSend} />
          <div className="mt-4">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPage;