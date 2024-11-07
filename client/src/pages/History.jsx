import React, { useEffect, useState } from 'react';
import historyData from '../components/data';
import Navbar from '../components/Navbar';
import Widget from '../components/Widget';
import axios from 'axios';
const History = () => {
    const [histories, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('user'))._id; // Lấy userId từ localStorage
                console.log(userId);

                if (!userId) {
                    return;
                }
                const response = await axios.get(`history`, {
                    headers: {
                        token: 'Bearer ' + JSON.parse(localStorage.getItem('user')).accessToken,
                        userid: userId
                    },
                });
                setHistory(response.data);
            } catch (err) {
            }
        };

        fetchHistory();
    }, []);

    return (

        <div className="history">
            <Navbar />
            <main className="history_content" >
                <div>
                    <h1>History</h1>
                    {histories.map((item) => (
                        <Widget key={item._id} item={item} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default History;
