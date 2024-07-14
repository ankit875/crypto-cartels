/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameBoardLayout } from './GameBoardLayout'
import { monopolyInstance } from '../../models/Monopoly'
import { showToast } from '../../utilities'
import './gameBoard.scss'
import { Player } from '../../models/Player'
import { useAccount } from 'wagmi'

interface DiceValues {
  one: number
  two: number
}

export const GameScreen = () => {
  const { address } = useAccount()
  const navigate = useNavigate()
  const [refresh, setRefresh] = useState(true)
  const [currentTurn, setCurrentTurn] = useState<Player>(monopolyInstance.Players?.current?.())
  const [diceValues, setDiceValues] = useState<DiceValues>({ one: 0, two: 0 })
  const [showLogs, setShowLogs] = useState(false)
  const [gameStatus, setGameStatus] = useState(true)

  useEffect(() => {
    if (!monopolyInstance.Players.current) navigate('/')
      console.log('Address', refresh)
  }, [navigate])

  const rollDice = () => {
    console.log('Address', address)
    if (!address) {
      alert('Please connect your wallet first')
      return
    }
    const one = Math.floor(Math.random() * 6) + 1
    const two = Math.floor(Math.random() * 6) + 1
    setDiceValues({ one, two })
    updatePlayerPositions(one, two)
  }

  const updateCurrentPlayerCurrentIndex = (one: number, two: number) => {
    const playerIndex = currentTurn.currentIndex + one + two
    currentTurn.currentIndex = playerIndex > 40 ? playerIndex - 40 : playerIndex
    if (playerIndex > 40) {
      currentTurn.balance += 200
      showToast('Passed Go Collect $200')
      monopolyInstance.logs.push('Passed Go Collect $200')
    }
    setRefresh((prev) => !prev)
  }

  const endGameIfOnlyOnePlayerLeft = () => {
    if ([...monopolyInstance.Players].length === 1) {
      setRefresh((prev) => !prev)
      setGameStatus(false)
    }
  }

  const updatePlayerPositions = (one: number, two: number) => {
    endGameIfOnlyOnePlayerLeft()
    const isFirstTurnOfEveryPlayer = [...monopolyInstance.Players].every(
      (player) => !player?.playerTurn
    )
    if (isFirstTurnOfEveryPlayer) {
      currentTurn.lastDiceValue = one + two
      toggleCurrentTurn()
      const isFirstTurnPlayedByEveryOne = [...monopolyInstance.players].every(
        (player) => player?.lastDiceValue
      )

      if (isFirstTurnPlayedByEveryOne) {
        const greatestFirstDiceValue = Math.max(
          ...[...monopolyInstance.Players].map((player: any) => player.lastDiceValue)
        )
        const playerIndexWithGreatestDiceValue = [...monopolyInstance.Players].findIndex(
          (player) => player?.lastDiceValue === greatestFirstDiceValue
        )
        monopolyInstance.Players.index = playerIndexWithGreatestDiceValue

        setRefresh((prev) => !prev)
        setCurrentTurn(monopolyInstance.Players?.current?.())
        updateCurrentPlayerCurrentIndex(one, two)
      }
    } else updateCurrentPlayerCurrentIndex(one, two)
  }

  const toggleCurrentTurn = () => {
    monopolyInstance.Players.next()
    setCurrentTurn(monopolyInstance.Players?.current?.())
  }

  const toggleLogs = () => {
    setShowLogs((prev) => !prev)
  }

  const removePlayerFromGame = (player: Player) => {
    monopolyInstance.Players = [...monopolyInstance.Players].filter(
      (gamePlayer) => player !== gamePlayer
    ) as Player[]
    if (!monopolyInstance.removedPlayers.find((removedPlayer) => removedPlayer === player))
      monopolyInstance.removedPlayers.push(player)
    endGameIfOnlyOnePlayerLeft()
    setRefresh((prev) => !prev)
  }

  return (
    <>
      <div className="responsive">
        <GameBoardLayout
          players={monopolyInstance.Players}
          currentPlayer={currentTurn}
          diceValues={diceValues}
          onDiceRoll={rollDice}
          toggleCurrentTurn={toggleCurrentTurn}
          toggleLogs={toggleLogs}
          showLogs={showLogs}
          removePlayerFromGame={removePlayerFromGame}
          gameStatus={gameStatus}
        />
      </div>
    </>
  )
}
