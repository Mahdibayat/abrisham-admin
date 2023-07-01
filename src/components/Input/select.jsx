/* eslint-disable react/prop-types */
import { Box, Select as SelectMUI, Typography, MenuItem } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";

function Select({ label, name, helperText, error, value, onChange, data, ...props }) {
  return (
    <Box
      sx={{
        "& input": {
          background: "#fff",
          borderRadius: "5px",
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
          color: "#242424",
          mr: "5px",
        }}
        gutterBottom
      >
        {label}
        {props.required && (
          <img
            src={"/assets/icons/req.png"}
            style={{ marginRight: "5px", width: "7px", height: "7px" }}
            alt=""
          />
        )}
      </Typography>

      <SelectMUI
        labelId="demo-simple-select-filled-label"
        IconComponent={ExpandMore}
        required
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        error={error}
        sx={{
          height: "40px",
          background: "#fff",
          width: "100%",
        }}
        multiple={props.multiple}
        onSelect={props.onSelect}
      >
        {data?.map((item, i) => (
          <MenuItem key={i} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </SelectMUI>
      <Typography
        variant="body2"
        sx={{
          color: "red",
          fontSize: "12px",
        }}
        minHeight={"17px"}
      >
        {helperText}
      </Typography>
    </Box>
  );
}

export default Select;
