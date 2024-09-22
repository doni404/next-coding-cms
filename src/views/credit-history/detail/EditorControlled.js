// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Imports
import { EditorState, convertFromRaw } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

const EditorControlled = ({ content, sendDataToParent, json }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (json) {
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(content))))
    } 
  }, [json])


  const onEditorStateChange = (data) => {
    
    setEditorState(data)
    sendDataToParent(editorState)
  }

  return <ReactDraftWysiwyg editorState={editorState} onEditorStateChange={onEditorStateChange} />
}

export default EditorControlled
