import * as React from "react";
import Button from "@mui/material/Button";

interface StratusButtonProps {
  onClick?: () => void;
}

export default function StratusButton(props: StratusButtonProps) {

  const { onClick: onClickCalllback } = props;

  return (
    <div className="relative">
      <Button href="/download" className="absolute bottom-8 left-8" variant="contained" onClick={onClickCalllback}>
        Submit
      </Button>
    </div>
  );
}
