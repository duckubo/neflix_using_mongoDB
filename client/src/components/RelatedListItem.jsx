import axios from 'axios';
import React, { useEffect, useState } from 'react';

function RelatedListItem({ index, item, setSelectedMovie }) {
  const [movie, setMovie] = useState({});
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

    <div className='relatedlistItem'>
      <img src={movie.imageSmall} alt='Show Preview' onClick={() => setSelectedMovie(movie)} />
    </div>

  );
}

export default RelatedListItem;
