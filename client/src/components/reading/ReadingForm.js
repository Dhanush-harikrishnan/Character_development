import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addReading } from '../../actions/reading';

const ReadingForm = ({ addReading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: '0'
  });

  const { title, author, totalPages, currentPage } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    addReading(formData, navigate);
  };

  return (
    <section className='container'>
      <h1 className='large text-primary'>Add New Book</h1>
      <p className='lead'>
        <i className='fas fa-book-reader' /> Add a new book to track your reading progress
      </p>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Book Title'
            name='title'
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Author'
            name='author'
            value={author}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Total Pages'
            name='totalPages'
            value={totalPages}
            onChange={onChange}
            required
            min='1'
          />
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Current Page'
            name='currentPage'
            value={currentPage}
            onChange={onChange}
            required
            min='0'
          />
        </div>
        <input type='submit' className='btn btn-primary my-1' value='Add Book' />
        <Link className='btn btn-light my-1' to='/reading'>
          Go Back
        </Link>
      </form>
    </section>
  );
};

ReadingForm.propTypes = {
  addReading: PropTypes.func.isRequired
};

export default connect(null, { addReading })(ReadingForm);