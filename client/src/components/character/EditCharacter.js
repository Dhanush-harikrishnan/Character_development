import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCharacterById, updateCharacter } from '../../actions/character';

const EditCharacter = ({
  getCharacterById,
  updateCharacter,
  character: { character, loading }
}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    trait: '',
    description: '',
    alternative: '',
    completed: false,
    progress: 0
  });

  useEffect(() => {
    getCharacterById(id);
  }, [getCharacterById, id]);

  useEffect(() => {
    if (character && !loading) {
      setFormData({
        trait: character.trait || '',
        description: character.description || '',
        alternative: character.alternative || '',
        completed: character.completed || false,
        progress: character.progress || 0
      });
    }
  }, [character, loading]);

  const { trait, description, alternative, completed, progress } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onToggleCompleted = () =>
    setFormData({ ...formData, completed: !completed });

  const onProgressChange = e =>
    setFormData({ ...formData, progress: parseInt(e.target.value, 10) });

  const onSubmit = e => {
    e.preventDefault();
    updateCharacter(id, formData, navigate);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Edit Character Trait</h1>
      <p className='lead'>
        <i className='fas fa-user-circle' /> Update your character development journey
      </p>
      
      {character === null || loading ? (
        <div>Loading...</div>
      ) : (
        <div className='form-container bg-white p-2 my-2'>
          <form className='form' onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='trait'>Trait or Behavior to Change</label>
              <input
                type='text'
                name='trait'
                value={trait}
                onChange={onChange}
                required
              />
            </div>
            
            <div className='form-group'>
              <label htmlFor='description'>Description (Optional)</label>
              <textarea
                name='description'
                value={description}
                onChange={onChange}
                rows='3'
              />
            </div>
            
            <div className='form-group'>
              <label htmlFor='alternative'>Alternative Behavior</label>
              <textarea
                name='alternative'
                value={alternative}
                onChange={onChange}
                rows='3'
                required
              />
            </div>
            
            <div className='form-group'>
              <div className='check-group'>
                <input
                  type='checkbox'
                  id='completed'
                  checked={completed}
                  onChange={onToggleCompleted}
                />
                <label htmlFor='completed'>Mark as completed</label>
              </div>
            </div>
            
            <div className='form-group'>
              <label htmlFor='progress'>Progress ({progress}%)</label>
              <input
                type='range'
                name='progress'
                min='0'
                max='100'
                value={progress}
                onChange={onProgressChange}
                className='progress-slider'
              />
            </div>
            
            <div className='form-actions'>
              <input type='submit' className='btn btn-primary' value='Update Character Trait' />
              <Link className='btn btn-light' to='/character'>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

EditCharacter.propTypes = {
  getCharacterById: PropTypes.func.isRequired,
  updateCharacter: PropTypes.func.isRequired,
  character: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  character: state.character
});

export default connect(mapStateToProps, { getCharacterById, updateCharacter })(EditCharacter); 