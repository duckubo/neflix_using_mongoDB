import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from '@mui/icons-material';
import React, { useRef, useState } from 'react';
import RelatedListItem from './RelatedListItem';

function List({ relatedlists, setSelectedMovie }) {

  const listRef = useRef();


  return (
    <div className='list'>
      <span className='listTitle'>More Like This</span>
      <div className='wrapper'>

        <div className='container related' ref={listRef}>
          {relatedlists.map((item, i) => (
            <RelatedListItem key={i} index={i} item={item} setSelectedMovie={setSelectedMovie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default List;
