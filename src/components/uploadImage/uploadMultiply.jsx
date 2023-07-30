import { useReducer, useRef } from 'react';
import PropTypes from 'prop-types'
import { Box, Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const T = {
 SET_FILES : 'SET_FILES',
 CLEAR_FILES : 'CLEAR_FILES',
 DELETE: "DELETE"
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case T.SET_FILES:
      return { ...state, files: [...state.files , payload] };
    case T.CLEAR_FILES:
      return { ...state, files: [] };
    case T.DELETE:
      return { ...state, files: state.files.filter(file => file.name !== payload)};
    default:
      return state;
  }
};


const UploadMultiply = ({setUploadedImages}) => {
  const inputRef = useRef();
  const [state, dispatch] = useReducer(reducer, {
    files: [],
  });

  function getImgData() {
    const {files} = inputRef.current;
    dispatch({type: T.CLEAR_FILES})
    
    if (typeof files !== "undefined" && !!files && !!files.length) {
      setUploadedImages(files);
      Array.from(files).forEach(file => {
        dispatch({type: T.SET_FILES, payload: {name: file.name, file}});
      })
    }
  }
  
  function handleClickInput() {
    inputRef.current.click();
  }
  
  return (
    <>
      <Box position="absolute" width={0} height={0} visibility={"hidden"}>
        <label>
          x
          <input type="file" accept="image/*" ref={inputRef} onChange={getImgData} multiple />
        </label>
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            fullWidth
            size='large'
            onClick={handleClickInput}
          >آپلود عکس ها</Button>
        </Grid>
        <Stack sx={{pt:2, px: 2, width: 1}}>
          <Typography>تعداد فایل های انتخاب شده : {state.files.length}</Typography>
          {
            state.files.map(file => <Stack direction={'row'} key={file.name} alignItems={'center'}>
              <IconButton
                onClick={() => dispatch({type: T.DELETE, payload: file.name})}
              ><HighlightOffIcon sx={{color: 'red', scale: '1.4'}} /></IconButton>
              <Typography sx={{pr:1}}>{file.name}</Typography>
            </Stack>)
          }
        </Stack>
      </Grid>

    </>
  );
};

UploadMultiply.propTypes = {
  setUploadedImages: PropTypes.func.isRequired
}

export default UploadMultiply;  