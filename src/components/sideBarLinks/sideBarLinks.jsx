import SideBarLink from "./sideBarLink";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

//==== STYLEs
import styles from "./sideBarLinks.module.css";

//==== ICONs
import DashboardIcon from "@mui/icons-material/Dashboard";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info";

const SideBarLinks = ({ open }) => {
  const location = useLocation();
  const [active, setActive] = useState("/");

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  return (
    <div className={open ? styles.sidedBarLinks : `${styles.sidedBarLinks} ${styles.sidedBarOpen}`}>
      <SideBarLink
        icon={<DashboardIcon />}
        title="داشبورد"
        isOpen={open}
        to="/dashboard"
        isActive={active === "/dashboard"}
      />

      <SideBarLink
        icon={<RssFeedIcon />}
        title="مقالات"
        isOpen={open}
        to="/blogs"
        isActive={active === "/blogs"}
      />

      <SideBarLink
        icon={<ShareIcon />}
        title="شبکه های اجتماعی"
        isOpen={open}
        to="/social-media"
        isActive={active === "/users"}
      />

      <SideBarLink
        icon={<InfoIcon />}
        title="درباره ما"
        isOpen={open}
        to="/about-us"
        isActive={active === "/about-us"}
      />
    </div>
  );
};

SideBarLinks.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default SideBarLinks;
