import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addStreak } from '../../actions/streak';

const StreakForm = ({ addStreak }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    streakType: '',
    customType: '',
    targetStreak: 30,
    currentStreak: 0,
    longestStreak: 0,
    notes: ''
  });

  const { streakType, customType, targetStreak, notes } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    
    // If custom type is selected, use the custom type value
    const finalFormData = {
      ...formData,
      streakType: streakType === 'custom' ? customType : streakType
    };
    
    addStreak(finalFormData, navigate);
  };

  // Predefined streak types
  const streakTypes = [
    { value: 'no-fast-food', label: 'No Fast Food' },
    { value: 'no-sugar', label: 'No Sugar' },
    { value: 'no-alcohol', label: 'No Alcohol' },
    { value: 'daily-exercise', label: 'Daily Exercise' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'reading', label: 'Reading' },
    { value: 'journaling', label: 'Journaling' },
    { value: 'custom', label: 'Custom...' }
  ];

  return (
    <section className='container'>
      <h1 className='large text-primary'>Add New Streak</h1>
      <p className='lead'>
        <i className='fas fa-fire' /> Start tracking a new daily streak
      </p>
      
      <div className='form-container bg-white p-2 my-2'>
        <form className='form' onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='streakType'>Streak Type</label>
            <select
              name='streakType'
              value={streakType}
              onChange={onChange}
              required
            >
              <option value=''>* Select Streak Type</option>
              {streakTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          {streakType === 'custom' && (
            <div className='form-group'>
              <label htmlFor='customType'>Custom Streak Name</label>
              <input
                type='text'
                placeholder='Enter custom streak name'
                name='customType'
                value={customType}
                onChange={onChange}
                required={streakType === 'custom'}
              />
            </div>
          )}
          
          <div className='form-group'>
            <label htmlFor='targetStreak'>Target Streak (days)</label>
            <input
              type='number'
              name='targetStreak'
              value={targetStreak}
              onChange={onChange}
              required
              min='1'
            />
            <small className='form-text'>
              Set a goal for how many consecutive days you want to maintain this streak
            </small>
          </div>
          
          <div className='form-group'>
            <label htmlFor='notes'>Initial Notes (optional)</label>
            <textarea
              name='notes'
              placeholder='Add any notes about this streak'
              value={notes}
              onChange={onChange}
              rows='3'
            />
          </div>
          
          <div className='form-actions'>
            <input type='submit' className='btn btn-primary' value='Start Streak' />
            <Link className='btn btn-light' to='/streaks'>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

StreakForm.propTypes = {
  addStreak: PropTypes.func.isRequired
};

export default connect(null, { addStreak })(StreakForm);