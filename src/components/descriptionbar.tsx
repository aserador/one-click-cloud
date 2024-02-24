import React from 'react';

const DescriptionBar = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex items-center justify-center w-full max-w-md">
        <input
          className="w-full h-12 pl-4 pr-10 py-2 rounded-full text-lg focus:outline-none"
          type="text"
          placeholder="Describe your project here"
        />
      </div>
    </div>
  );
};

export default DescriptionBar;