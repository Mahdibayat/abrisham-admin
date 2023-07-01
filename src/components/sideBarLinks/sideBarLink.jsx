import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Tooltip from '@mui/material/Tooltip';

const SideBarLink = ({ title, to, isActive, isOpen, icon }) => {
  return (
    <Link
      to={to}
    >
      <Box sx={{
        color: isActive ? '#fff' : "var(--sidebar-menu-item-color)",
        width: "100%",
        height: "50px",
        gap: "10px",
        display: "flex",
        alignItems: "center",
        p: "0.625rem 1.1rem",
        textDecoration: "none !important",
        transition: "all 400ms",
        whiteSpace: "nowrap",
        borderRadius:'7px',
        "&:hover": {
          color: 'primary.light'
        }
      }}>
        {isOpen ? (
          <>
            {icon}
            <Typography>{title}</Typography>
          </>
        ) : (
          <Tooltip placement="left" title={title}>
            {icon}
          </Tooltip>
        )}
      </Box>
    </Link>
  );
};

SideBarLink.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  icon: PropTypes.bool.isRequired,
};

export default SideBarLink;
