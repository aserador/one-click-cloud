import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSelector } from "react-redux";
import {
  getDrawerMode,
  getIsOpen,
  setIsOpen,
} from "@/redux/persistentDrawerRightSlice";
import { store } from "@/redux/store";
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

interface IPersistentDrawerRightProps {
  children?: React.ReactNode;
}

const PersistentDrawerRight = (props: IPersistentDrawerRightProps) => {
  const { children } = props;

  const theme = useTheme();
  const isOpen = useSelector(getIsOpen);
  const drawerMode = useSelector(getDrawerMode);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          minWidth: DRAWER_MIN_WIDTH,
          height: "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            textColor: "white !important",
            width: DRAWER_WIDTH,
            minWidth: DRAWER_MIN_WIDTH,
            height: "100%",
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
          <Typography variant="h6">{drawerMode}</Typography>
        </DrawerHeader>
        {children}
      </Drawer>
    </Box>
  );
};

export default PersistentDrawerRight;
