import { React, useState, useEffect } from "react";
import { db } from "../../config/firebase-config";
import { getDocs, collectionGroup } from "firebase/firestore";

import Spinner from "react-bootstrap/Spinner";

export default function Leaderboard() {
    let [scores, setScores] = useState([]);
    let [tableHeight, setTableHeight] = useState();
    let [loading, setLoading] = useState(false);

    useEffect(() => {
        getAllScores();
    }, []);

    // Get all scores from each user
    const getAllScores = async () => {
        const q = collectionGroup(db, "scores");
        const querySnapshot = await getDocs(q);

        let arr = [];

        querySnapshot.forEach((doc) => {
            arr.push(doc.data());
        });

        // Sort the array of scores by order of each score
        arr.sort(function (a, b) {
            return parseFloat(b.score) - parseFloat(a.score);
        });

        setScores([...arr]);

        setLoading(true);

        // Set the height of the table
        setTableHeight(document.querySelector("table").offsetHeight);
    };

    return (
        <div>
            {loading ? (
                <table style={{ height: tableHeight }}>
                    <thead>
                        <tr>
                            <th colSpan="4">Top 10</th>
                        </tr>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((el, i) => {
                            if (i <= 9) {
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{el.alias}</td>
                                        <td>{el.date}</td>
                                        <td>{el.score}</td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
            ) : (
                <Spinner className="loading-spinner" animation="border" role="status"></Spinner>
            )}
        </div>
    );
}
