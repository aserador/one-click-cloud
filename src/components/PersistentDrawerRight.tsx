import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";
import {
  getFocusedNode,
  getIsOpen,
  setAwsServiceProperty,
  setIsOpen,
} from "@/redux/persistentDrawerRightSlice";
import { store } from "@/redux/store";
import StratusCheckbox from "../components/StratusCheckbox";
import StratusTextField from "./StratusTextField";
import _ from "lodash";

const DRAWER_WIDTH = "25%";
const DRAWER_MIN_WIDTH = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const PersistentDrawerRight = () => {
  const theme = useTheme();
  const isOpen = useSelector(getIsOpen);
  const focusedNode = useSelector(getFocusedNode);

  // This should be done in the reducer ("slice")
  // Don't know if focusNode is already a copy or immutable
  const focusedNodeCopy = _.cloneDeep(focusedNode);

  const settings: JSX.Element[] = [];
  if (focusedNode?.settings) {
    for (const [name, metadata] of Object.entries(focusedNode.settings)) {
      if ((metadata as any)?.type == "boolean") {
        // TODO: Add key
        settings.push(
          <StratusCheckbox
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          minWidth: DRAWER_MIN_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            minWidth: DRAWER_MIN_WIDTH,
          },
        }}
        variant="persistent"
        anchor="right"
        open={isOpen}
      >
        <DrawerHeader>
          <IconButton
            onClick={() => store.dispatch(setIsOpen({ isOpen: !isOpen }))}
          >
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <div className="p-4">
          <Typography variant="h4">{focusedNode?.name ?? "[None]"}</Typography>
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
      </Drawer>
    </Box>
  );
};

export default PersistentDrawerRight;
