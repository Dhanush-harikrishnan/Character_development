import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getReadings, deleteReading } from '../../actions/reading';

const Reading = ({ getReadings, deleteReading, reading: { readings, loading } }) => {
  useEffect(() => {
    getReadings();
  }, [getReadings]);

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteReading(id);
    }
  };

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
        {readings.length === 0 ? (
          <div className='alert alert-info my-2'>
            <p>You haven't added any books yet. Add one to begin tracking!</p>
          </div>
        ) : (
          readings.map(reading => (
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
                <div className='reading-actions my-1'>
                  <Link to={`/reading/${reading._id}`} className='btn btn-primary'>
                    <i className='fas fa-book-open'></i> Update Progress
                  </Link>
                  <button 
                    onClick={() => handleDelete(reading._id)}
                    className='btn btn-danger'
                  >
                    <i className='fas fa-trash'></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

Reading.propTypes = {
  getReadings: PropTypes.func.isRequired,
  deleteReading: PropTypes.func.isRequired,
  reading: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  reading: state.reading
});

export default connect(mapStateToProps, { getReadings, deleteReading })(Reading);