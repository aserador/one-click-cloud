import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

type DescriptionBarProps = {
  input: any;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => Promise<void>;
};

const DescriptionBar: React.FC<DescriptionBarProps> = ({ input, setInput, handleSend }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center w-full max-w-md">
        <div className="relative flex w-full rounded-lg overflow-hidden">
          <input
            className="flex-grow pl-4 text-lg focus:outline-none"
            type="text"
            placeholder="Describe..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="flex items-center justify-center w-12 text-lg"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionBar;