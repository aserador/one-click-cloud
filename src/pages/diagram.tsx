import React from "react";
import Graph from "../components/Graph";
import PersistentDrawerRight from "../components/PersistentDrawerRight";

const DiagramPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center min-w-full">
        <PersistentDrawerRight />
        <Graph />
      </div>
    </div>
  );
};

export default DiagramPage;
