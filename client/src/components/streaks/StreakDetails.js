import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getStreakById } from '../../actions/streak';

const StreakDetails = ({ getStreakById, streak: { streak, loading } }) => {
  const { id } = useParams();

  useEffect(() => {
    getStreakById(id);
  }, [getStreakById, id]);

  // Function to generate streak calendar for all history
  const generateFullStreakCalendar = (streak) => {
    if (!streak || !streak.startDate) return [];
    
    const startDate = new Date(streak.startDate);
    const today = new Date();
    const days = [];
    
    // Calculate total days since start
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Generate all days since start date
    for (let i = 0; i <= diffDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
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

  // Group days by month for better visualization
  const groupByMonth = (days) => {
    const months = {};
    
    days.forEach(day => {
      const monthYear = `${day.date.toLocaleString('default', { month: 'long' })} ${day.date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = [];
      }
      
      months[monthYear].push(day);
    });
    
    return months;
  };

  return (
    <section className='container'>
      <Link to='/streaks' className='btn btn-light'>
        <i className='fas fa-arrow-left'></i> Back to Streaks
      </Link>
      
      {streak && (
        <div className='streak-details bg-white p-2 my-2'>
          <div className='streak-header'>
            <h1 className='large text-primary'>{streak.streakType}</h1>
            <div className='streak-meta'>
              <p>
                <i className='fas fa-calendar'></i> Started on {new Date(streak.startDate).toLocaleDateString()}
              </p>
              <p>
                <i className='fas fa-fire'></i> Current Streak: <span className='text-primary'>{streak.currentStreak} days</span>
              </p>
              <p>
                <i className='fas fa-trophy'></i> Longest Streak: <span className='text-success'>{streak.longestStreak} days</span>
              </p>
            </div>
          </div>
          
          <div className='streak-actions my-2'>
            <Link to={`/streak/${streak._id}`} className='btn btn-primary'>
              <i className='fas fa-check-circle'></i> Check In Today
            </Link>
          </div>
          
          <div className='streak-history'>
            <h2 className='text-dark'>Streak History</h2>
            
            {Object.entries(groupByMonth(generateFullStreakCalendar(streak))).map(([monthYear, days]) => (
              <div key={monthYear} className='month-calendar'>
                <h3 className='month-title'>{monthYear}</h3>
                <div className='calendar-grid'>
                  {/* Add day labels */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className='day-label'>{day}</div>
                  ))}
                  
                  {/* Add empty cells for proper alignment */}
                  {Array.from({ length: days[0].date.getDay() }).map((_, index) => (
                    <div key={`empty-${index}`} className='calendar-day empty'></div>
                  ))}
                  
                  {/* Add days */}
                  {days.map((day, index) => (
                    <div 
                      key={index} 
                      className={`calendar-day ${day.completed ? 'completed' : 'missed'} ${day.date.toDateString() === new Date().toDateString() ? 'today' : ''}`}
                      title={day.notes || day.date.toLocaleDateString()}
                    >
                      <span className='day-number'>{day.date.getDate()}</span>
                      {day.notes && <i className='fas fa-sticky-note notes-icon'></i>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className='streak-notes my-2'>
            <h2 className='text-dark'>Recent Notes</h2>
            {streak.streakHistory && streak.streakHistory.length > 0 ? (
              <div className='notes-list'>
                {streak.streakHistory
                  .filter(entry => entry.notes && entry.notes.trim() !== '')
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((entry, index) => (
                    <div key={index} className='note-card'>
                      <div className='note-date'>
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <div className='note-content'>
                        {entry.notes}
                      </div>
                      <div className={`note-status ${entry.completed ? 'completed' : 'missed'}`}>
                        {entry.completed ? 'Completed' : 'Missed'}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p>No notes recorded yet.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

StreakDetails.propTypes = {
  getStreakById: PropTypes.func.isRequired,
  streak: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  streak: state.streak
});

export default connect(mapStateToProps, { getStreakById })(StreakDetails); 