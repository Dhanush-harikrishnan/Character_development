import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStreakById, updateStreak } from '../../actions/streak';

const StreakCheckIn = ({ 
  getStreakById, 
  updateStreak, 
  streak: { streak, loading } 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    completed: true,
    notes: ''
  });

  useEffect(() => {
    getStreakById(id);
  }, [getStreakById, id]);

  const { completed, notes } = formData;

  const onChange = e => {
    if (e.target.name === 'completed') {
      setFormData({ ...formData, completed: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    
    // Create check-in data
    const checkInData = {
      streakHistory: {
        date: new Date(),
        completed,
        notes
      }
    };
    
    updateStreak(id, checkInData, navigate);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Daily Check-In</h1>
      {streak && (
        <div className='streak-check-in bg-white p-2 my-2'>
          <h2 className='text-dark'>{streak.streakType}</h2>
          <p className='lead'>
            <i className='fas fa-calendar-check'></i> Record your progress for today
          </p>
          
          <div className='streak-stats my-2'>
            <div className='stat'>
              <span className='stat-label'>Current Streak:</span>
              <span className='stat-value'>{streak.currentStreak} days</span>
            </div>
            <div className='stat'>
              <span className='stat-label'>Longest Streak:</span>
              <span className='stat-value'>{streak.longestStreak} days</span>
            </div>
          </div>
          
          <form className='form' onSubmit={onSubmit}>
            <div className='form-group check-group'>
              <input
                type='checkbox'
                name='completed'
                id='completed'
                checked={completed}
                onChange={onChange}
              />
              <label htmlFor='completed'>I completed this today</label>
            </div>
            
            <div className='form-group'>
              <textarea
                name='notes'
                placeholder='Add any notes about today (optional)'
                value={notes}
                onChange={onChange}
                rows='3'
              />
            </div>
            
            <div className='form-actions'>
              <input type='submit' className='btn btn-primary' value='Submit Check-In' />
              <Link className='btn btn-light' to='/streaks'>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

StreakCheckIn.propTypes = {
  getStreakById: PropTypes.func.isRequired,
  updateStreak: PropTypes.func.isRequired,
  streak: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  streak: state.streak
});

export default connect(mapStateToProps, { getStreakById, updateStreak })(StreakCheckIn); 