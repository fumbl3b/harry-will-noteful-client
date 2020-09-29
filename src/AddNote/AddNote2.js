import React from 'react';
import ApiContext from '../ApiContext';

export default class AddNote2 extends React.Component {
    state = {
        noteName: { value: '' },
        noteModified: { value: '' },
        noteContent: { value: '' },
        touched: false
    };
   
    static defaultProps = {
        match: {
          params: {}
        }
      }

    static contextType = ApiContext;

    handleUpdateNoteName = name => {
        this.setState({
            noteName: {value: name}, 
            touched: true}
            );
    }

    handleUpdateNoteContent = content => {
        this.setState({
            noteContent: {value: content},
            touched: true
        });
    }

    handleAddNote = e => {
        e.preventDefault();
        const newNoteName = this.state.noteName.value;
        const newNoteContent = this.state.noteContent.value;
        const newNoteModified = new Date().toISOString();

        const newNoteJson = JSON.stringify({ name: newNoteName, modified: newNoteModified, content: newNoteContent });

        fetch(`http://localhost:9090/notes`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: newNoteJson
        }).then(res => {
            if (!res.ok)
                return res.json().then(e => Promise.reject(e))
            return res.json()
        }).then((resJson) => {
            console.log(resJson);
            this.context.AddNote(newNoteName, newNoteContent, modified, folderId);
        }).catch(error => {
            console.error({ error });
        })
    }
    


    render () {
        return (
            <div>
                <label htmlFor="new-note-name">
                    New Note Name:       
                </label>
                <input id="new-note-name" type="text" value={this.state.noteName.value}
                    onChange={e => this.handleUpdateNoteName(e.target.value)} />
                    {/* <p className="error">{this.validateFolderName()}</p> */}
                    <label htmlFor="new-note-content">
                        Content:
                    </label>
                <input id="new-note-content" type="text" value={this.state.noteContent.value}
                    onChange={e => this.handleUpdateNoteContent(e.target.value)} />

                <button onClick={this.handleAddNote}>Create Note</button>
                <button onClick={this.props.history.goBack()}>Cancel</button>
            </div>
        );
    }
}
