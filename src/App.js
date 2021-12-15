import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const COLORS = ['blue', 'darkmagenta', 'purple', 'orange', 'violet',
  'brown', 'chocolate', 'darksalmon', 'springgreen', 'royalblue'];

const App= () => {

  const [gameLevel, setGameLevel] = useState(0);
  const [highScore, setHighScore] =  useState(localStorage.getItem('memory-game:high-score') ?? 0)
  const [boxDetails, setBoxDetails] = useState({});
  const { current: gameInfo } = useRef({ currentLevelDetails: [], gameIntervalId: null });

  console.log(gameInfo.currentLevelDetails, gameInfo.gameIntervalId)

  const resetGame = () => {
    setBoxDetails({})
    setGameLevel(0)
    gameInfo.gameIntervalId= clearInterval(gameInfo.gameIntervalId);
    gameInfo.currentLevelDetails = [];
  }

  const gameStartResetHandler = () => {
    if (gameLevel === 0) {
      setGameLevel(1);
    } else {
      resetGame();
    }
  }

  const boxClickHandler = (boxIndex) => {
    if (!gameLevel || gameInfo.gameIntervalId) return
    if (boxIndex === gameInfo.currentLevelDetails[0]) {
      gameInfo.currentLevelDetails.shift()
      setBoxDetails({
        color: 'green',
        boxNumber: boxIndex,
      })
      setTimeout(() => {
        setBoxDetails({});
      }, 200)
      if (gameInfo.currentLevelDetails.length === 0) {
        setGameLevel((currentLevel) => {
          if (highScore < currentLevel) {
            localStorage.setItem('memory-game:high-score', currentLevel)
            setHighScore(currentLevel);
          }
          return currentLevel + 1
        });
      }
    } else {
      setBoxDetails({
        color: 'red',
        boxNumber: boxIndex,
        wrongBox: true
      })
      setTimeout(() => {
        resetGame();
      }, 500)
    }
  }
  
  const randomNumberGenerator = (min = 0, max = 5) => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  useEffect(() => {
    if (gameLevel) {
      const boxColor = COLORS[randomNumberGenerator(0,10)];
      let i = 1;
      gameInfo.gameIntervalId  = setInterval(() => {
        const boxNumber= randomNumberGenerator()
        setBoxDetails({
          color: boxColor,
          boxNumber,
        })
        gameInfo.currentLevelDetails.push(boxNumber);
        i++;
        checkColorInterval();
        setTimeout(() => {
          setBoxDetails({});
        }, 500)
      }, 1000)
      const checkColorInterval = () => {
        if (i > gameLevel) {
          gameInfo.gameIntervalId= clearInterval(gameInfo.gameIntervalId);
        }
      }
    }
  }, [gameLevel])

  const { color, boxNumber, wrongBox } = boxDetails;

  return (
    <div className="App">
      <div className="game-wrapper">
        <div className='score-wrapper'>
          <div>Score: {Math.max(0, gameLevel - 1)}</div>
          <div>Highscore: {highScore}</div>
        </div>
        <div className={`box-wrapper ${wrongBox ? 'shake' : ''}`}>
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
