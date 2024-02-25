import React, { useState, useEffect } from "react";
import DescriptionBar from "../components/descriptionbar";
import { ARCHITECTURES } from "../../templates/architectures";
import { AWS_SERVICES } from "../../templates/aws_services";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  requestCount: number;
}

const ArchitectureOption: React.FC<ArchitectureOptionProps> = ({
  index,
  option,
  isDisabled,
  requestCount: requestCount,
}) => {
  const totalCost = option.services.reduce((cost, serviceIndex) => {
    const service = AWS_SERVICES[serviceIndex];
    return cost + service.cost.flat + ((service.cost["per-user"] * requestCount) / 100);
  }, 0);

  return (
    <div
    className={`relative flex flex-col text-white hover:border-purple-500 font-custom bg-blockgrey border border-bordergrey p-8 shadow-md rounded-3xl p-6 m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ${
      isDisabled ? "opacity-50" : ""
    } transition duration-500 ease-in-out transform hover:shadow-purple-glow`}
  >
    <Link href={`/diagram?option=${index}`} className="mb-12">
      <h2 className="text-2xl font-bold mb-2">{option.name}</h2>
      <p className="mb-4">{option.description}</p>
      <ul className="mb-4 pl-4">
        {option.pros.map((pro: string, index: number) => (
          <li key={index} className="list-none text-green-500">
            <span className="mr-2">+</span>
            {pro}
          </li>
        ))}
      </ul>
      <ul className="mb-6 pl-4">
        {option.cons.map((con: string, index: number) => (
          <li key={index} className="list-none text-red-500">
            <span className="mr-2">-</span>
            {con}
          </li>
        ))}
      </ul>
    </Link>
    <div className="absolute bottom-0 right-0 mb-4 mr-4 w-24 text-center bg-white rounded-full p-2">
  <p className="text-black">${totalCost.toFixed(2)}</p>
</div>
  </div>
  );
};

const BuildPage = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [indices, setIndices] = useState<number[]>([]);
  const [userCount, setUserCount] = useState(0);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gpthandler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await response.json();
      console.log(data);
      if (data.using_react && !data.using_backend) {
        setShowRecommendations(true);
      } else {
        toast.error(
          "Your stack is currently unsupported. As of now, we only support static sites like React and plain HTML/CSS."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showRecommendations) {
      const architectureData = ARCHITECTURES as Option[];

      let newOptions: Option[] = architectureData.map((option, index) => ({
        ...option,
        index,
      }));

      setOptions(newOptions);
      setIndices(architectureData.map((_, index) => index));
    }
  }, [showRecommendations]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center min-w-full">
        {isLoading ? (
            <CircularProgress className="text-spurple" />
        ) : showRecommendations ? (
          <div className="fade-in">
            <h1 className="text-6xl font-custom m-5 text-center text-white">
              Our Recommendations
            </h1>
            <div className="flex flex-row justify-center flex-wrap">
              {options.map((option: Option, index: number) => {
                const isDisabled = option.services.some(
                  (serviceIndex) => AWS_SERVICES[serviceIndex].disabled
                );
                return (
                  <ArchitectureOption
                    key={indices[index]}
                    index={indices[index]}
                    option={option}
                    isDisabled={isDisabled}
                    requestCount={userCount}
                  />
                );
              })}
            </div>
            <div className="fixed bottom-0 right-0 p-4">
              <p className="text-white font-custom text-xl mr-2">
                Estimated Requests:
              </p>
              <input
                type="text"
                className="text-white text-xl bg-transparent border-b border-white focus:outline-none"
                value={userCount}
                onChange={(e) => setUserCount(Number(e.target.value))}
                placeholder="Enter number of requests"
              />
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-6xl font-custom m-5 text-center text-white">
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
          </>
        )}
      </div>
    </div>
  );
};

export default BuildPage;
