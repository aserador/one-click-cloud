import React from "react";
import Graph from "../components/Graph";
import PersistentDrawerRight from "../components/PersistentDrawerRight";

const DiagramPage = () => {
  return (
    <div>
      <PersistentDrawerRight />
      <Graph />
    </div>
  );
};

export default DiagramPage;
