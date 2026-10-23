
import { useState } from 'react'
import './App.css'

const formatMoney = (amount) => `$${amount.toLocaleString('en-CA')}`

function randomCard() {
  return Math.floor(Math.random() * 10) + 1
}

function randomHand() {
  return [randomCard(), randomCard()]
}

function App() {
  const [playerHand, setPlayerHand] = useState([8, 3])
  const [dealerHand, setDealerHand] = useState([10, 6])
  const [message, setMessage] = useState('Place a bet to begin')
  const [gameOver, setGameOver] = useState(false)
  const [balance, setBalance] = useState(1000)
  const [currentBet, setCurrentBet] = useState(0)
  const [chipThrown, setChipThrown] = useState(false)

  const playerTotal = playerHand.reduce((sum, card) => sum + card, 0)
  const dealerTotal = dealerHand.reduce((sum, card) => sum + card, 0)

  function placeBet() {
    if (gameOver || currentBet > 0 || balance < 100) {
      if (balance < 100 && currentBet === 0) {
        setMessage('Not enough chips! Start a new game after your round.')
      }
      return
    }

    setBalance(previous => previous - 100)
    setCurrentBet(100)
    setMessage('Bet placed. Good luck!')
    setChipThrown(true)
  }

  function hit() {
    if (gameOver || currentBet === 0) return

    const card = randomCard()
    const newHand = [...playerHand, card]
    const total = newHand.reduce((sum, value) => sum + value, 0)

    setPlayerHand(newHand)

    if (total > 21) {
      setMessage('BUST! You lost your bet.')
      setGameOver(true)
      setCurrentBet(0)
    } else {
      setMessage(`You drew ${card}. Hit or stand?`)
    }
  }

  function stand() {
    if (gameOver || currentBet === 0) return

    const hand = [...dealerHand]
    let total = hand.reduce((sum, card) => sum + card, 0)

    while (total < 17) {
      const card = randomCard()
      hand.push(card)
      total += card
    }

    setDealerHand(hand)
    setGameOver(true)

    if (total > 21 || playerTotal > total) {
      setMessage('YOU WIN! Your winnings are paid.')
      setBalance(previous => previous + currentBet * 2)
    } else if (playerTotal < total) {
      setMessage('DEALER WINS. Better luck next time!')
    } else {
      setMessage("PUSH! Your bet has been returned.")
      setBalance(previous => previous + currentBet)
    }

    setCurrentBet(0)
  }

  function newGame() {
    if (!gameOver && currentBet > 0) return

    setPlayerHand(randomHand())
    setDealerHand(randomHand())
    setMessage('Place a bet to begin')
    setGameOver(false)
    setCurrentBet(0)
    setChipThrown(false)
  }

  const canBet = !gameOver && currentBet === 0 && balance >= 100
  const canPlay = !gameOver && currentBet > 0

  return (
    <main className="app">
      <header className="header">
        <a className="brand" href="#" aria-label="Blackjack Lab home">
          <span className="brand-icon">♠</span>
          <span>
            BLACKJACK<span className="accent"> LAB</span>
          </span>
        </a>

        <div className="header-right">
          <span className="demo-badge">
            <span className="live-dot" />
            DEMO TABLE
          </span>

          <div className="balance-panel">
            <span className="eyebrow">YOUR BALANCE</span>
            <strong>{formatMoney(balance)}</strong>
          </div>
        </div>
      </header>

      <section className="game-area">
        <div className="table">
          <div className="table-inner">
            <div className="table-label">
              <span className="table-label-line" />
              BLACKJACK
              <span className="table-label-line" />
            </div>

            <div className="hand dealer">
              <div className="hand-heading">
                <div className="avatar dealer-avatar">D</div>
                <div>
                  <h2>DEALER</h2>
                  <span className="hand-caption">HOUSE HAND</span>
                </div>
                <span className="total-badge">
                  {gameOver ? dealerTotal : '?'}
                </span>
              </div>

              <div className="cards">
                {dealerHand.map((card, index) => {
                  const hidden = !gameOver && index === 0

                  return (
                    <div
                      className={`playing-card ${hidden ? 'hidden-card' : ''}`}
                      key={index}
                    >
                      {hidden ? (
                        <div className="card-back-pattern">♠</div>
                      ) : (
                        <>
                          <span className="card-corner">{card}</span>
                          <span className="card-suit">
                            {card % 2 === 0 ? '♠' : '♥'}
                          </span>
                          <span className="card-bottom">{card}</span>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="center-stage">
              <div className="table-message" aria-live="polite">
                <span className="message-sparkle">✦</span>
                {message}
                <span className="message-sparkle">✦</span>
              </div>

              <div className="pot-area">
                <span className="pot-label">
                  {currentBet > 0 ? 'CURRENT BET' : 'TABLE POT'}
                </span>

                <div className="pot-chips">
                  {currentBet > 0 ? (
                    <img
                      src="/poker-chip.png"
                      className="pot-chip"
                      alt="Poker chip"
                    />
                  ) : (
                    <span className="empty-pot">♧</span>
                  )}
                </div>

                <strong>{formatMoney(currentBet)}</strong>
              </div>

              {chipThrown && (
                <div
                  className="flying-chip"
                  onAnimationEnd={() => setChipThrown(false)}
                  aria-hidden="true"
                >
                  <img src="/poker-chip.png" alt="" />
                </div>
              )}
            </div>

            <div className="hand player">
              <div className="hand-heading">
                <div className="avatar player-avatar">Y</div>
                <div>
                  <h2>YOUR HAND</h2>
                  <span className="hand-caption">PLAYER</span>
                </div>
                <span className="total-badge">{playerTotal}</span>
              </div>

              <div className="cards">
                {playerHand.map((card, index) => (
                  <div className="playing-card" key={index}>
                    <span className="card-corner">{card}</span>
                    <span className="card-suit">
                      {card % 2 === 0 ? '♠' : '♥'}
                    </span>
                    <span className="card-bottom">{card}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="table-decoration">
              <span>♠</span>
              <span>♦</span>
              <span>♣</span>
              <span>♥</span>
            </div>
          </div>
        </div>

        <section className="control-panel">
          <div className="bet-section">
            <div className="section-heading">
              <span className="eyebrow">PLACE YOUR BET</span>
              <span className="bet-amount">{formatMoney(100)}</span>
            </div>

            <button
              className="bet-chip-button"
              onClick={placeBet}
              disabled={!canBet}
              aria-label="Place a 100 dollar bet"
              title="Place a $100 bet"
            >
              <span className="chip-glow" />
              <img src="/poker-chip.png" alt="" />
              <span className="chip-button-label">$100</span>
            </button>

            <span className="chip-hint">
              {canBet ? 'TAP CHIP TO BET' : currentBet > 0 ? 'BET PLACED' : 'BET UNAVAILABLE'}
            </span>
          </div>

          <div className="control-divider" />

          <div className="action-section">
            <span className="eyebrow">YOUR MOVE</span>

            <div className="action-buttons">
              <button
                className="action-button hit-button"
                onClick={hit}
                disabled={!canPlay}
              >
                <span className="action-icon">＋</span>
                <span>HIT</span>
              </button>

              <button
                className="action-button stand-button"
                onClick={stand}
                disabled={!canPlay}
              >
                <span className="action-icon">Ⅱ</span>
                <span>STAND</span>
              </button>

              <button
                className="action-button new-game-button"
                onClick={newGame}
                disabled={!gameOver && currentBet > 0}
              >
                <span className="action-icon">↻</span>
                <span>NEW GAME</span>
              </button>
            </div>

            <p className="rules-note">
              Dealer stands on 17 · Get as close to 21 as you can
            </p>
          </div>
        </section>
      </section>

      <footer className="footer">
        <span>♠ BLACKJACK LAB</span>
        <span>LEARN. PLAY. ANALYZE.</span>
        <span className="footer-status">
          <span className="live-dot" />
          VIRTUAL CHIPS ONLY
        </span>
      </footer>
    </main>
  )
}

export default App
