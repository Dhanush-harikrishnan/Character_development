import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import { getStreaks } from '../../actions/streak';
import { getCharacters } from '../../actions/character';
import { getReadings } from '../../actions/reading';

const Dashboard = ({
  getCurrentProfile,
  getStreaks,
  getCharacters,
  getReadings,
  auth: { user },
  profile: { profile, loading: profileLoading },
  streak: { streaks, loading: streakLoading },
  character: { characters, loading: characterLoading },
  reading: { readings, loading: readingLoading }
}) => {
  useEffect(() => {
    getCurrentProfile();
    getStreaks();
    getCharacters();
    getReadings();
  }, [getCurrentProfile, getStreaks, getCharacters, getReadings]);

  // Get active streaks
  const activeStreaks = streaks.filter(streak => streak.active);
  
  // Get total streak days
  const totalStreakDays = activeStreaks.reduce((total, streak) => total + streak.currentStreak, 0);
  
  // Get completed character traits
  const completedCharacters = characters.filter(character => character.completed);
  
  // Get reading progress
  const totalBooks = readings.length;
  const completedBooks = readings.filter(reading => reading.status === 'completed').length;

  return (
    <section className='container'>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.name}
      </p>
      
      {profile !== null ? (
        <>
          {/* Stats Overview */}
          <div className='dashboard-stats-grid'>
            <div className='dashboard-stat-card'>
              <div className='stat-icon'>
                <i className='fas fa-fire text-danger'></i>
              </div>
              <div className='stat-content'>
                <h3>{activeStreaks.length}</h3>
                <p>Active Streaks</p>
              </div>
              <div className='stat-footer'>
                <span>{totalStreakDays} total days</span>
              </div>
            </div>
            
            <div className='dashboard-stat-card'>
              <div className='stat-icon'>
                <i className='fas fa-user-circle text-primary'></i>
              </div>
              <div className='stat-content'>
                <h3>{completedCharacters.length}/{characters.length}</h3>
                <p>Character Traits</p>
              </div>
              <div className='stat-footer'>
                <span>{Math.round((completedCharacters.length / (characters.length || 1)) * 100)}% completed</span>
              </div>
            </div>
            
            <div className='dashboard-stat-card'>
              <div className='stat-icon'>
                <i className='fas fa-book-reader text-success'></i>
              </div>
              <div className='stat-content'>
                <h3>{completedBooks}/{totalBooks}</h3>
                <p>Books</p>
              </div>
              <div className='stat-footer'>
                <span>{Math.round((completedBooks / (totalBooks || 1)) * 100)}% completed</span>
              </div>
            </div>
          </div>
          
          {/* Main Dashboard Grid */}
          <div className='dashboard-grid'>
            {/* Streak Summary */}
            <div className='dashboard-card'>
              <div className='dashboard-card-header'>
                <h2 className='text-dark'>
                  <i className='fas fa-fire text-danger'></i> Streaks
                </h2>
                <div className='dashboard-card-actions'>
                  <Link to='/streaks' className='btn btn-sm btn-primary'>
                    View All
                  </Link>
                  <Link to='/add-streak' className='btn btn-sm btn-light'>
                    <i className='fas fa-plus'></i>
                  </Link>
                </div>
              </div>
              
              <div className='dashboard-card-content'>
                {activeStreaks.length > 0 ? (
                  <div className='streak-summary-grid'>
                    {activeStreaks.slice(0, 3).map(streak => (
                      <div key={streak._id} className='streak-summary-card'>
                        <h3>{streak.streakType}</h3>
                        <div className='streak-summary-stats'>
                          <div className='summary-stat'>
                            <span className='summary-stat-value'>{streak.currentStreak}</span>
                            <span className='summary-stat-label'>Current</span>
                          </div>
                          <div className='summary-stat'>
                            <span className='summary-stat-value'>{streak.longestStreak}</span>
                            <span className='summary-stat-label'>Longest</span>
                          </div>
                        </div>
                        <Link to={`/streak/${streak._id}`} className='btn btn-sm btn-primary'>
                          Check In
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='dashboard-empty-state'>You haven't started any streaks yet.</p>
                )}
              </div>
            </div>
            
            {/* Character Development Summary */}
            <div className='dashboard-card'>
              <div className='dashboard-card-header'>
                <h2 className='text-dark'>
                  <i className='fas fa-user-circle text-primary'></i> Character
                </h2>
                <div className='dashboard-card-actions'>
                  <Link to='/character' className='btn btn-sm btn-primary'>
                    View All
                  </Link>
                  <Link to='/add-character' className='btn btn-sm btn-light'>
                    <i className='fas fa-plus'></i>
                  </Link>
                </div>
              </div>
              
              <div className='dashboard-card-content'>
                {characters.length > 0 ? (
                  <div className='character-summary-grid'>
                    {characters.slice(0, 3).map(character => (
                      <div key={character._id} className={`character-summary-card ${character.completed ? 'completed' : ''}`}>
                        <h3>{character.trait}</h3>
                        <div className='character-alternative-summary'>
                          <p>{character.alternative.substring(0, 60)}...</p>
                        </div>
                        <div className='character-status'>
                          <span className={`status-badge ${character.completed ? 'status-completed' : 'status-in-progress'}`}>
                            {character.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='dashboard-empty-state'>You haven't added any character traits yet.</p>
                )}
              </div>
            </div>
            
            {/* Reading Progress Summary */}
            <div className='dashboard-card'>
              <div className='dashboard-card-header'>
                <h2 className='text-dark'>
                  <i className='fas fa-book-reader text-success'></i> Reading
                </h2>
                <div className='dashboard-card-actions'>
                  <Link to='/reading' className='btn btn-sm btn-primary'>
                    View All
                  </Link>
                  <Link to='/add-reading' className='btn btn-sm btn-light'>
                    <i className='fas fa-plus'></i>
                  </Link>
                </div>
              </div>
              
              <div className='dashboard-card-content'>
                {readings.length > 0 ? (
                  <div className='reading-summary-grid'>
                    {readings.slice(0, 3).map(reading => (
                      <div key={reading._id} className='reading-summary-card'>
                        <h3>{reading.title}</h3>
                        <p className='reading-author'>{reading.author}</p>
                        <div className='reading-progress-bar'>
                          <div 
                            className='reading-progress-fill'
                            style={{ width: `${(reading.currentPage / (reading.totalPages || 1)) * 100}%` }}
                          ></div>
                        </div>
                        <div className='reading-progress-stats'>
                          <span>{reading.currentPage} / {reading.totalPages} pages</span>
                          <span>{Math.round((reading.currentPage / (reading.totalPages || 1)) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='dashboard-empty-state'>You haven't added any books yet.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className='dashboard-footer'>
            <Link to='/edit-profile' className='btn btn-light'>
              <i className='fas fa-user-circle text-primary'></i> Edit Profile
            </Link>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </>
      )}
    </section>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getStreaks: PropTypes.func.isRequired,
  getCharacters: PropTypes.func.isRequired,
  getReadings: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  streak: PropTypes.object.isRequired,
  character: PropTypes.object.isRequired,
  reading: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  streak: state.streak,
  character: state.character,
  reading: state.reading
});

export default connect(mapStateToProps, { 
  getCurrentProfile, 
  getStreaks, 
  getCharacters,
  getReadings
})(Dashboard);