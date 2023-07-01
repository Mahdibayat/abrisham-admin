/* eslint-disable react/prop-types */
import { IconButton, InputAdornment, Typography, Box, InputBase } from "@mui/material";
import { useState } from "react";
import Req from "../../assets/req.png";
//==== STYLEs
import styles from "./input.module.css";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Input = ({ password, helperText, ltr, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <Box
      sx={{
        "& input": {
          borderRadius: "5px",
          border: "1px solid silver",
          color: "#fff",
        },
        "& textarea": {
          borderRadius: "5px",
          border: "1px solid silver",
          color: "#fff",
        },
        "& input::placeholder": {
          textAlign: "right",
          direction: "rtl",
        },
      }}
      width={props.fullWidth ? 1 : undefined}
    >
      <Typography
        sx={{
          fontSize: 15,
          mr: "5px",
        }}
        gutterBottom
      >
        {props.label}
        {props.required && (
          <img src={Req} style={{ marginRight: "5px", width: "7px", height: "7px" }} alt="" />
        )}
      </Typography>
      <InputBase
        size="small"
        required
        type={typeof password !== "undefined" && password && !showPassword ? "password" : "text"}
        endAdornment={
          typeof password !== "undefined" &&
          password && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
        {...props}
        id={props.name}
        className={styles.InputBase}
        onBlur={props.onBlur}
        dir={ltr ? "ltr" : "rtl"}
      />
      <Typography
        variant="body2"
        sx={{
          color: "red",
          fontSize: "12px",
        }}
        minHeight={"19px"}
      >
        {helperText}
      </Typography>
    </Box>
  );
};

export default Input;
