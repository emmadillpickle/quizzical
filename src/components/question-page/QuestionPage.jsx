import React from "react"
import { decode } from "html-entities"
import "./QuestionPage.css"

export default function QuestionPage({moveToNextPage}) {

    // state variables
    const [questions, setQuestions] = React.useState([]);

    // derived variables
    const questionsAnswered = questions.filter(question => question.chosen_answer != "").length
    const allQuestionsAnswered = questionsAnswered === questions.length

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

    React.useEffect(function() {
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
                        chosen_answer: ""
                    }
                })
            ))
      }, [])

    const displayedQuestions = questions.map((question, index) => {
        // format the answers
        const displayedAnswers = question.all_answers.map((answer, subIndex) => {
            const isSelected = answer === question.chosen_answer

            return (
                <button 
                    key={subIndex} 
                    onClick={() => chooseAnswer(answer, index)}
                    className={isSelected ? "selected" : ""}
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
            {<button 
                className="check-answer-button"
                disabled={!allQuestionsAnswered}
            >
                Check answers
            </button>}
        </main>
    )
}