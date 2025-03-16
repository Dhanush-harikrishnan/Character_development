import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProfile } from '../../actions/profile';

const CreateProfile = ({ createProfile }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '',
    goals: '',
    characterTraits: '',
    twitter: '',
    instagram: '',
    facebook: ''
  });

  const { bio, goals, characterTraits, twitter, instagram, facebook } = formData;
  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, navigate);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Create Your Profile</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Add some information to your profile
      </p>
      <small className='form-text'>* = required field</small>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <textarea
            placeholder='A short bio of yourself'
            name='bio'
            value={bio}
            onChange={onChange}
          />
          <small className='form-text'>Tell us a little about yourself</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Goals'
            name='goals'
            value={goals}
            onChange={onChange}
            required
          />
          <small className='form-text'>
            Please use comma separated values (eg. Learn coding, Exercise daily, Read more)
          </small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Character Traits'
            name='characterTraits'
            value={characterTraits}
            onChange={onChange}
            required
          />
          <small className='form-text'>
            Please use comma separated values (eg. Disciplined, Patient, Persistent)
          </small>
        </div>

        <div className='my-2'>
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type='button'
            className='btn btn-light'
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>

        {displaySocialInputs && (
          <>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x' />
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-facebook fa-2x' />
              <input
                type='text'
                placeholder='Facebook URL'
                name='facebook'
                value={facebook}
                onChange={onChange}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x' />
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                value={instagram}
                onChange={onChange}
              />
            </div>
          </>
        )}

        <input type='submit' className='btn btn-primary my-1' value='Create Profile' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </section>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired
};

export default connect(null, { createProfile })(CreateProfile);