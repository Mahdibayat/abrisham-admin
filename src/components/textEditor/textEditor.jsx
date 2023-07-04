/* eslint-disable react/prop-types */

import { Box, Button, Grid } from '@mui/material'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import PropTypes from 'prop-types'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('آدرس عکس را وارد کنید')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <Box sx={{
      width:1,
      display:'flex',
      gap: '5px',
      flexWrap:'wrap',
    }}>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        variant={editor.isActive('bold') ? 'contained' : 'outlined'}
      >
        bold
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        variant={editor.isActive('italic') ? 'contained' : 'outlined'}
      >
        italic
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        variant={editor.isActive('strike') ? 'contained' : 'outlined'}
      >
        strike
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
        variant={editor.isActive('code') ? 'contained' : 'outlined'}
      >
        code
      </Button>
      <Button
        size={'small'} variant='outlined' onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </Button>
      <Button
        size={'small'} variant='outlined' onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().setParagraph().run()}
        variant={editor.isActive('paragraph') ? 'contained' : 'outlined'}
      >
        paragraph
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        variant={editor.isActive('heading', { level: 1 }) ? 'contained' : 'outlined'}
      >
        h1
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={editor.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'}
      >
        h2
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={editor.isActive('heading', { level: 3 }) ? 'contained' : 'outlined'}
      >
        h3
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        variant={editor.isActive('heading', { level: 4 }) ? 'contained' : 'outlined'}
      >
        h4
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        variant={editor.isActive('heading', { level: 5 }) ? 'contained' : 'outlined'}
      >
        h5
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        variant={editor.isActive('heading', { level: 6 }) ? 'contained' : 'outlined'}
      >
        h6
      </Button>
      <Button size='small' onClick={() => editor.chain().focus().setTextAlign('left').run()} variant={editor.isActive({ textAlign: 'left' }) ? 'contained' : 'outlined'}>
        left
      </Button>
      <Button size='small' onClick={() => editor.chain().focus().setTextAlign('center').run()} variant={editor.isActive({ textAlign: 'center' }) ? 'contained' : 'outlined'}>
        center
      </Button>
      <Button size='small' onClick={() => editor.chain().focus().setTextAlign('right').run()} variant={editor.isActive({ textAlign: 'right' }) ? 'contained' : 'outlined'}>
        right
      </Button>
      <Button size='small' onClick={() => editor.chain().focus().setTextAlign('justify').run()} variant={editor.isActive({ textAlign: 'justify' }) ? 'contained' : 'outlined'}>
        justify
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive('bulletList') ? 'contained' : 'outlined'}
      >
        bullet list
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive('orderedList') ? 'contained' : 'outlined'}
      >
        ordered list
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        variant={editor.isActive('codeBlock') ? 'contained' : 'outlined'}
      >
        code block
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        variant={editor.isActive('blockquote') ? 'contained' : 'outlined'}
      >
        blockquote
      </Button>
      <Button
        size={'small'} variant='outlined' onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </Button>
      <Button
        size={'small'} onClick={() => editor.chain().focus().setHardBreak().run()} variant='outlined'>
        hard break
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().undo().run()}
        variant='outlined'
        disabled={
          !editor.can()
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        undo
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().redo().run()}
        variant='outlined'
        disabled={
          !editor.can()
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        redo
      </Button>
      <Button
        size={'small'}
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        variant={editor.isActive('textStyle', { color: '#958DF1' }) ? 'contained' : 'outlined'}
      >
        purple
      </Button>

      <Button
        size={'small'}
        onClick={addImage}
        variant={"outlined"}
      >
        Image
      </Button>
    </Box>
  )
}

function TextEditor ({defaultValue, setEditorValue})  {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image
    ],
    content: defaultValue,
  });
  
  if(!editor) return
  
  editor.on("update", (x)=> {
    setEditorValue(x.editor.getHTML())
  })

  return (
    <Grid container>
      <Grid item xs={12} sx={{p:1, pb:2, borderRadius:'10px 10px 0 0', bgcolor:'gray.dark', textAlign:'unset' }}>
        <MenuBar editor={editor} />
      </Grid>
      <Grid item xs={12} sx={{px:1, py:2, borderRadius:"0 0 10px 10px", bgcolor:'gray.main', border:'1px solid gray', borderTop:'unset', boxShadow:'inset -2px -3px 15px 0px #1f2328'}}>
        <EditorContent editor={editor} style={{minHeight:'100px'}} />
      </Grid>
    </Grid>
  )
}

TextEditor.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  setEditorValue: PropTypes.func.isRequired
}

export default TextEditor