
import { useState } from 'react'
import './App.css'

function App() {
  const [playerHand, setPlayerHand] = useState([8, 3])
  const [dealerHand, setDealerHand] = useState([10, 6])
  const [message, setMessage] = useState('Your turn')
  const [gameOver, setGameOver] = useState(false)

  const playerTotal = playerHand.reduce((sum, card) => sum + card, 0)
  const dealerTotal = dealerHand.reduce((sum, card) => sum + card, 0)

  function hit() {
    if (gameOver) return

    const card = Math.floor(Math.random() * 10) + 1
    const newHand = [...playerHand, card]
    const total = newHand.reduce((sum, value) => sum + value, 0)

    setPlayerHand(newHand)

    if (total > 21) {
      setMessage('Bust! You went over 21.')
      setGameOver(true)
    } else {
      setMessage(`You drew ${card}. Hit or stand?`)
    }
  }

  function stand() {
    if (gameOver) return

    let hand = [...dealerHand]
    let total = hand.reduce((sum, card) => sum + card, 0)

    while (total < 17) {
      const card = Math.floor(Math.random() * 10) + 1
      hand.push(card)
      total += card
    }

    setDealerHand(hand)
    setGameOver(true)

    if (total > 21 || playerTotal > total) {
      setMessage('You win!')
    } else if (playerTotal < total) {
      setMessage('Dealer wins!')
    } else {
      setMessage("It's a tie!")
    }
  }

  function newGame() {
    setPlayerHand([Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2])
    setDealerHand([Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2])
    setMessage('Your turn')
    setGameOver(false)
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">♠</span>
          <span>BLACKJACK<span className="accent"> LAB</span></span>
        </div>
        <span className="status">● DEMO GAME</span>
      </header>

      <section className="table">
        <div className="hand dealer">
          <h2>DEALER <span className="total">{gameOver ? dealerTotal : '?'}</span></h2>
          <div className="cards">
            {dealerHand.map((card, index) => (
              <div className="card" key={index}>
                <span>{gameOver || index > 0 ? card : '★'}</span>
                <small>{gameOver || index > 0 ? 'CARD' : 'HIDDEN'}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="table-message">{message}</div>

        <div className="hand player">
          <h2>YOUR HAND <span className="total">{playerTotal}</span></h2>
          <div className="cards">
            {playerHand.map((card, index) => (
              <div className="card" key={index}>
                <span>{card}</span>
                <small>CARD</small>
              </div>
            ))}
          </div>
        </div>

        <div className="controls">
          <button onClick={hit} disabled={gameOver}>HIT</button>
          <button className="stand" onClick={stand} disabled={gameOver}>STAND</button>
          <button className="new-game" onClick={newGame}>NEW GAME</button>
        </div>
      </section>

      <footer>BLACKJACK LAB · LEARN. PLAY. ANALYZE.</footer>
    </main>
  )
}

export default App
