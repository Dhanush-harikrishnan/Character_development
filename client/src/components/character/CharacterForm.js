import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addCharacter } from '../../actions/character';

const CharacterForm = ({ addCharacter }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    trait: '',
    description: '',
    alternative: ''
  });

  const { trait, description, alternative } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    addCharacter(formData, navigate);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Add New Character Trait</h1>
      <p className='lead'>
        <i className='fas fa-user-circle' /> Add a character trait you want to develop or change
      </p>
      
      <div className='form-container bg-white p-2 my-2'>
        <form className='form' onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='trait'>Trait or Behavior to Change</label>
            <input
              type='text'
              name='trait'
              value={trait}
              onChange={onChange}
              placeholder='e.g., Procrastination, Impatience, Negative self-talk'
              required
            />
            <small className='form-text'>
              Identify a specific trait or behavior you want to change
            </small>
          </div>
          
          <div className='form-group'>
            <label htmlFor='description'>Description (Optional)</label>
            <textarea
              name='description'
              value={description}
              onChange={onChange}
              placeholder='Describe how this trait manifests in your life'
              rows='3'
            />
            <small className='form-text'>
              Provide details about how this trait affects you
            </small>
          </div>
          
          <div className='form-group'>
            <label htmlFor='alternative'>Alternative Behavior</label>
            <textarea
              name='alternative'
              value={alternative}
              onChange={onChange}
              placeholder='What would you like to do instead?'
              rows='3'
              required
            />
            <small className='form-text'>
              Describe the positive alternative behavior you want to develop
            </small>
          </div>
          
          <div className='form-actions'>
            <input type='submit' className='btn btn-primary' value='Add Character Trait' />
            <Link className='btn btn-light' to='/character'>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

CharacterForm.propTypes = {
  addCharacter: PropTypes.func.isRequired
};

export default connect(null, { addCharacter })(CharacterForm); 