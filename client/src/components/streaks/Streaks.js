import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStreaks, deleteStreak } from '../../actions/streak';

const Streaks = ({ getStreaks, deleteStreak, streak: { streaks, loading } }) => {
  const [expandedStreak, setExpandedStreak] = useState(null);

  useEffect(() => {
    getStreaks();
  }, [getStreaks]);

  // Function to handle streak deletion
  const handleDeleteStreak = id => {
    if (window.confirm('Are you sure you want to delete this streak? This action cannot be undone.')) {
      deleteStreak(id);
    }
  };

  // Function to toggle expanded streak
  const toggleExpandStreak = (id) => {
    if (expandedStreak === id) {
      setExpandedStreak(null);
    } else {
      setExpandedStreak(id);
    }
  };

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

  // Calculate total active streaks and total streak days
  const activeStreaks = streaks.filter(streak => streak.active);
  const totalStreakDays = activeStreaks.reduce((total, streak) => total + streak.currentStreak, 0);

  return (
    <section className='container'>
      <div className="streak-controls my-2">
        <Link to='/add-streak' className='btn btn-primary'>
          <i className='fas fa-plus' /> Add New Streak
        </Link>
      </div>
      
      <div className='streaks-compact'>
        {streaks.length === 0 ? (
          <div className="alert alert-info my-2">
            <p>You haven't started any streaks yet. Add one to begin tracking!</p>
          </div>
        ) : (
          <div className="streak-list">
            {streaks.map(streak => (
              <div key={streak._id} className='streak-card-compact bg-white p-2 my-2'>
                <div className='streak-header-compact' onClick={() => toggleExpandStreak(streak._id)}>
                  <div className="streak-title-area">
                    <h3 className='text-primary'>{streak.streakType}</h3>
                    <div className="streak-quick-stats">
                      <span className="current-streak">
                        <i className="fas fa-fire text-danger"></i> {streak.currentStreak} days
                      </span>
                      <span className="longest-streak">
                        <i className="fas fa-trophy text-success"></i> {streak.longestStreak} days
                      </span>
                    </div>
                  </div>
                  <div className="streak-expand-icon">
                    <i className={`fas fa-chevron-${expandedStreak === streak._id ? 'up' : 'down'}`}></i>
                  </div>
                </div>
                
                {expandedStreak === streak._id && (
                  <div className="streak-expanded-content">
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
                      <button 
                        onClick={() => handleDeleteStreak(streak._id)}
                        className='btn btn-danger'
                      >
                        <i className='fas fa-trash'></i> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

Streaks.propTypes = {
  getStreaks: PropTypes.func.isRequired,
  deleteStreak: PropTypes.func.isRequired,
  streak: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  streak: state.streak
});

export default connect(mapStateToProps, { getStreaks, deleteStreak })(Streaks);