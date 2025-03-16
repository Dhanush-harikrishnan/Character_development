import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { updateReading } from '../../actions/reading';
import { setAlert } from '../../actions/alert';

const ReadingProgress = ({ updateReading, setAlert }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    pagesRead: '',
    notes: ''
  });

  const { pagesRead, notes } = formData;

  useEffect(() => {
    const fetchReading = async () => {
      try {
        const res = await axios.get(`/api/reading/${id}`);
        setReading(res.data);
        setLoading(false);
      } catch (err) {
        setAlert('Error fetching reading data', 'danger');
        navigate('/reading');
      }
    };

    fetchReading();
  }, [id, navigate, setAlert]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!pagesRead || parseInt(pagesRead) <= 0) {
      setAlert('Please enter a valid number of pages read', 'danger');
      return;
    }

    try {
      // Log reading progress
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const body = { pagesRead, notes };
      await axios.put(`/api/reading/log/${id}`, body, config);
      
      // Update the reading with new total pages
      const updatedReading = {
        ...reading,
        currentPage: reading.currentPage + parseInt(pagesRead)
      };
      
      updateReading(id, updatedReading, navigate);
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach(error => setAlert(error.msg, 'danger'));
      } else {
        setAlert('Error updating reading progress', 'danger');
      }
    }
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Update Reading Progress</h1>
      <p className='lead'>
        <i className='fas fa-book-reader' /> Log your daily reading progress
      </p>

      {loading || !reading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className='reading-info bg-light p-2 my-2'>
            <h2>{reading.title}</h2>
            <p>
              <strong>Author:</strong> {reading.author}
            </p>
            <p>
              <strong>Current Progress:</strong> {reading.currentPage} / {reading.totalPages} pages
              ({Math.round((reading.currentPage / reading.totalPages) * 100)}%)
            </p>
            <div className='progress'>
              <div
                className='progress-bar'
                style={{
                  width: `${(reading.currentPage / reading.totalPages) * 100}%`
                }}
              />
            </div>
          </div>

          <form className='form' onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='pagesRead'>Pages Read Today</label>
              <input
                type='number'
                name='pagesRead'
                value={pagesRead}
                onChange={onChange}
                required
                min='1'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='notes'>Notes (Optional)</label>
              <textarea
                name='notes'
                value={notes}
                onChange={onChange}
                placeholder="Any thoughts or reflections on today's reading?"
                rows='3'
              />
            </div>
            <input type='submit' className='btn btn-primary my-1' value='Log Progress' />
            <Link className='btn btn-light my-1' to='/reading'>
              Go Back
            </Link>
          </form>
        </>
      )}
    </section>
  );
};

ReadingProgress.propTypes = {
  updateReading: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { updateReading, setAlert })(ReadingProgress); 