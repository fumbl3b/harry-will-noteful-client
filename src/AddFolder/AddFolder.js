import React, { Component } from "react";
import ApiContext from '../ApiContext';
import ValidationError from '../ValidationError'
import './AddFolder.css';
import PropTypes from 'prop-types'


class AddFolder extends Component {
   static contextType = ApiContext;

   constructor(props) {
    super(props);
    this.state = {
      name: {
        value: '',
        touched: false
      }
    }
  }



  handleSubmit(event) {
    event.preventDefault();
    console.log(event.target);
    const newName = event.target.FolderName.value;
    
    const newFolder = {
        name: newName
    }
    
    fetch(`http://localhost:9090/folders`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(newFolder)})
    .then(response => response.json())
    .then(data => {
            console.log('Success:', data);
            this.context.addFolder(data);
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
  
  updateName(name) {
    this.setState({ name: { value: name, touched: true } });
  }

  validateName() {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return "Name is required";
    } 
  }


  render() {
    const nameError = this.validateName();
    console.log(this.context);
    return (
        <form className="addBookmarkForm" onSubmit={e => this.handleSubmit(e)}>
            <fieldset name="formField">
          
            <div className="form-group">       
              <label htmlFor="FolderName" className="folderLabel">Name: </label>
              <input id="FolderName" type="text"  placeholder="Name" name="FolderName"
                      onChange={e => this.updateName(e.target.value)}/>
              {this.state.name.touched && <ValidationError message={nameError} />}
            </div>
          <br />
            
          <div className="submitFolder">
            <button className="AddSubmit" id="submit" type="submit"
                    disabled={this.validateName()}>Submit</button>
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
export default AddFolder;

AddFolder.propTypes = {
   history: PropTypes.object.isRequired
}