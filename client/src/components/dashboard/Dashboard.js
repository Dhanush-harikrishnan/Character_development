import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import { getStreaks } from '../../actions/streak';
import { getCharacters } from '../../actions/character';

const Dashboard = ({
  getCurrentProfile,
  getStreaks,
  getCharacters,
  auth: { user },
  profile: { profile, loading: profileLoading },
  streak: { streaks, loading: streakLoading },
  character: { characters, loading: characterLoading }
}) => {
  useEffect(() => {
    getCurrentProfile();
    getStreaks();
    getCharacters();
  }, [getCurrentProfile, getStreaks, getCharacters]);

  // Get active streaks
  const activeStreaks = streaks.filter(streak => streak.active);

  // Get streaks with current streak > 0
  const ongoingStreaks = activeStreaks.filter(streak => streak.currentStreak > 0);

  // Get completed character traits
  const completedCharacters = characters.filter(character => character.completed);

  return (
    <section className='container'>
      <h1 className='large text-primary'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <>
          <div className='dash-buttons'>
            <Link to='/edit-profile' className='btn btn-light'>
              <i className='fas fa-user-circle text-primary' /> Edit Profile
            </Link>
          </div>
          
          {/* Streak Summary */}
          <div className='streak-summary my-2'>
            <h2 className='text-dark'>Your Streaks</h2>
            
            {activeStreaks.length > 0 ? (
              <div className='streak-summary-grid'>
                {activeStreaks.map(streak => (
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
              <p>You haven't started any streaks yet.</p>
            )}
            
            <div className='streak-actions my-1'>
              <Link to='/streaks' className='btn btn-primary'>
                <i className='fas fa-fire' /> View All Streaks
              </Link>
              <Link to='/add-streak' className='btn btn-light'>
                <i className='fas fa-plus' /> Add New Streak
              </Link>
            </div>
          </div>
          
          {/* Character Development Summary */}
          <div className='character-summary my-2'>
            <h2 className='text-dark'>Character Development</h2>
            
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
              <p>You haven't added any character traits yet.</p>
            )}
            
            <div className='character-actions my-1'>
              <Link to='/character' className='btn btn-primary'>
                <i className='fas fa-user-circle' /> View Character Development
              </Link>
              <Link to='/add-character' className='btn btn-light'>
                <i className='fas fa-plus' /> Add New Trait
              </Link>
            </div>
          </div>
          
          <div className='my-2'>
            <Link to='/reading' className='btn btn-primary'>
              <i className='fas fa-book-reader' /> Reading Progress
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
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  streak: PropTypes.object.isRequired,
  character: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  streak: state.streak,
  character: state.character
});

export default connect(mapStateToProps, { getCurrentProfile, getStreaks, getCharacters })(Dashboard);