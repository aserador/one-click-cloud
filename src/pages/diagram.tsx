import Graph from "../components/Graph";
import PersistentDrawerRight from "../components/PersistentDrawerRight";
import StratusButton from "@/components/StratusButton";
import { store } from "@/redux/store";
import { useRouter } from "next/router";
import { ARCHITECTURES } from "../../templates/architectures";
import { useEffect, useState } from "react";
import { Divider, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import StratusCheckbox from "@/components/StratusCheckbox";
import {
  getAwsServices,
  getDrawerMode,
  getFocusedNode,
  getGraphServices,
  setAwsServiceProperty,
  setGraphEdges,
  setGraphServices,
} from "@/redux/persistentDrawerRightSlice";
import StratusTextField from "@/components/StratusTextField";
import _ from "lodash";

const DiagramPage = () => {
  const [localGraphServices, setLocalGraphServices] = useState([] as any[]);
  const [localGraphEdges, setLocalGraphEdges] = useState([] as any[]);

  const router = useRouter();
  const focusedNode = useSelector(getFocusedNode);
  const focusedNodeCopy = _.cloneDeep(focusedNode);
  const awsServices = useSelector(getAwsServices);
  const graphServices = useSelector(getGraphServices);
  const drawerMode = useSelector(getDrawerMode);

  useEffect(() => {
    const option = router.query.option;

    if (option !== undefined && option !== null) {
      const initialServices = awsServices.filter(
        (s) => !s?.disabled && s?.id in ARCHITECTURES[Number(option)].services
      );
      store.dispatch(
        setGraphServices({
          graphServices: initialServices,
        })
      );
      setLocalGraphServices(initialServices);

      const initialGraphEdges = ARCHITECTURES[Number(option)].edges;
      store.dispatch(setGraphEdges({ graphEdges: initialGraphEdges }));
      setLocalGraphEdges(initialGraphEdges);
    }
  }, [router.query.option]);

  const settings: JSX.Element[] = [];
  if (focusedNode?.settings) {
    for (const [name, metadata] of Object.entries(focusedNodeCopy.settings)) {
      if ((metadata as any)?.type == "boolean") {
        settings.push(
          <StratusCheckbox
            key={`key-focused_node-${focusedNode?.id}-setting-${name}`}
            property={name}
            value={(metadata as any)?.value}
            onChange={(e) => {
              focusedNodeCopy.settings[name].value =
                !focusedNodeCopy.settings[name].value;
              store.dispatch(
                setAwsServiceProperty({
                  focusedNode: focusedNodeCopy,
                })
              );
            }}
          />
        );
      }
    }
  }

  const questions: JSX.Element[] = [];
  if (focusedNode?.questions) {
    for (const q of focusedNode.questions) {
      if ((q as any)?.type == "input") {
        questions.push(
          <StratusTextField
            key={`key-focused_node-${focusedNode?.id}-question-${q?.id}`}
            id={`focused_node-${focusedNode?.id}-question-${q?.id}`}
            label={q?.question}
            defaultValue={q?.value}
            helperText={q?.note}
            variant={"filled"}
            onChange={(e) => {
              focusedNodeCopy.questions[q.id].value = e.target.value;
              store.dispatch(
                setAwsServiceProperty({
                  focusedNode: focusedNodeCopy,
                })
              );
            }}
          />
        );
      }
    }
  }

  return (
    <div>
      <PersistentDrawerRight
        children={
          drawerMode === "Add Service" ? (
            <>
              <Divider />
              {graphServices.map((awsService, index) => {
                return (
                  <StratusButton
                    key={`key-aws-service-${awsService.id}`}
                    classStyles="m-2"
                    onClick={() => {
                      alert("Add " + awsService.name);
                    }}
                  />
                );
              })}
            </>
          ) : (
            <>
              <div className="p-4">
                <Typography variant="h4">
                  {focusedNode?.name ?? "[None]"}
                </Typography>
                <Divider />
                <div className="pt-4">
                  <Typography variant="body1">
                    {focusedNode?.description ?? "[None]"}
                  </Typography>
                </div>
              </div>
              <Divider />
              {questions}
              <Divider />
              {settings}
            </>
          )
        }
      />
      <Graph initialServices={localGraphServices} initialEdges={localGraphEdges}/>
      <StratusButton
        classStyles="absolute bottom-8 left-8"
        onClick={() => {
          sessionStorage.setItem(
            "graph",
            JSON.stringify(graphServices.filter((s) => !s?.disabled))
          );
          // router.push("/download");
          console.log(graphServices.filter((s) => !s?.disabled));
        }}
      />
    </div>
  );
};

export default DiagramPage;
