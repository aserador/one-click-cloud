import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import _ from "lodash";

interface StratusCheckboxProps {
  property: string;
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StratusCheckbox(props: StratusCheckboxProps) {
  const { onChange: onChangeCallback, property, value } = props;

  return (
    <FormControlLabel
      control={
        <Checkbox
          defaultChecked={value}
          onChange={(e) => onChangeCallback(e)}
        />
      }
      label={property}
    />
  );
}
