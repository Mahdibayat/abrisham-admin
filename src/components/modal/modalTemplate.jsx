import {Box, DialogContent, Drawer, IconButton, Modal, useMediaQuery} from "@mui/material";
import {Close} from "@mui/icons-material";
import PropTypes from 'prop-types'

//==== STYLEs
import styles from "./modal.module.css";


const ModalTemplate=({
  open,
  onClose,
  force,
  size,
  className,
  children,
}) => {
  let classNames=styles.centerBox;
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

  if (typeof className !== "undefined" && !!className) {
    classNames+=` ${className}`;
  }

  if (isMobile) {
    return (
      <Drawer
        open={open}
        anchor={"bottom"}
        transitionDuration={{enter: 700, exit: 700}}
        variant="temporary"
      >
      <DialogContent sx={{bgcolor: "#2a3042", color:'#dedede'}}>
        {children}
      </DialogContent>
      </Drawer>
    )
  }

  return (
    <Modal
      open={open}
      onClose={typeof force === "undefined" || !force ? onClose : undefined}
      closeAfterTransition={false}
      sx={{"& *": {outline:'none'}}}
    >
      <Box className={styles.modalTemplate}>
        <Box
          className={classNames}
          style={{width: size ? `${size}px` : "1000px"}}
        >
          {typeof force === "undefined" ||
            (force && (
              <IconButton
                size="small"
                color="error"
                onClick={onClose}
                className={styles.closeBtn}
              >
                <Close />
              </IconButton>
            ))}
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

ModalTemplate.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  force: PropTypes.bool,
  size: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default ModalTemplate;


