import { React, useState, useEffect } from "react";
import { db } from "../../config/firebase-config";
import { getDocs, collectionGroup } from "firebase/firestore";

export default function Leaderboard() {
    let [scores, setScores] = useState([]);

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
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((el, i) => {
                        return (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{el.alias}</td>
                                <td>{el.date}</td>
                                <td>{el.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
