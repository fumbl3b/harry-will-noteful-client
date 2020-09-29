import React from 'react';

export default React.createContext({
    notes: [],
    folders: [],
    currentFolderId: '',
    deleteNote: () => {},
    addFolder: () => {},
    addNote: () => {}
})