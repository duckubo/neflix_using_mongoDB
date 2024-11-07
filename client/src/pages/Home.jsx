import { useEffect, useState } from 'react';
import Featured from '../components/Featured';
import List from '../components/List';
import RelatedList from '../components/RelatedList';
import Navbar from '../components/Navbar';
import axios from 'axios';

function Home({ type }) {
  const [lists, setLists] = useState([]);
  const [relatedlists, setRelatedLists] = useState([]);
  const [genre, setGenre] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null); // Quản lý selectedMovie tại Home
  useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `lists${type ? '?type=' + type : ''}${type && genre ? '&genre=' + genre : ''
          }`,
          {
            headers: {
              token:
                'Bearer ' +
                JSON.parse(localStorage.getItem('user')).accessToken,
            },
          }
        );
        setLists(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const getRelatedLists = async () => {
      try {
        // Xây dựng URL với điều kiện genre
        const url = `/movies${type && type !== 'undefined' ? '?type=' + type : ''}${type && genre ? '&genre=' + genre : ''}`;

        const res = await axios.get(url, {
          headers: {
            token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
          },
        });

        if (res.data && res.data.length > 0) {
          setRelatedLists(res.data);
        } else {
          console.log("Không có phim nào được tìm thấy.");
        }
      } catch (err) {
        console.log(err);
      }
    };
    getRelatedLists(); // Gọi hàm nếu type có giá trị
    getRandomLists();
  }, [type, genre]);
  console.log(relatedlists)
  return (
    <div className='home'>
      <Navbar />
      <Featured type={type} genre={genre} setGenre={setGenre} selectedMovie={selectedMovie} />
      <RelatedList key={relatedlists._id} relatedlists={relatedlists} setSelectedMovie={setSelectedMovie} />
      {lists.map((list) => (
        <List key={list._id} list={list} setSelectedMovie={setSelectedMovie} />
      ))}
    </div>
  );
}

export default Home;
