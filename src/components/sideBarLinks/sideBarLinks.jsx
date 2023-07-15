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
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import QuizIcon from '@mui/icons-material/Quiz';
import ImagesearchRollerIcon from '@mui/icons-material/ImagesearchRoller';

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
        icon={<ImagesearchRollerIcon />}
        title="تصاویر صفحه اصلی"
        isOpen={open}
        to="/home-slider"
        isActive={active === "/home-slider"}
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

      <SideBarLink
        icon={<PhoneCallbackIcon />}
        title="تماس با ما"
        isOpen={open}
        to="/call-us"
        isActive={active === "/call-us"}
      />

      <SideBarLink
        icon={<CleaningServicesIcon />}
        title="سرویس ها"
        isOpen={open}
        to="/services"
        isActive={active === "/services"}
      />

      <SideBarLink
        icon={<QuestionAnswerIcon />}
        title="نظرات"
        isOpen={open}
        to="/comment"
        isActive={active === "/comment"}
      />

      <SideBarLink
        icon={<QuizIcon  />}
        title="سوالات متداول"
        isOpen={open}
        to="/faq"
        isActive={active === "/faq"}
      />
    </div>
  );
};

SideBarLinks.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default SideBarLinks;
