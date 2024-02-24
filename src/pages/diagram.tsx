import Graph from "../components/Graph";
import PersistentDrawerRight from "../components/PersistentDrawerRight";
import StratusButton from "@/components/StratusButton";
import { store } from "@/redux/store";

const DiagramPage = () => {
  return (
    <div>
      <PersistentDrawerRight />
      <Graph />
      <StratusButton
        onClick={() => {
          sessionStorage.setItem(
            "graph",
            JSON.stringify(
              store
                .getState()
                .persistentDrawerRight.AWSServices.filter((s) => !s?.disabled)
            )
          );
        }}
      />
    </div>
  );
};

export default DiagramPage;
