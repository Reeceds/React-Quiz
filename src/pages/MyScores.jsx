import { React, useState, useEffect } from "react";
import { auth, db } from "../config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
} from "firebase/firestore";

export default function MyScores() {
    let [scores, setScores] = useState([]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                getScores(user.uid)
            }
        });
    }, []);

    // Gets all scores of the logged in user
    const getScores = async (userId) => {

        let docId;

        const q = query(collection(db, "users"), where("id", "==", userId));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
            docId = doc.id;
        });

        const docRef = doc(db, "users", docId);
        const userScores = await getDocs(collection(docRef, 'scores'))
        
        let arr = [];

        userScores.forEach((doc) => {
            console.log(doc.data())
            arr.push(doc.data());
            setScores([...arr]);
        });
        
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((el, i) => {
                        return(
                            <tr key={i}>
                                <td>{el.date}</td>
                                <td>{el.score}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}
