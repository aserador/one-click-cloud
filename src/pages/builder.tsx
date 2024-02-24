import React from 'react';
import DescriptionBar from '../components/descriptionbar'; 

const SearchPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center min-w-full">
        <h1 className="text-6xl font-bold m-5 text-center text-white">
          Describe your project
        </h1>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col my-2 w-1/2 sm:w-2/3 md:w-1/2 lg:w-1/3">
          <DescriptionBar />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;