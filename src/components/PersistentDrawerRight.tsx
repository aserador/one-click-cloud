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
  setIsOpen,
} from "@/redux/persistentDrawerRightSlice";
import { store } from "@/redux/store";
import StratusCheckbox from "../components/StratusCheckbox";

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

  const settings: any = [];

  if (focusedNode?.settings) {
    for (const [key, value] of Object.entries(focusedNode.settings)) {
      if (value?.type == "boolean") {
        settings.push(<StratusCheckbox label={key} />);
      }
    }
  }

  console.log(settings);

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
        {settings}
      </Drawer>
    </Box>
  );
};

export default PersistentDrawerRight;
