import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface StratusTextFieldProps {
  id: string;
  label: string;
  defaultValue: string;
  helperText: string;
  variant: "filled";
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function StratusTextField(props: StratusTextFieldProps) {

  const {onChange: onChangeCallback, ...rest} = props;

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { width: "100%" },
        
      }}
      noValidate
      autoComplete="off"
    >
      <TextField onChange={(e) => onChangeCallback(e)} {...rest} />
    </Box>
  );
}
