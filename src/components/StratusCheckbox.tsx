import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import {
  getFocusedNode,
  setAwsServiceProperty,
} from "@/redux/persistentDrawerRightSlice";
import { store } from "@/redux/store";

interface StratusCheckboxProps {
  label: string;
}

export default function StratusCheckbox(props: StratusCheckboxProps) {
  const { label } = props;
  const focusedNode = useSelector(getFocusedNode);
  return (
    <FormControlLabel
      control={
        <Checkbox
          defaultChecked
          onChange={(e) =>
            store.dispatch(
              setAwsServiceProperty({
                focusedNode: { ...focusedNode, value: e.target.checked },
              })
            )
          }
        />
      }
      label={label}
    />
  );
}
