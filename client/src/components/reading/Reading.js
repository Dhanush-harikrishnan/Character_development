import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getReadings } from '../../actions/reading';

const Reading = ({ getReadings, reading: { readings, loading } }) => {
  useEffect(() => {
    getReadings();
  }, [getReadings]);

  return (
    <section className='container'>
      <h1 className='large text-primary'>Reading Progress</h1>
      <p className='lead'>
        <i className='fas fa-book-reader' /> Track your reading progress
      </p>
      <Link to='/add-reading' className='btn btn-primary'>
        <i className='fas fa-plus' /> Add New Book
      </Link>
      <div className='readings'>
        {readings.map(reading => (
          <div key={reading._id} className='reading bg-white p-1 my-1'>
            <div>
              <h4>{reading.title}</h4>
              <p className='my-1'>{reading.author}</p>
              <p className='my-1'>Pages: {reading.currentPage} / {reading.totalPages}</p>
              <div className='progress'>
                <div
                  className='progress-bar'
                  style={{
                    width: `${(reading.currentPage / reading.totalPages) * 100}%`
                  }}
                />
              </div>
              <Link to={`/reading/${reading._id}`} className='btn btn-primary my-1'>
                Update Progress
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

Reading.propTypes = {
  getReadings: PropTypes.func.isRequired,
  reading: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  reading: state.reading
});

export default connect(mapStateToProps, { getReadings })(Reading);