import { useRouter } from "next/router";
import Graph from "../components/Graph";
import PersistentDrawerRight from "../components/PersistentDrawerRight";
import StratusButton from "@/components/StratusButton";
import { store } from "@/redux/store";

const DiagramPage = () => {
  const router = useRouter();

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
          router.push("/download");
        }}
      />
    </div>
  );
};

export default DiagramPage;
