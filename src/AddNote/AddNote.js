import React from 'react'
import ApiContext from '../ApiContext'

export default class AddNote extends React.Component {
    state = {
        name: { value: '' },
        folderId: { value: '' },
        content: { value: '' },
        modified: { value: '' },
        touched: false
    }

    static defaultProps = {
        folders: [],
        notes: [],
        history: {
            goBack: () => {}
        },
        match: {
            params: {}
        }
    };

    static contextType = ApiContext;

    generateFolderList = () => {
        const folderList = this.context.folders.map(item => {
            return <option key={item.id} value={item.id}>{item.name}</option>
        })
        return folderList
    }

    handleClickAddNote = e => {
        e.preventDefault();
        const newDate = new Date().toISOString()
        const newNote = JSON.stringify({
            name: this.state.name.value,
            folderId: this.state.folderId.value || document.getElementById('add-folder').value,
            content: this.state.content.value,
            modified: newDate
        });

        if (this.state.name.value.length >= 3 && this.state.content.value.length >= 3) {
            fetch(`http://localhost:9090/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: newNote
            })
                .then(res => {
                    if (!res.ok) {
                        return res.json().then(e => Promise.reject(e))
                    }
                    return res.json();
                }).then((resJson) => {
                    console.log(resJson);
                    this.context.AddNote(resJson);
                    this.props.history.push('/');
                })
                .catch(error => {
                    console.error({ error });
                });
        } else {
            alert('Please use at least 3 characters for name and description')
        }

    }

    getName = (name) => {
        this.setState({
            name: {value: name}
        })
    }

    getFolder = (folder) => {
        this.setState({
            folderId: {value: folder}
        })
    }

    getContent = (content) => {
        this.setState({
            content: {value: content}
        })
    }




    render() {

        return (
            <div>
                <label htmlFor="add-folder">Add Folder</label>
                <select id="add-folder" value={this.state.folderId.value}
                    onChange={(e) => this.getFolder(e.target.value)}
                >{this.generateFolderList()}</select>
                <label htmlFor="note-name">Note Name</label>
                <input
                    id="note-name" value={this.state.name.value}
                    onChange={(e) => this.getName(e.target.value)}
                >
                </input>
                <label htmlFor="add-description">Add Description</label>
                <textarea name="add-description" id="add-description" cols="30" rows="10" value={this.state.content.value}
                    onChange={(e) => this.getContent(e.target.value)}
                ></textarea>
                <button type="button" onClick={this.handleClickAddNote}>Add Note</button>
            </div>
        );
    }
}