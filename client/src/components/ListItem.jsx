import { PlayArrow } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ListItem({ index, item, setSelectedMovie }) {
  const [isHovered, setIsHovered] = useState(false);
  const [movie, setMovie] = useState({});
  const moveDistance = index * 240 + index * 8;

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get('/movies/find/' + item._id, {
          headers: {
            token:
              'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
          },
        });
        setMovie(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMovie();
  }, [item]);

  return (

    <div
      className='listItem'
      style={{ left: isHovered && moveDistance }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={movie.imageSmall} alt='Show Preview' />
      {isHovered && (
        <>
          <video
            src={movie.trailer}
            autoPlay
            muted
            loop
            onClick={() => setSelectedMovie(movie)}
          />
          <span className='title' onClick={() => setSelectedMovie(movie)} >{movie.title} </span>
          <div className='itemInfo'>
            <div className='icons'>
              <Link to='/watch' state={{ movie }}>
                <PlayArrow className='play' />
              </Link>
            </div>
            <div className='itemInfoTop'>
              <span className='bordered'>{movie.limit}+</span>
              <span className='duration'>{movie.duration}</span>
              <span className='bordered hd'>HD</span>
            </div>
            <div className='genre'>{movie.genre}</div>
          </div>
        </>
      )}
    </div>

  );
}

export default ListItem;
