import React, { Component } from "react";
import ApiContext from '../ApiContext';
import './AddNote.css';
import ValidationError from '../ValidationError'

import PropTypes from 'prop-types'

class AddNote extends Component {
   static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      name: {
        value: '',
        touched: false
      },
      folder: {
        value: '',
        touched: false
      },
      content: {
        value: '',
        touched: false
      }
    }
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

  updateFolder(folder) {
    this.setState({
      folder: { value: folder, touched: true }
    });
  }

  updateContent(content) {
    this.setState({
      content: { value: content, touched: true }
    });
  }
  
   findFolder = folderName => {
    const {folders} = this.props;
    return folders.find(folder => 
          folder.name === folderName
      )
  }
  
  
   handleSubmit(event) {
    event.preventDefault();
    console.log(event.target);
    const newName = event.target.newName.value;
    console.log(event.target.newFolderName.value)
    const newFolder = this.findFolder(event.target.newFolderName.value);
    const newFolderId = newFolder.id;
    console.log(newFolderId);
    const newContent = event.target.content.value;
    const newModified =  new Date();
    newModified.toISOString();
    
    
    const newNote = {
        name: newName,
        id: newName,
        folderId: newFolderId,
        content : newContent,
        modified: newModified
    }
    
    fetch(`http://localhost:9090/notes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(newNote)})
    .then(response => response.json())
    .then(data => {
            console.log('Success:', data);
            this.context.addNote(data);
            this.goBack();
        })
        .catch((error) => {
            console.error('Error:', error);
        });

  }


  goBack(){
        console.log('goBack')
        this.props.history.push('/')
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "Name is required";
    } 
  }


  // validateFolder() {
  //   const folder = this.state.folder.value.trim();
  //   const isFolder = this.findFolder(folder);
    
  //   if (isFolder === undefined) {
  //     return "folder does not exist";
  //   } else if (folder.length === 0) {
  //     return "You must type in a folder";
  //   } 
  // }



  validateContent() {
    const content= this.state.content.value.trim();

    if(content.length === 0)
      return "You must type something into content";
  }


  render() {
   
    const {folders} = this.props;
    console.log(this.context);
    const nameError = this.validateName();
    //const folderError = this.validateFolder();
    const contentError = this.validateContent();
   
    return (
        <form className="addNoteForm" onSubmit={e => this.handleSubmit(e)}>
            <fieldset name="formField">
          
          <div className="form-group">
              <label htmlFor="newName" className="noteLabels">Name: </label>
              <input id="newName" type="text"  placeholder="Name" name="newName"
                      onChange={e => this.updateName(e.target.value)}/>
              {this.state.name.touched && <ValidationError message={nameError} />}
          </div>
          
          <br />

          <div className="form-group">
              <label htmlFor="newFolderName" className="noteLabels">Folder: </label>
              <select id="newFolderName"  placeholder="Folder" name="newFolderName"
                      onChange={e => //this.updateFolder(e.target.value)
                          console.log(e.target.value)
                      } >
                      {folders.map((folder, i) => 
                          <option key={i+1} value={folder.name}>{folder.name}</option>
                          //<Option key={i+1} value={folder.name} />
                      )}  
              </select>
              {/* {this.state.folder.touched && <ValidationError message={folderError} />} */}
          </div>
          <br />

          <div className="form-group">
              <label htmlFor="content" className="noteLabels">Content: </label>
              <textarea id="content" type="text"  placeholder="Content" name="content"
                      onChange={e => this.updateContent(e.target.value)} />
              {this.state.name.context && <ValidationError message={contentError} />}
          </div>
          <br />
            
          <div className="submitNote">
            <button className="AddSubmit" id="submit" type="submit" disabled={
              this.validateName() ||
              //this.validateFolder() ||
              this.validateContent()
            }>Submit</button>
          </div>   
          <div className="error-container">
          <div id="thisModal" aria-modal="true" className="modal">
            <div className="modal-content">
            <span className="close">&times;</span>
            <p></p>
            </div>   
        </div> 
        </div>  
        </fieldset>
      </form>
    );
  }
}
export default AddNote;

AddNote.propTypes = {
    folders: PropTypes.array.isRequired
}