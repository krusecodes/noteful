import React, {Component} from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';
import CircleButton from '../CircleButton/CircleButton'
import moment from 'moment';


export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  constructor(props) {
    super(props)
    this.state = {
      name: {
        value: '',
        touched: false
      },
      content: {
        value: '',
        touched: false
      },
      folder: {
        value: ''
      }
    }
  }

  updateName(name) {
    this.setState({name: {value: name, touched: true}});
  }

  updateContent(content) {
    this.setState({content: {value: content, touched: true}});
  }

  validateName(textarea) {
    const name = this.state.name.value.trim();
    if (name.length === 0) {
      return 'Name is required';
    }
  }

  validateContent(textarea) {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return 'Content is required';
    }
  }

  handleSubmit= (event) => {
    event.preventDefault();

    const newNote = {
      name: event.target['note-noame'].value,
      content: event.target['note-content'].value,
      folderId: event.target['note-folder-id'].value,
      modified: moment(),
    }
    fetch('http://localhost:9090/notes', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Couldn\'t add note. Sorry!')
      }
      return res.json();
    })
    .then(res => AddNote(res))
    .catch(err => console.log(err))
  }

  render() {
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Write a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
        
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name:
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateName(e.target.value)} />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content:
            </label>
            <textarea id='note-content-input' name='note-content' onChange={e => this.updateContent(e.target.value)} />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder:
            </label>
            <select id='note-folder-select' name='note-folder-id'>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button 
              type='submit'
              disabled={
                this.validateName()||
                this.validateContent()}
                >
              Add note
            </button>
          </div>
          
        </NotefulForm>
        <CircleButton
          tag='button'
          role='link'
          onClick={() => this.props.history.goBack()}
          className='NotePage__back-button'
        >
          <br />
          Back
        </CircleButton>
      </section>
    )
  }
}

// AddNote.propTypes = {
//   folders: PropTypes.arrayOf(PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     name: PropTypes.string.isRequired,
//   })),
//   addNote: PropTypes.func
// }