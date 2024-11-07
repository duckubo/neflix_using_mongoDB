import { ArrowBackOutlined } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
function Watch() {
  const location = useLocation();
  const { movie, watchTimePercentage } = location.state; // Nhận cả hai tham số
  const videoRef = useRef(null);
  const [watchTime, setWatchTime] = useState(0); // Thời gian đã xem


  const handleEnded = () => {
    console.log('Video đã kết thúc.');
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      console.log("duration:" + duration);
      setWatchTime(duration)
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (watchTimePercentage !== undefined && watchTimePercentage !== null) {
        videoRef.current.currentTime = duration * (watchTimePercentage / 100); // Đặt video phát từ điểm 50%
      } else {
        console.log("Watch time percentage: Không có thông tin");
      }
    }
  };
  const handlePause = () => {
    const currentTime = videoRef.current.currentTime; // Lấy thời gian hiện tại khi video tạm dừng
    setWatchTime(currentTime); // Cập nhật thời gian đã xem
    console.log('Video đã tạm dừng tại:', currentTime);
    saveWatchHistory(); // Lưu lịch sử xem
  };
  const saveWatchHistory = useCallback(async () => {
    const userId = JSON.parse(localStorage.getItem('user'))._id;
    const movieId = movie._id;
    const timeWatched = `${Math.floor(watchTime)}s`;
    console.log(userId + ' ' + movieId + ' ' + timeWatched);

    try {
      await axios.post('history/watch', {
        userId,
        movieId,
        watchTime: timeWatched,
      }, {
        headers: {
          token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken // Gửi token xác thực
        }
      });
      console.log('Lịch sử xem đã được lưu.');
    } catch (error) {
      console.error('Lỗi khi lưu lịch sử xem:', error);
    }
  }, [movie._id, watchTime]);
  useEffect(() => {
    if (watchTime > 0) {
      console.log("Updated watchTime:", watchTime);
      saveWatchHistory(); // Chỉ lưu lịch sử sau khi watchTime cập nhật
    }
  }, [watchTime, saveWatchHistory]);

  return (
    <div className='watch'>
      <Link to='/'>
        <div className='back'>
          <ArrowBackOutlined />
        </div>
      </Link>
      <video
        ref={videoRef}
        src={movie.video}
        className='video'
        autoPlay
        progress='true'
        controls
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded} // Gọi hàm khi video kết thúc
      ></video>
    </div>
  );
}

export default Watch;
