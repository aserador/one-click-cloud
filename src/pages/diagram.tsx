import Graph from "../components/Graph";
import PersistentDrawerRight from "../components/PersistentDrawerRight";
import StratusButton from "@/components/StratusButton";
import { store } from "@/redux/store";
import { useRouter } from "next/router";
import { ARCHITECTURES } from "../../templates/architectures";
import { useEffect } from 'react';
import { setAwsServiceFilter } from "@/redux/persistentDrawerRightSlice";

const DiagramPage = () => {
  const router = useRouter();

  useEffect(() => {
    const option = router.query.option;
    if (option) {
      store.dispatch(setAwsServiceFilter({AWSServiceFilter: ARCHITECTURES[Number(option)].services}))
    }
  }, [router.query]);

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
