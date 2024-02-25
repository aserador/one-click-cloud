import React, { useState, useEffect } from "react";
import DescriptionBar from "../components/descriptionbar";

import Link from "next/link";


const BuildPage = () => {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const response = await fetch("/api/gpthandler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: input }),
    });

    const data = await response.json();
    console.log(data);
    if (!data.using_react || data.using_backend) {
      alert("Your stack is currently unsupported. As of now, we only support static sites like React and plain HTML/CSS.");
    } else {
      alert("Your stack is supported!");
    }
  };

  
return (
  <div className="flex flex-col items-center justify-center min-h-screen py-2">
    <div className="flex flex-col items-center justify-center min-w-full">
      <h1 className="text-6xl font-bold m-5 text-center text-white">
        Describe your project
      </h1>

          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2 w-1/2 sm:w-2/3 md:w-1/2 lg:w-1/3">
            <DescriptionBar
              input={input}
              setInput={setInput}
              handleSend={handleSend}
            />
          </div>

    
      
    </div>
  </div>
);
      };
export default BuildPage;
