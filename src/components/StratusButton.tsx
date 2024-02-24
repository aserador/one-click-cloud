import * as React from "react";
import Button from "@mui/material/Button";

export default function StratusButton() {
  return (
    <div className="relative">
      <Button href="/download" className="absolute bottom-8 left-8" variant="contained">
        Submit
      </Button>
    </div>
  );
}
