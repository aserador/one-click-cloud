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
  setAwsServiceProperty,
} from "@/redux/persistentDrawerRightSlice";
import StratusTextField from "@/components/StratusTextField";
import _ from "lodash";

const DiagramPage = () => {
  const [filter, setFilter] = useState<number[]>([]);

  const router = useRouter();
  useEffect(() => {
    const option = router.query.option;

    if (option !== undefined && option !== null) {
      setFilter(ARCHITECTURES[Number(option)].services);
    }
  }, [router.query.option]);

  const focusedNode = useSelector(getFocusedNode);
  const focusedNodeCopy = _.cloneDeep(focusedNode);
  const awsServices = useSelector(getAwsServices);
  const drawerMode = useSelector(getDrawerMode);

  const settings: JSX.Element[] = [];
  if (focusedNode?.settings) {
    for (const [name, metadata] of Object.entries(focusedNode.settings)) {
      if ((metadata as any)?.type == "boolean") {
        // TODO: Add key
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
        // TODO: Add key
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
              {awsServices.map((awsService, index) => {
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
      <Graph filter={filter} />
      <StratusButton
        classStyles="absolute bottom-8 left-8"
        onClick={() => {
          sessionStorage.setItem(
            "graph",
            JSON.stringify(
              awsServices.filter((s) => !s?.disabled && s?.id in filter)
            )
          );
          router.push("/download");
        }}
      />
    </div>
  );
};

export default DiagramPage;
