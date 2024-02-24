import React from "react";
import Graph from "../components/Graph";
import PersistentDrawerRight from "../components/PersistentDrawerRight";
import StratusButton from "@/components/StratusButton";

const DiagramPage = () => {
  return (
    <div>
      <PersistentDrawerRight />
      <Graph />
      <StratusButton />
    </div>
  );
};

export default DiagramPage;
