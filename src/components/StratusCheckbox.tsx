import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import _ from "lodash";

interface StratusCheckboxProps {
  property: string;
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StratusCheckbox(props: StratusCheckboxProps) {
  const { onChange: onChangeCallback, property, value } = props;

  return (
    <div className="pl-4">
      <FormControlLabel
        control={
          <Checkbox
            defaultChecked={value}
            onChange={(e) => onChangeCallback(e)}
          />
        }
        label={property}
      />
    </div>
  );
}
