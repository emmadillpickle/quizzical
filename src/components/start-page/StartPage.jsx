import "./StartPage.css"

export default function StartPage({moveToNextPage}) {
    return (
        <main className="start-page">
            <h1>Quizzical</h1>
            <p>Put your trivia knowledge to the test!</p>
            <button onClick={moveToNextPage}>Start quiz</button>
        </main>
    )
}