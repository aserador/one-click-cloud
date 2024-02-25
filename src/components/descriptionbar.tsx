import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

type DescriptionBarProps = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => Promise<void>;
};

const DescriptionBar: React.FC<DescriptionBarProps> = ({
  input,
  setInput,
  handleSend,
}) => {
  const maxLength = 100;

  return (
<div className="flex items-center justify-center">
  <div className="flex flex-col items-start w-full max-w-md">
    <div className="relative flex w-full">
      <input
        className="flex-grow px-4 py-2 text-white bg-transparent border-b border-white focus:outline-none"
        type="text"
        placeholder="eg. React.js with Tailwind"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        maxLength={maxLength}
      />
      <button
        onClick={handleSend}
        className="flex items-center justify-center w-12 text-lg text-white bg-transparent border-b border-white"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
    <p className="text-white">{`${input.length}/${maxLength}`}</p>
  </div>
</div>
  );
};

export default DescriptionBar;
