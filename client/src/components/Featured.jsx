import { PlayArrow } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Featured({ type, setGenre, genre, selectedMovie }) { // Thêm genre vào tham số
  const [movie, setMovie] = useState({});
  useEffect(() => {
    if (!selectedMovie) {
      const getRandomMovie = async () => {
        try {
          // Xây dựng URL với điều kiện genre
          const url = `/movies/random${type && type !== 'undefined' ? '?type=' + type : ''}${type && genre ? '&genre=' + genre : ''}`;

          const res = await axios.get(url, {
            headers: {
              token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
            },
          });

          if (res.data && res.data.length > 0) {
            setMovie(res.data[0]);
          } else {
            console.log("Không có phim nào được tìm thấy.");
          }
        } catch (err) {
          console.log(err);
        }
      };
      getRandomMovie(); // Gọi hàm nếu type có giá trị
    }
    else {
      setMovie(selectedMovie);
    }
  }, [type, genre, selectedMovie]); // Thêm genre vào mảng phụ thuộc
  return (
    <div className='featured'>
      {type && (
        <div className='category'>
          <span className='featuredMovieType'>
            {type === 'movie' ? 'Movies' : 'TV Shows'}
          </span>
          <select
            name='genre'
            id='genre'
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value=''>Genres</option>
            <option value='Action'>Action</option>
            <option value='Anime'>Anime</option>
            <option value='Comedy'>Comedy</option>
            <option value='Crime'>Crime</option>
            <option value='Documentary'>Documentary</option>
            <option value='Drama'>Drama</option>
            <option value='Fantasy'>Fantasy</option>
            <option value='Horror'>Horror</option>
            <option value='Romance'>Romance</option>
            <option value='Thriller'>Thriller</option>
            <option value='Sci-Fi'>Science-Fiction</option>
          </select>
        </div>
      )}
      {movie.image && <img src={movie.image} alt='Featured Header' className='featured-header' />}
      <div className='info'>
        <img src={movie.imageTitle} alt='Featured Title' className='featured-title' />
        <span className='title'>{movie.title}</span>
        <div className="title-info-metadata-wrapper" data-uia="title-info-metadata-wrapper">
          <span className="title-info-metadata-item item-year" data-uia="item-year">{movie.year}</span>
          <span role="presentation" className="info-spacer"> | </span>
          <span className="title-info-metadata-item item-maturity" data-uia="item-maturity">
            <span className="maturity-rating">
              <span className="maturity-number">T{movie.limit}</span>
            </span>
          </span>
          <span role="presentation" className="info-spacer"> | </span>
          <span className="title-info-metadata-item item-runtime" data-uia="item-runtime">
            <span className="duration">{movie.duration}</span>
          </span>
          <span role="presentation" className="info-spacer"> | </span>
          <span className="title-info-metadata-item item-genre" data-uia="item-genre">{movie.genre}</span>
        </div>
        <span className='description'>{movie.description}</span>
        <span className='description'> <span className='sub_description'>Starring:</span> {movie.starring}</span>
        <div className='buttons'>
          <Link to='/watch' state={{ movie }} style={{ textDecoration: 'none' }}>
            <button className='play'>
              <PlayArrow className='feat-icon' />
              <span>Play</span>
            </button>
          </Link>
          <span className='age-rating'>{movie.limit}+</span>
        </div>
      </div>
    </div>
  );
}

export default Featured;
