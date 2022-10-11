import { React, useState, useEffect } from "react";
import "./Quiz.scss";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import AnswerButton from "../../components/AnswerButton/AnswerButton";

import Spinner from "react-bootstrap/Spinner";

import { auth, provider, db } from "../../config/firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";

export default function Quiz() {
    let [data, setData] = useState([]);
    let [runApi, setRunApi] = useState(true);

    let [queNum, setQueNum] = useState(0);
    let [currentQuestion, setCurrentQuestion] = useState();
    let [correctAnswer, setCorrectAnswer] = useState();
    let [answers, setAnswers] = useState([]);

    let [correctScore, setCorrectScore] = useState(0);
    let [incorrectScore, setIncorrectScore] = useState(0);

    let [userUid, setUserUid] = useState();

    let navigate = useNavigate();
    const auth = getAuth();

    // Local storage varaibles
    let userAuth = localStorage.getItem("isAuth");
    let userAlias = localStorage.getItem("alias");

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetch(`https://opentdb.com/api.php?amount=10`);
                const res = await data.json();
                return res;
            } catch (err) {
                console.log("Api call error: ", err);
            }
        };

        getData().then((response) => {
            setData(response.results);
            console.log(response.results);
        });
    }, [runApi]);

    useEffect(() => {
        populateQuiz();
    }, [data]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUid(user.uid);
            }
        });
    }, []);

    // Parse html entities
    const htmlDecode = (input) => {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    };

    // Shuffles answers array
    const shuffleAnswers = (array) => {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };

    // Resets the state for the quiz questions api and the scores
    const resetQuiz = () => {
        setRunApi(runApi ? false : true);
        setQueNum(0);
        setCorrectScore(0);
        setIncorrectScore(0);
    };

    // Navigate to the login page
    const goToLogin = () => {
        navigate("/login");
    };

    // Saves the score to the users doc in the db and exits the quiz
    const saveAndExit = async () => {
        const q = query(collection(db, "users"), where("id", "==", userUid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            addDoc(collection(db, "users", doc.id, "scores"), {
                date: new Date().toLocaleDateString("en-UK", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                }),
                score: correctScore,
                alias: doc.data().alias,
            });
        });

        resetQuiz();
        exitQuiz();
    };

    // Updates the quesiton/answers hooks with the quiz data
    const populateQuiz = () => {
        let question;
        let correctAns;
        let answers = [];

        data.forEach((item, i) => {
            // If the item index is = to current question number, decode and push question/answers into variables
            if (i === queNum) {
                question = htmlDecode(item.question);
                correctAns = htmlDecode(item.correct_answer);
                answers.push(correctAns);

                item.incorrect_answers.forEach((incorrectAns) => {
                    incorrectAns = htmlDecode(incorrectAns);
                    answers.push(incorrectAns);
                });
            }
        });

        // Shuffle answers array
        shuffleAnswers(answers);

        // Set state hooks to question/answers
        setCurrentQuestion(question);
        setCorrectAnswer(correctAns);
        setAnswers(answers);
    };

    // Runs the API to refresh the set of the quesitons and resets question number/score
    const newQuiz = () => {
        resetQuiz();

        // Hide end quiz section
        document.querySelector(".js-quiz_end-section").classList.add("hide");
        // Unhide quiz section and quit quiz button
        setTimeout(() => {
            document.querySelector(".js-quiz-section").classList.remove("hide");
            document.querySelector(".js-quit-quiz-btn").classList.remove("hide");
        }, 2000);
    };

    // Unhides the quiz if user has entered an alias
    const startQuiz = () => {
        // If no alias, redirect to details page
        if (userAuth === "true" && (userAlias === null || userAlias === undefined || userAlias === "")) {
            navigate("/personalDetails");
        }

        // Unhide quiz section
        document.querySelector(".js-quiz-section").classList.remove("hide");
        // Unhide quit quiz button
        document.querySelector(".js-quit-quiz-btn").classList.remove("hide");
        // Hide quiz landing section
        document.querySelector(".js-quiz_landing-section").classList.add("hide");
        // Hide end quiz score section
        document.querySelector(".js-quiz_end-section").classList.add("hide");
    };

    const endQuiz = () => {
        // Hides quiz section
        document.querySelector(".js-quiz-section").classList.add("hide");
        // Hides end quiz button
        document.querySelector(".js-end-quiz-btn").classList.add("hide");
        // Hides quit quiz button
        document.querySelector(".js-quit-quiz-btn").classList.add("hide");
        // Show end quiz score section
        document.querySelector(".js-quiz_end-section").classList.remove("hide");
    };

    // Adds 1 to quesiton number and calls function to pupulate question/answers
    const getNextQue = () => {
        setQueNum((queNum += 1));
        populateQuiz();

        // Set buttons back to default
        document.querySelectorAll(".js-answer-btn").forEach((button) => {
            button.classList.remove("answer_btn-disable");
            button.querySelector(".bottom").classList.remove("answer_wrong", "answer_correct");
        });

        // Hide next question button
        document.querySelector(".js-next-btn").classList.remove("hide");
        document.querySelector(".js-next-btn").classList.add("hide");
    };

    // Checks what asnwer was selected
    const checkAnswer = (e, selected) => {
        if (selected === correctAnswer) {
            setCorrectScore((correctScore += 1));
        } else {
            setIncorrectScore((incorrectScore += 1));
        }

        document.querySelectorAll(".js-answer-btn").forEach((button) => {
            button.classList.add("answer_btn-disable");

            if (button.innerText !== correctAnswer) {
                button.querySelector(".bottom").classList.add("answer_wrong");
            } else {
                button.querySelector(".bottom").classList.add("answer_correct");
            }
        });

        // Add higlight colour to selected answer
        e.currentTarget.querySelector(".bottom").classList.add("answer_selected");

        if (queNum !== 9) {
            // Unhide next question button
            document.querySelector(".js-next-btn").classList.remove("hide");
        } else {
            // Unhide end quiz button
            document.querySelector(".js-end-quiz-btn").classList.remove("hide");
        }
    };

    // Exits the quiz and returns the landing screen
    const exitQuiz = () => {
        resetQuiz();
        // Hide end quiz section
        document.querySelector(".js-quiz_end-section").classList.add("hide");
        // Hide quiz section
        document.querySelector(".js-quiz-section").classList.add("hide");
        // Hide quit quiz button
        document.querySelector(".js-quit-quiz-btn").classList.add("hide");
        // Hide next question button
        document.querySelector(".js-next-btn").classList.add("hide");
        // Hide see results button
        document.querySelector(".js-end-quiz-btn").classList.add("hide");
        // Unhide quiz landing section
        document.querySelector(".js-quiz_landing-section").classList.remove("hide");
    };

    return (
        <div className="quiz_page">
            {/* Quiz section */}
            <div className="quiz_section js-quiz-section hide">
                <div className="quiz_score-section">
                    <div className="quiz_score-container">
                        <h2 className="quiz_question-counter">
                            Question: <span className="quiz_bold-num">{queNum + 1}</span>
                        </h2>
                        <div className="quiz_active-score-section">
                            <h2 className="quiz_active-score-correct">
                                Correct: <span className="quiz_bold-num">{correctScore}</span>
                            </h2>
                            <h2 className="quiz_active-score-incorrect">
                                Incorrect: <span className="quiz_bold-num">{incorrectScore}</span>
                            </h2>
                        </div>
                    </div>
                </div>
                <h3 className="quiz_question">Q: {currentQuestion}</h3>

                <div className="answer_section">
                    {answers.map((answer) => {
                        return (
                            <AnswerButton
                                className={"answer_btn js-answer-btn"}
                                key={answer}
                                answer={answer}
                                checkAnswer={(e) => checkAnswer(e, answer)}
                            />
                        );
                    })}
                </div>
                <div className="quiz_action-btns-container">
                    <Button className="js-quit-quiz-btn hide" text={"Quit quiz"} click={() => exitQuiz()} />
                    <Button className="js-next-btn hide" text={"Next"} click={() => getNextQue()} />
                    <Button className="js-end-quiz-btn hide" text={"See result"} click={() => endQuiz()} />
                </div>
            </div>

            {/* After quiz options section */}
            <div className="quiz_end-section js-quiz_end-section hide">
                <h2 className="quiz_end-final-score">
                    You scored:{" "}
                    <span className="quiz_bold-num">
                        {correctScore}/{queNum + 1}
                    </span>
                </h2>
                <Button className="js-new-quiz-btn" text={"New quiz"} click={() => newQuiz()} />

                {userAuth === "true" ? <Button text={"Save score and exit"} click={() => saveAndExit()} /> : ``}

                <Button className="js-exit-quiz-btn" text={"Exit quiz"} click={() => exitQuiz()} />
            </div>

            {/* Quiz landing section */}
            <div className="quiz_landing-section js-quiz_landing-section">
                <h1 className="quiz_landing-header">The Quiz Of <br/> Everything</h1>
                <Button className="js-start-btn" text={"Start quiz"} click={() => startQuiz()} />

                {userAuth === null ? (
                    <Button className={"js-login-prompt-btn"} text={"Log in to save score"} click={() => goToLogin()} />
                ) : (
                    ``
                )}
            </div>
        </div>
    );
}
