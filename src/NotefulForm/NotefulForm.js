import React from 'react';
import {Route} from 'react-router-dom';
import AddNote from '../AddNote/AddNote';
import AddFolder from '../AddFolder/AddFolder';
import './NotefulForm.css';


export default function NotefulForm(props) {
  const { className, history, ...otherProps } = props
  return (
    <form
      className={['Noteful-form', className].join(' ')}
      action='#' autoComplete="off"
      {...otherProps}>
        
        <Route path="/add-folder" render={()=> <AddFolder history={history} />} />
        <Route path="/add-note" render={() => <AddNote history={history} />} />
    </form>
  )
}
