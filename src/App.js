import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const COLORS = ['blue', 'darkmagenta', 'purple', 'orange', 'violet',
  'brown', 'chocolate', 'darksalmon', 'springgreen', 'royalblue']

const App= () => {

  const [gameLevel, setGameLevel] = useState(0);
  const [highScore, setHighScore] =  useState(localStorage.getItem('highScore') ?? 0)
  const [boxDetails, setBoxDetails] = useState({});
  let { current: { currentLevelDetails, gameIntervalId } } = useRef({ currentLevelDetails: [], gameIntervalId: null });
  console.log(currentLevelDetails, gameIntervalId)

  const resetGame = () => {
    setBoxDetails({})
    setGameLevel(0)
    clearInterval(gameIntervalId);
    currentLevelDetails = [];
  }

  const gameStartResetHandler = () => {
    if (gameLevel === 0) {
      setGameLevel(1);
    } else {
      resetGame();
    }
  }

  const boxClickHandler = (boxIndex) => {
    if (!gameLevel) return
    if (boxIndex === currentLevelDetails[0]) {
      currentLevelDetails.shift()
      setBoxDetails({
        color: 'green',
        boxNumber: boxIndex,
      })
      setTimeout(() => {
        setBoxDetails({});
      }, 200)
      if (currentLevelDetails.length === 0) {
        setGameLevel((currentLevel) => {
          if (highScore < currentLevel) {
            localStorage.setItem('highScore', currentLevel)
            setHighScore(currentLevel);
          }
          return currentLevel + 1
        });
      }
    } else {
      setBoxDetails({
        color: 'red',
        boxNumber: boxIndex,
      })
      setTimeout(() => {
        resetGame();
      }, 300)
    }
  }
  
  const randomNumberGenerator = (min = 0, max = 5) => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  useEffect(() => {
    if (gameLevel) {
      const boxColor = COLORS[randomNumberGenerator(0,10)];
      let i = 1;
      const intervalId = setInterval(() => {
        const boxNumber= randomNumberGenerator()
        setBoxDetails({
          color: boxColor,
          boxNumber,
        })
        currentLevelDetails.push(boxNumber);
        i++;
        checkColorInterval();
        setTimeout(() => {
          setBoxDetails({});
        }, 500)
      }, 1000)
      gameIntervalId = intervalId;
      console.log('interval', intervalId, gameIntervalId)
      const checkColorInterval = () => {
        if (i > gameLevel) {
          clearInterval(intervalId);
        }
      }
    }
  }, [gameLevel])

  const { color, boxNumber } = boxDetails;

  return (
    <div className="App">
      <div className="game-wrapper">
        <div className='score-wrapper'>
          <div>Score: {gameLevel === 0 ? 0 : gameLevel - 1}</div>
          <div>Highscore: {highScore}</div>
        </div>
        <div className="box-wrapper">
          {
            Array(5).fill(1).map((item, index) => {
              if (index === boxNumber) {
                return <div onClick={() => boxClickHandler(index)} key={index} style={{ backgroundColor: color }} className="box"></div>
              }
              return <div onClick={() => boxClickHandler(index)} key={index} className="box"></div>
            })
          }
        </div>
        <button className='reset-button' onClick={gameStartResetHandler}>
          {`${gameLevel === 0 ? 'Start' : 'Reset'}`}
        </button>
      </div>
    </div>
  );
}

export default App;
