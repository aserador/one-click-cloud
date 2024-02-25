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
  getFocusedNode,
  getGraphEdges,
  getGraphServices,
  setAwsServiceProperty,
  setGraphEdges,
  setGraphServices,
} from "@/redux/persistentDrawerRightSlice";
import StratusTextField from "@/components/StratusTextField";
import _ from "lodash";

const DiagramPage = () => {
  // Local state for diagram (nodes are aws services, edges are dependencies)
  const [localGraphServices, setLocalGraphServices] = useState<any[]>([]);
  const [localGraphEdges, setLocalGraphEdges] = useState<any[]>([]);

  // Redux state to submit diagram data to backend
  const graphServices = useSelector(getGraphServices);
  const graphEdges = useSelector(getGraphEdges);

  // Redux state to display focused aws service in right drawer
  const focusedNode = useSelector(getFocusedNode);

  // Deep copy focusedNode to avoid mutating redux state
  const focusedNodeCopy = _.cloneDeep(focusedNode);

  // Initial aws services available
  const awsServices = useSelector(getAwsServices);

  // The architecture schema is passed in the URL query
  const router = useRouter();

  // Load initial diagram nodes and edges based on URL query
  useEffect(() => {
    const option = router.query.option;

    if (option !== undefined && option !== null) {
      // Filter out disabled services and services not in the selected architecture
      const initialServices = awsServices.filter(
        (s) => !s?.disabled && s?.id in ARCHITECTURES[Number(option)].services
      );

      // Initialize redux state with diagram data for form submission
      store.dispatch(
        setGraphServices({
          graphServices: initialServices,
        })
      );

      // Initialize local state with diagram data for rendering
      setLocalGraphServices(initialServices);

      // Retrieve diagram's edges from selected architecture
      const initialGraphEdges = ARCHITECTURES[Number(option)].edges;

      // Initialize redux state with diagram's edges for form submission
      store.dispatch(setGraphEdges({ graphEdges: initialGraphEdges }));

      // Initialize local state with diagram's edges for rendering
      setLocalGraphEdges(initialGraphEdges);
    }
  }, [router.query.option]);

  // Settings are the parameters for the focused aws service
  const settings: JSX.Element[] = [];
  if (focusedNode?.settings) {
    for (const [settingName, metadata] of Object.entries(
      focusedNodeCopy.settings
    )) {
      if ((metadata as any)?.type == "boolean") {
        settings.push(
          <StratusCheckbox
            key={`key-setting-focused_node-${focusedNode?.id}`}
            property={settingName}
            value={(metadata as any)?.value}
            onChange={(e) => {
              focusedNodeCopy.settings[settingName].value =
                !focusedNodeCopy.settings[settingName].value;
              store.dispatch(
                setAwsServiceProperty({
                  focusedNode: focusedNodeCopy,
                })
              );
            }}
          />
        );
      } else if ((metadata as any)?.type == "input") {
        settings.push(
          <StratusTextField
            key={`key-setting-focused_node-${focusedNode?.id}`}
            id={`id-setting-focused_node-${focusedNode?.id}`}
            label={settingName}
            defaultValue={(metadata as any)?.value}
            helperText={(metadata as any)?.note}
            variant={"filled"}
            onChange={(e) => {
              focusedNodeCopy.settings[settingName].value = e.target.value;
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

  // Questions are the terraform related input fields for the focused aws service
  const questions: JSX.Element[] = [];
  if (focusedNode?.questions) {
    for (const q of focusedNode.questions) {
      if ((q as any)?.type == "input") {
        questions.push(
          <StratusTextField
            key={`key-question-focused_node-${focusedNode?.id}`}
            id={`id-question-focused_node-${focusedNode?.id}`}
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
        }
      />
      <Graph
        initialServices={localGraphServices}
        initialEdges={localGraphEdges}
      />

      {/* Submit diagram button */}
      <StratusButton
        classStyles="absolute bottom-8 left-8"
        onClick={() => {
          sessionStorage.setItem(
            "graphServices",
            JSON.stringify(graphServices.filter((s) => !s?.disabled))
          );
          sessionStorage.setItem("graphEdges", JSON.stringify(graphEdges));
          router.push("/download");
        }}
      />
    </div>
  );
};

export default DiagramPage;
