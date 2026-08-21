import StartPage from "./components/start-page/StartPage"
import QuestionPage from "./components/question-page/QuestionPage"
import React from "react"
import "./App.css"

export default function App() {
  const [page, setPage] = React.useState(1)

  function moveToNextPage() {
    setPage(prevPage => prevPage + 1)
  }

  return (
    <main>
      {page === 1 && <StartPage moveToNextPage={moveToNextPage} />}
      {page === 2 && <QuestionPage moveToNextPage={moveToNextPage} />}
    </main>
  )
}