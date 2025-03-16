import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStreaks } from '../../actions/streak';

const Streaks = ({ getStreaks, streak: { streaks, loading } }) => {
  useEffect(() => {
    getStreaks();
  }, [getStreaks]);

  // Function to generate streak calendar
  const generateStreakCalendar = (streak) => {
    const today = new Date();
    const days = [];
    
    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Check if this date exists in streak history
      const historyEntry = streak.streakHistory && streak.streakHistory.find(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === date.toDateString();
      });
      
      days.push({
        date,
        completed: historyEntry ? historyEntry.completed : false,
        notes: historyEntry ? historyEntry.notes : ''
      });
    }
    
    return days;
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Streak Tracking</h1>
      <p className='lead'>
        <i className='fas fa-fire' /> Track your daily streaks
      </p>
      <Link to='/add-streak' className='btn btn-primary'>
        <i className='fas fa-plus' /> Add New Streak
      </Link>
      
      <div className='streaks'>
        {streaks.length === 0 ? (
          <div className="alert alert-info my-2">
            <p>You haven't started any streaks yet. Add one to begin tracking!</p>
          </div>
        ) : (
          streaks.map(streak => (
            <div key={streak._id} className='streak-card bg-white p-2 my-2'>
              <div className='streak-header'>
                <h3 className='text-primary'>{streak.streakType}</h3>
                <div className='streak-stats'>
                  <div className='stat'>
                    <span className='stat-label'>Current Streak:</span>
                    <span className='stat-value'>{streak.currentStreak} days</span>
                  </div>
                  <div className='stat'>
                    <span className='stat-label'>Longest Streak:</span>
                    <span className='stat-value'>{streak.longestStreak} days</span>
                  </div>
                  <div className='stat'>
                    <span className='stat-label'>Started:</span>
                    <span className='stat-value'>{new Date(streak.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className='streak-calendar'>
                <h4 className='text-dark my-1'>Last 30 Days</h4>
                <div className='calendar-grid'>
                  {generateStreakCalendar(streak).map((day, index) => (
                    <div 
                      key={index} 
                      className={`calendar-day ${day.completed ? 'completed' : ''} ${day.date.toDateString() === new Date().toDateString() ? 'today' : ''}`}
                      title={day.notes || day.date.toLocaleDateString()}
                    >
                      <span className='day-number'>{day.date.getDate()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className='streak-actions my-1'>
                <Link to={`/streak/${streak._id}`} className='btn btn-primary'>
                  <i className='fas fa-check-circle'></i> Check In
                </Link>
                <Link to={`/streak-details/${streak._id}`} className='btn btn-light'>
                  <i className='fas fa-info-circle'></i> Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

Streaks.propTypes = {
  getStreaks: PropTypes.func.isRequired,
  streak: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  streak: state.streak
});

export default connect(mapStateToProps, { getStreaks })(Streaks);