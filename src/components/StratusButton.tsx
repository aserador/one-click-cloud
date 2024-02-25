import * as React from "react";
import Button from "@mui/material/Button";

interface StratusButtonProps {
  classStyles: string;
  onClick?: () => void;
}

export default function StratusButton(props: StratusButtonProps) {

  const { classStyles, onClick: onClickCalllback } = props;

  return (
    <div className="relative">
      <Button href="/download" className={classStyles} variant="contained" onClick={onClickCalllback}>
        Submit
      </Button>
    </div>
  );
}
