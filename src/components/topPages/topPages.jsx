/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
//==== COMPONENTs
import { memo } from "react";

//==== STYLEs
import styles from "./topPages.module.css";

const TopPages = memo(({ title }) => {
  return (
    <div className={styles.topPages}>
      <h3>{title}</h3>
    </div>
  );
});

export default TopPages;
