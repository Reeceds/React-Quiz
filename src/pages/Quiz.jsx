import React from 'react'
import 'font-awesome/css/font-awesome.min.css';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Button from '../components/Button';
import AnswerButton from '../components/AnswerButton';


export default function Quiz() {
    
    let [data, setData] = useState([]);
    let [runApi, setRunApi] = useState(true);

    let [queNum, setQueNum] = useState(0);
    let [currentQuestion, setCurrentQuestion] = useState();
    let [correctAnswer, setCorrectAnswer] = useState();
    let [answers, setAnswers] = useState([]);
    
    let [correctScore, setCorrectScore] = useState(0);
    let [incorrectScore, setIncorrectScore] = useState(0);

    let navigate = useNavigate();

    // Local storage varaibles
    let userAuth = localStorage.getItem('isAuth');
    let userAlias = localStorage.getItem('alias');



    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetch(`https://opentdb.com/api.php?amount=10`);
                const res = await data.json();
                return res;
            } catch(err) {
                console.log('Api call error: ', err);
            }
        }

        getData().then(response => {
            setData(response.results)
            console.log(response.results)
        })
    },[runApi]);
    

    useEffect(() => {
        populateQuiz();
    },[data]);



    // Parse html entities
    const htmlDecode = input => {
        var doc = new DOMParser().parseFromString(input, "text/html");
        return doc.documentElement.textContent;
    };


    // Shuffles answers array
    const shuffleAnswers = array => {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        };
      
        return array;
    };

    // Navigate to the login page
    const goToLogin = () => {
        navigate('/login');
    }

    const saveScore = () => {
        console.log('save score')
    }


    // Updates the quesiton/answers hooks with the quiz data
    const populateQuiz = () => {
        let question;
        let correctAns;
        let answers = [];

        data.forEach((item, i) => {
            // If the item index is = to current question number, decode and push question/answers into variables
            if(i === queNum) {
                question = htmlDecode(item.question);
                correctAns = htmlDecode(item.correct_answer);
                answers.push(correctAns);

                item.incorrect_answers.forEach(incorrectAns => {
                    incorrectAns = htmlDecode(incorrectAns);
                    answers.push(incorrectAns);
                });
            };
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
        setRunApi(runApi ? false : true);
        setQueNum(0);
        setCorrectScore(0);
        setIncorrectScore(0);

        // Hide end quiz section
        document.querySelector('.js-end-quiz-section').classList.add("hide");
        // Unhide quiz section
        document.querySelector('.js-quiz-section').classList.remove("hide");
    };
    
    
    // Unhides the quiz if user has entered an alias
    const startQuiz = () => {
        // If no alias, redirect to details page
        if(userAuth === 'true' && (userAlias === null || userAlias === undefined || userAlias === '')){
            navigate('/personalDetails');
        }
        
        // Unhide quiz section
        document.querySelector('.js-quiz-section').classList.remove("hide");
        // Hide start quiz button
        document.querySelector('.js-start-btn').classList.add("hide");
        // Hide end quiz score section
        document.querySelector('.js-end-quiz-section').classList.add("hide");
    };


    const endQuiz = () => {
        // Hides quiz section
        document.querySelector('.js-quiz-section').classList.add("hide");
        // Hides end quiz button
        document.querySelector('.js-end-quiz-btn').classList.add("hide");
        // Show end quiz score section
        document.querySelector('.js-end-quiz-section').classList.remove("hide");

        // Add last score to local storage
        localStorage.setItem('lastScore', correctScore);
    }


    // Adds 1 to quesiton number and calls function to pupulate question/answers
    const getNextQue = () => {
        setQueNum(queNum += 1);
        populateQuiz();

        // Hide next question button
        document.querySelector('.js-next-btn').classList.add("hide");
    };


    // Checks what asnwer was selected
    const checkAnswer = (e, selected) => {

        if(selected === correctAnswer){
            setCorrectScore(correctScore += 1);
        } else {
            setIncorrectScore(incorrectScore += 1);
        };

        document.querySelectorAll('.js-answer-btn').forEach(button => {
            button.disabled = true;

            if(button.innerText !== correctAnswer){
                button.classList.add('wrong-answer');
            } else {
                button.classList.add('correct-answer');
            };
        });

        // Add higlight colour to selected answer
        e.target.classList.add('selected-answer');

        if(queNum !== 9){
            // Unhide next question button
            document.querySelector('.js-next-btn').classList.remove("hide");
        } else {
            // Unhide end quiz button
            document.querySelector('.js-end-quiz-btn').classList.remove("hide");
        }

    };




    return (
        <div className="quiz-page">
            <h1>Quiz</h1>

            {/* Quiz section */}
            <div className='quiz-section js-quiz-section hide'>
                <h2>Question: {queNum + 1}</h2>
                <h2>Correct: {correctScore}  Incorrect: {incorrectScore}</h2>
                <h3>Q: {currentQuestion}</h3>

                <div className='answers-section'>
                    {answers.map(answer => {
                        return <AnswerButton className={'answer-btn js-answer-btn'} key={answer} answer={answer} checkAnswer={(e) => checkAnswer(e, answer)} />
                    })}
                </div>
                <Button className={'js-next-btn hide'} text={'Next'} click={() => getNextQue()} />
            </div>
            
            {/* After quiz options section */}
            <div className='end-quiz-section js-end-quiz-section hide'>
                <h2>You scored: {correctScore}/{queNum + 1}</h2>
                <Button className={'js-new-quiz-btn'} text={'New quiz'} click={() => newQuiz()} />

                {userAuth === 'true' ? <Button text={'Save score'} click={() => saveScore()} /> : ``}
            </div>

            <Button className={'js-start-btn'} text={'Start quiz'} click={() => startQuiz()} />

            {userAuth === null ? <Button text={'Log in to save your score'} click={() => goToLogin()} /> : ``}
            
            <Button className={'js-end-quiz-btn hide'} text={'End quiz'} click={() => endQuiz()} />
        </div>
    );
    
}
