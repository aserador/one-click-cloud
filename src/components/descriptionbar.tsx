import React from 'react';

const DescriptionBar = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center w-full max-w-md">
        <input
          className="w-full h-6 pl-4 pr-10 rounded-xl text-lg focus:outline-none"
          type="text"
          placeholder="Describe your project here"
        />
      </div>
    </div>
  );
};

export default DescriptionBar;