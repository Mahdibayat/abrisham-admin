/* eslint-disable react/prop-types */
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";

function MyRadio({ ...props }) {
  return (
    <Box
      sx={{
        mt: "10px",
        mb: "20px",
        "& input": {
          background: "#fff",
          borderRadius: "5px",
          textAlign: "left",
          direction: "ltr",
        },
        position: "relative",
        bottom: "8px",
      }}
    >
      <Typography
        sx={{
          fontSize: 15,
          color: "#242424",
        }}
        gutterBottom
      >
        {props.label}
        {props.required && (
          <img
            src={"/assets/req.png"}
            style={{ marginRight: "5px", width: "7px", height: "7px" }}
            alt=""
          />
        )}
      </Typography>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name={props.name}
        onChange={props.onChange}
        row
      >
        {props.data.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}

export default MyRadio;
