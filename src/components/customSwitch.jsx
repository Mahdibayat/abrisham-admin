import PropTypes from "prop-types";
import {Box, Typography} from "@mui/material";

// SIZE = md, sm, lg
function CustomSwitch({
  size="md",
  value=false,
  setValue=() => null,
  trueText="trueText",
  falseText="falseText",
}) {
  return (
    <Box
      sx={{
        width: size === "sm" ? "90px" : size === "md" ? "150px" : "240px",
        height: size === "sm" ? "20px" : size === "md" ? "30px" : "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: "50px",
        bgcolor: "rgba(150,150,150,0.4)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 0 3px 5px #d9d7d7",
      }}
      onClick={() => setValue(!value)}
    >
      <Typography
        style={{
          fontSize: size === "sm" ? "10px" : size === "md" ? "12px" : "13px",
          color: "dimgray",
        }}
      >
        {falseText}
      </Typography>
      <Typography
        style={{
          fontSize: size === "sm" ? "10px" : size === "md" ? "12px" : "13px",
          color: "dimgray",
        }}
      >
        {trueText}
      </Typography>

      <Box
        sx={{
          position: 'absolute',
          width: size === 'sm' ? '45px' : size === 'md' ? '75px' : '120px',
          height: size === 'sm' ? '20px' : size === 'md' ? '30px' : '40px',
          borderRadius: '50px',
          bgcolor: "primary.main",
          right: value ? 0 : '120px',
          color: '#fff',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: (t) => `0 0 8px 3px ${t.palette.primary.main}`,
          transition: 'all 500ms',
        }}
      >
        <Typography
          style={{
            fontSize: size === "sm" ? "10px" : size === "md" ? "12px" : "13px",
            position: "absolute",
            color: "#fff",
            transition: "opacity 250ms",
            opacity: value ? 1 : 0,
          }}
        >{trueText}</Typography>
        <Typography
          style={{
            fontSize: size === "sm" ? "10px" : size === "md" ? "12px" : "13px",
            position: "absolute",
            color: "#fff",
            transition: "opacity 250ms",
            opacity: value ? 0 : 1,
          }}
        >{falseText}</Typography>
      </Box>
    </Box>
  );
}

CustomSwitch.propTypes={
  size: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  trueText: PropTypes.string.isRequired,
  falseText: PropTypes.string.isRequired,
};

export default CustomSwitch;
