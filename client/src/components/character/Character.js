import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCharacters, toggleCharacterCompleted, deleteCharacter } from '../../actions/character';

const Character = ({
  getCharacters,
  toggleCharacterCompleted,
  deleteCharacter,
  character: { characters, loading }
}) => {
  useEffect(() => {
    getCharacters();
  }, [getCharacters]);

  const handleToggleCompleted = id => {
    toggleCharacterCompleted(id);
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this character trait?')) {
      deleteCharacter(id);
    }
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Character Development</h1>
      <p className='lead'>
        <i className='fas fa-user-circle' /> Track your character development journey
      </p>
      <Link to='/add-character' className='btn btn-primary'>
        <i className='fas fa-plus' /> Add New Character Trait
      </Link>
      
      <div className='character-traits'>
        {characters.length === 0 ? (
          <div className='alert alert-info my-2'>
            <p>You haven't added any character traits yet. Add one to begin tracking!</p>
          </div>
        ) : (
          <div className='character-grid my-2'>
            {characters.map(character => (
              <div key={character._id} className={`character-card ${character.completed ? 'completed' : ''}`}>
                <div className='character-header'>
                  <h3>{character.trait}</h3>
                  <div className='character-actions'>
                    <button 
                      onClick={() => handleToggleCompleted(character._id)}
                      className={`btn-circle ${character.completed ? 'btn-success' : 'btn-light'}`}
                      title={character.completed ? 'Mark as in progress' : 'Mark as completed'}
                    >
                      <i className={`fas ${character.completed ? 'fa-check' : 'fa-times'}`}></i>
                    </button>
                    <button 
                      onClick={() => handleDelete(character._id)}
                      className='btn-circle btn-danger'
                      title='Delete'
                    >
                      <i className='fas fa-trash'></i>
                    </button>
                  </div>
                </div>
                
                {character.description && (
                  <div className='character-description'>
                    <p>{character.description}</p>
                  </div>
                )}
                
                <div className='character-alternative'>
                  <h4>Alternative Behavior:</h4>
                  <p>{character.alternative}</p>
                </div>
                
                <div className='character-footer'>
                  <Link to={`/edit-character/${character._id}`} className='btn btn-sm btn-primary'>
                    <i className='fas fa-edit'></i> Edit
                  </Link>
                  <span className='character-date'>
                    Added on {new Date(character.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

Character.propTypes = {
  getCharacters: PropTypes.func.isRequired,
  toggleCharacterCompleted: PropTypes.func.isRequired,
  deleteCharacter: PropTypes.func.isRequired,
  character: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  character: state.character
});

export default connect(mapStateToProps, {
  getCharacters,
  toggleCharacterCompleted,
  deleteCharacter
})(Character); 