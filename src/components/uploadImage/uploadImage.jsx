/* eslint-disable react/prop-types */
import { Box, IconButton, Button } from "@mui/material";
import { useRef, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

const UploadImage = ({ setUploadedImage, width, height, emptyIcon }) => {
  const inputRef = useRef(null);
  const [show, setShow] = useState(null);

  function handleClickInput() {
    inputRef.current.click();
  }

  function getImgData() {
    const files = inputRef.current?.files?.[0];
    if (typeof files !== "undefined" && !!files) {
      setUploadedImage(files);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", function () {
        setShow(this.result);
      });
    }
  }

  return (
    <>
      <Box position="absolute" width={0} height={0} visibility={"hidden"}>
        <label>
          x
          <input type="file" accept="image/*" ref={inputRef} onChange={getImgData} />
        </label>
      </Box>

      <Button
        variant="outlined"
        sx={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "15px",
          border: "4px solid",
          borderRadius: "10px",
          margin: "auto",
          overflow: "hidden",
          position: "relative",
        }}
        onClick={handleClickInput}
      >
        {show ? (
          <>
            <IconButton
              color="error"
              onClick={() => {
                setShow(false);
                setUploadedImage(null);
              }}
              sx={{
                zIndex: 1,
                position: "absolute",
                top: "10px",
                right: "10px",
              }}
            >
              <ClearIcon />
            </IconButton>
            <img
              src={show}
              alt={"uploaded Image"}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </>
        ) : (
          emptyIcon
        )}
      </Button>
    </>
  );
};

export default UploadImage;
