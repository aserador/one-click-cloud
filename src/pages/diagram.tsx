import Graph from "../components/Graph";
import PersistentDrawerRight from "../components/PersistentDrawerRight";
import StratusButton from "@/components/StratusButton";
import { store } from "@/redux/store";
import { useRouter } from "next/router";
import { ARCHITECTURES } from "../../templates/architectures";
import { useEffect, useState } from "react";

const DiagramPage = () => {
  const router = useRouter();

  const [filter, setFilter] = useState<number[]>([]);

  useEffect(() => {
    const option = router.query.option;

    if (option !== undefined && option !== null) {
      setFilter(ARCHITECTURES[Number(option)].services);
    }
  }, [router.query.option]);

  return (
    <div>
      <PersistentDrawerRight />
      <Graph filter={filter} />
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
