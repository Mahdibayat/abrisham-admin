import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import styles from "./sideBarLink.module.css";
import Tooltip from '@mui/material/Tooltip';

const SideBarLink = ({ title, to, isActive, isOpen, icon }) => {
  return (
    <Link
      to={to}
      className={
        isActive ? `${styles.sideBarLink} ${styles.sideBarActive}` : `${styles.sideBarLink}`
      }
    >
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
