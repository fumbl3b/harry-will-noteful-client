import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: [],
        currentFolderId: ''
    };


    componentDidMount() {
        // fake date loading from API call
        Promise.all([
            fetch(`http://localhost:9090/notes`), fetch(`http://localhost:9090/folders`)
        ])
        .then(([notesRes, foldersRes]) => {
            if(!notesRes.ok) {
                return notesRes.json().then(e => Promise.reject(e));
            }
            if(!foldersRes.ok) {
                return foldersRes.json().then(e => Promise.reject(e));
            }
            return Promise.all([notesRes.json(),foldersRes.json()])
        }).then(([notes, folders]) => { this.setState({notes, folders}) }).catch(e => {
            console.error({e});
        });
    }
    
    handleDeleteNote = noteId => {
        this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
        })
    }

    handleAddNote = (newNoteName,newNoteContent, modified) => {
        this.setState({
            notes:[...this.state.notes, {
                name: newNoteName,
                content: newNoteContent,
                modified
            }]
        });
    }

    handleAddFolder = newFolderName => {
        this.setState({
            folders: [...this.state.folders, {
                name: newFolderName
            }]
        })
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageNav} />
                <Route path="/add-folder" component={NoteListNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route path="/note/:noteId" component={NotePageMain} />
                <Route path="/add-folder" component={NotefulForm} />
                <Route path="/add-note" component={NotefulForm} />
            </>
        );
    }

    render() {
        const value = {
            notes: this.state.notes,
            folders: this.state.folders,
            currentFolderId: '',
            deleteNote: this.handleDeleteNote,
            addFolder: this.handleAddFolder,
            addNote: this.handleAddNote
        };
        return (
            <ApiContext.Provider value={value}>
                <div className="App">
                    <nav className="App__nav">{this.renderNavRoutes()}</nav>
                    <header className="App__header">
                        <h1>
                            <Link to="/">Noteful</Link>{' '}
                            <FontAwesomeIcon icon="check-double" />
                        </h1>
                    </header>
                    <main className="App__main">{this.renderMainRoutes()}</main>
                </div>
            </ApiContext.Provider>
        );
    }
} 

export default App;
