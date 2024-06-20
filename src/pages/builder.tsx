import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DescriptionBar from '@/components/DescriptionBar';
import { AWS_TEMPLATES, IGraphBuilder } from '@/templates/aws';
import { useRouter } from 'next/router';
import { useAppDispatch } from '@/redux/hooks';
import {
  addGraphEdge,
  addGraphNode,
  reset,
} from '@/redux/designer/slice/graphSlice';
import { IAddGraphNode } from '@/redux/designer/payload';
import AWS_SCHEMAS from '@/schema/aws/schema';

interface Template {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  graphBuilder: () => IGraphBuilder;
}

interface ArchitectureOptionProps {
  template: Template;
  requestCount: number;
}

function ArchitectureOption({
  template,
  requestCount,
}: ArchitectureOptionProps) {
  const { graphNodes, graphEdges } = template.graphBuilder();
  const dispatch = useAppDispatch();
  const router = useRouter();

  function editTemplate() {
    dispatch(reset());
    for (const node of graphNodes) {
      dispatch(addGraphNode(node));
    }
    for (const edge of graphEdges) {
      dispatch(addGraphEdge(edge));
    }
    router.push('/designer');
  }

  const totalCost = graphNodes.reduce((cost: number, node: IAddGraphNode) => {
    const schema = AWS_SCHEMAS[node.category][node.service];
    return (
      cost + schema.cost.flat + (schema.cost['per-user'] * requestCount) / 100
    );
  }, 0);

  return (
    <div
      className={`relative flex flex-col text-white hover:border-purple-500 font-custom bg-blockgrey border border-bordergrey p-8 shadow-md rounded-3xl p-6 m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 transition duration-500 ease-in-out transform hover:shadow-purple-glow`}
    >
      <div className="mb-12" onClick={editTemplate}>
        <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
        <p className="mb-4">{template.description}</p>
        <ul className="mb-4 pl-4">
          {template.pros.map((pro: string, index: number) => (
            <li key={index} className="list-none text-green-500">
              <span className="mr-2">+</span>
              {pro}
            </li>
          ))}
        </ul>
        <ul className="mb-6 pl-4">
          {template.cons.map((con: string, index: number) => (
            <li key={index} className="list-none text-red-500">
              <span className="mr-2">-</span>
              {con}
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-0 right-0 mb-4 mr-4 w-24 text-center bg-white rounded-full p-2">
        <p className="text-black">${totalCost.toFixed(2)}</p>
      </div>
    </div>
  );
}

const BuildPage = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [userCount, setUserCount] = useState(0);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gpthandler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: input }),
      });

      const data = await response.json();
      console.log(data);
      if (data.using_react && !data.using_backend) {
        setShowRecommendations(true);
      } else {
        toast.error(
          'Your stack is currently unsupported. As of now, we only support static sites like React and plain HTML/CSS.'
        );
      }
    } finally {
      setShowRecommendations(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center min-w-full">
        {isLoading ? (
          <span className="loading loading-spinner loading-xs text-spurple" />
        ) : showRecommendations ? (
          <div className="fade-in">
            <h1 className="text-6xl font-custom m-5 text-center text-white">
              Our Recommendations
            </h1>
            <div className="flex flex-row justify-center flex-wrap">
              {Object.keys(AWS_TEMPLATES)
                .sort()
                .map((key: string) => (
                  <ArchitectureOption
                    key={key}
                    template={AWS_TEMPLATES[key]}
                    requestCount={userCount}
                  />
                ))}
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
            <div className="mt-4" />
          </>
        )}
      </div>
    </div>
  );
};

export default BuildPage;
