import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
export default function Widget({ item }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [movie, setMovie] = useState({});
    useEffect(() => {
        const getMovie = async () => {
            try {
                const res = await axios.get('/movies/find/' + item.movieId, {
                    headers: {
                        token:
                            'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
                    },
                });
                setMovie(res.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        getMovie();
    }, [item]);

    const getTimeAgo = (timestampStr) => {
        const timestamp = new Date(timestampStr);
        const now = new Date();
        const diffInMs = now - timestamp;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return 'Hôm nay';
        } else if (diffInDays === 1) {
            return 'Hôm qua';
        } else {
            return `${diffInDays} ngày trước`;
        }
    };
    // Hàm chuyển đổi chuỗi thời gian dạng "1h" hoặc "1h 30'" thành phút
    function convertToSeconds(timeString) {
        if (timeString.includes(' ')) {
            // Trường hợp có cả giờ và phút
            const [hours, minutes] = timeString.split(' ');
            const hourPart = parseInt(hours) * 60 * 60;
            const minutePart = minutes ? parseInt(minutes) * 60 : 0;
            return hourPart + minutePart;
        } else if (timeString.includes('h')) {
            // Trường hợp chỉ có phút
            return parseInt(timeString) * 60 * 60;
        } else if (timeString.includes('m')) {
            // Trường hợp chỉ có phút
            return parseInt(timeString) * 60;
        } else {
            return parseInt(timeString);
        }
    }

    // Hàm tính tỷ lệ phần trăm
    function calculatePercentage(time1, time2) {
        const time1Minutes = convertToSeconds(time1);
        const time2Minutes = convertToSeconds(time2);
        const percentage = (time1Minutes / time2Minutes) * 100;
        console.log(percentage);

        return percentage.toFixed(2);
    }
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Lỗi: {error}</p>;
    return (
        <div className="bg-card rounded-lg shadow-md">
            <h2 className="p-4 text-2xl font-bold text-foreground">{movie.title}</h2>
            <p className="px-4 pb-2 text-muted-foreground">{getTimeAgo(item.timestamp)}</p>
            <div className="item">
                <Link to='/watch' state={{
                    movie,
                    watchTimePercentage: item.watchTime && movie.duration
                        ? calculatePercentage(item.watchTime, movie.duration)
                        : 0 // Trả về 0 hoặc bất kỳ giá trị mặc định nào nếu không có dữ liệu
                }} style={{ textDecoration: 'none' }}>
                    <div>
                        <img src={movie.imageSmall} alt='Show Preview' />
                        <div className="progress-bar">
                            <div className="progress" style={{
                                width: (() => {
                                    if (item.watchTime && movie.duration) {
                                        return calculatePercentage(item.watchTime, movie.duration) + "%";
                                    } else {
                                        return "0%"; // Trả về 0% nếu dữ liệu không hợp lệ
                                    }
                                })(),
                            }}>
                            </div>
                        </div>
                    </div>

                </Link>
                <div>
                    <Link to='/watch' state={{ movie }} style={{ textDecoration: 'none', color: 'white' }}>
                        <h3 className="mt-2 text-xl font-semibold text-foreground">{movie.title}</h3>
                    </Link>
                    <br />
                    <p className="text-muted-foreground">{movie.description}</p>
                    <br />
                    <p className="text-muted-foreground">{movie.genre} | T{movie.limit}</p>
                    <br />
                    <span className="text-muted-foreground">⏳ {movie.duration}</span>
                </div>
            </div>
        </div>
    )
}
