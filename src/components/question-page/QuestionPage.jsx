import React from "react"
import { decode } from "html-entities"
import "./QuestionPage.css"

export default function QuestionPage({moveToNextPage}) {

    const [questions, setQuestions] = React.useState([]);

    React.useEffect(function() {
          fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple")
              .then(res => res.json())
              .then(data => setQuestions(data.results))
      }, [])

    console.log(questions)

    const displayedQuestions = questions.map((question, index) => {
        const answers = question.incorrect_answers
        const correctAnswer = decode(question.correct_answer)
        
        const displayedAnswers = answers.map((answer, subIndex) => {
            return (
                <button key={subIndex} className="incorrect-answer">{decode(answer)}</button>
            )
        })

        const correctAnswerButton = <button className="correct-answer">{correctAnswer}</button>

        const randomIndex = Math.floor(Math.random() * displayedAnswers.length)
        displayedAnswers.splice(randomIndex, 0, correctAnswerButton)
        
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
        </main>
    )
}