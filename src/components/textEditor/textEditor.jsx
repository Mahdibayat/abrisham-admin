import { useState, useEffect } from "react";
import { ContentState, EditorState, convertFromHTML, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
import { Box, Typography } from "@mui/material";
import PropTypes from 'prop-types'

function TextEditor({ setValue, label, defaultValue }) {
  const [state, setState] = useState(() => {
    if (typeof defaultValue !== "undefined" && !!defaultValue) {
      return EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(defaultValue)));
    } else {
      return EditorState.createEmpty();
    }
  });

  useEffect(() => {
    setValue(draftToHtml(convertToRaw(state.getCurrentContent())));
  }, [state]);

  return (
    <>
      <Typography sx={{ mb: 1 }}>{label}</Typography>
      <Box sx={{ direction: "ltr !important" }}>
        <Editor
          editorState={state}
          onEditorStateChange={setState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor-custom"
          toolbarClassName="demo-toolbar-custom"
        />
      </Box>
    </>
  );
}

TextEditor.propTypes = {
  setValue: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string
}

export default TextEditor;


