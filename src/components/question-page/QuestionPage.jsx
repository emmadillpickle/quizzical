import React from "react"
import { decode } from "html-entities"
import "./QuestionPage.css"

export default function QuestionPage({moveToNextPage}) {

    // state variables
    const [questions, setQuestions] = React.useState([]);
    const [hasCheckedAnswers, setHasCheckedAnswers] = React.useState(false)

    // derived variables
    const questionsAnswered = questions.filter(question => question.chosen_answer != "").length
    const allQuestionsAnswered = questions.length != 0 && questionsAnswered === questions.length
    const score = questions.filter(question => question.chosen_answer === question.correct_answer).length

    // static variables
    function chooseAnswer(answer, questionIndex) {
        setQuestions((prevQuestions) => 
            prevQuestions.map((question, index) => 
                index === questionIndex
                    ? {...question, chosen_answer: answer}
                    : question
            )
        )
    }

    function fetchQuestions() {
        fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
            .then(res => res.json())
            .then(data => setQuestions(
                data.results.map((question) => {
                    const allAnswers = [
                        ...question.incorrect_answers,
                        question.correct_answer
                    ].map(answer => decode(answer))

                    allAnswers.sort(() => Math.random() - 0.5)

                    return {
                        ...question,
                        all_answers: allAnswers,
                        correct_answer: decode(question.correct_answer),
                        chosen_answer: ""
                    }
                })
            ))
    }

    function getClassName(question, answer) {
        const isChosen = answer === question.chosen_answer
        const isCorrect = answer === question.correct_answer

        if (!hasCheckedAnswers && isChosen) {
            return "selected"
        } if (hasCheckedAnswers && isCorrect) {
            return "correct"
        } if (isChosen) {
            return "incorrect"
        }

        return "unselected"
    }

    React.useEffect(() => fetchQuestions(), [])

    function playAgain() {
        setQuestions([])
        setHasCheckedAnswers(false);
        fetchQuestions()
    }

    const displayedQuestions = questions.map((question, index) => {
        // format the answers
        const displayedAnswers = question.all_answers.map((answer, subIndex) => {

            return (
                <button 
                    key={subIndex} 
                    onClick={() => chooseAnswer(answer, index)}
                    className={getClassName(question, answer)}
                    disabled={hasCheckedAnswers}
                >
                    {answer}
                </button>
            )
        })
        
        // return question + answer block
        return (
            <section key={index} className="question">
                <h2 key={index}>{decode(question.question)}</h2>
                <div className="answer-container">
                    {displayedAnswers}
                </div>
            </section>
        )
    })

    return (
        <main className="question-page">
            {displayedQuestions}
            {!hasCheckedAnswers && <button 
                className="check-answer-button"
                style={{visibility: allQuestionsAnswered ? "visible" : "hidden"}}
                onClick={() => setHasCheckedAnswers(true)}
            >
                Check answers
            </button>}
            {hasCheckedAnswers && <section className="game-finished-status">
                <h2>You scored {score}/{questions.length} correct answers</h2>    
                <button onClick={playAgain}>Play again</button>
            </section>}
        </main>
    )
}