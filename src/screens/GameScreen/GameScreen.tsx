import React, { Component } from 'react'
import { GameBoardLayout } from './GameBoardLayout'
import { monopolyInstance } from '../../models/Monopoly'
import { showToast } from '../../utilities'
import './gameBoard.scss'

export class GameScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refresh: true,
      currentTurn:
        monopolyInstance.Players &&
        monopolyInstance.Players.current &&
        monopolyInstance.Players.current(),
      diceValues: {
        one: 0,
        two: 0,
      },
      showLogs: false,
      gameStatus: true,
    }
  }

  componentDidMount() {
    if (!monopolyInstance.Players.current) this.props.history.push('/')
  }

  rollDice = () => {
    const one = Math.floor(Math.random() * 6) + 1
    const two = Math.floor(Math.random() * 6) + 1
    this.setState(
      () => ({ diceValues: { one, two } }),
      () => this.updatePlayerPositions()
    )
  }

  updateCurrentPlayerCurrentIndex = () => {
    const currentTurn = this.state.currentTurn
    const playerIndex =
      currentTurn.currentIndex + this.state.diceValues.one + this.state.diceValues.two
    currentTurn.currentIndex = playerIndex > 40 ? playerIndex - 40 : playerIndex
    if (playerIndex > 40) {
      currentTurn.balance += 200
      showToast('Passed Go Collect $200')
      monopolyInstance.logs.push('Passed Go Collect $200')
    }
    this.setState({
      ...this.state,
      refresh: !this.state.refresh,
    })
  }

  endGameIfOnlyOnePlayerLeft = () => {
    if ([...monopolyInstance.Players].length === 1) {
      this.setState({
        ...this.state,
        refresh: !this.state.refresh,
        gameStatus: false,
      })
      return
    }
  }

  updatePlayerPositions = () => {
    this.endGameIfOnlyOnePlayerLeft()
    const isFirstTurnOfEveryPlayer = [...monopolyInstance.Players].every(
      (player) => !player.playerTurn
    )
    const currentTurn = this.state.currentTurn
    const { one, two } = this.state.diceValues
    if (isFirstTurnOfEveryPlayer) {
      currentTurn.lastDiceValue = one + two
      this.toggleCurrentTurn()
      const isFirstTurnPlayedByEveryOne = [...monopolyInstance.players].every(
        (player) => player.lastDiceValue
      )

      if (isFirstTurnPlayedByEveryOne) {
        const greatestFirstDiceValue = Math.max(
          ...[...monopolyInstance.Players].map((player) => player.lastDiceValue)
        )
        const playerIndexWithGreatestDiceValue = [...monopolyInstance.Players].findIndex(
          (player) => player.lastDiceValue === greatestFirstDiceValue
        )
        monopolyInstance.Players.index = playerIndexWithGreatestDiceValue

        this.setState(
          () => ({
            refresh: !this.state.refresh,
            currentTurn:
              monopolyInstance.Players &&
              monopolyInstance.Players.current &&
              monopolyInstance.Players.current(),
          }),
          () => this.updateCurrentPlayerCurrentIndex()
        )
      }
    } else this.updateCurrentPlayerCurrentIndex()
  }

  toggleCurrentTurn = () => {
    monopolyInstance.Players.next()
    this.setState(() => ({
      currentTurn:
        monopolyInstance.Players &&
        monopolyInstance.Players.current &&
        monopolyInstance.Players.current(),
    }))
  }

  toggleLogs = () => {
    this.setState(() => ({ showLogs: !this.state.showLogs }))
  }

  removePlayerFromGame = (player) => {
    monopolyInstance.Players = [...monopolyInstance.Players].filter(
      (gamePlayer) => player !== gamePlayer
    )
    if (!monopolyInstance.removedPlayers.find((removedPlayer) => removedPlayer === player))
      monopolyInstance.removedPlayers.push(player)
    this.endGameIfOnlyOnePlayerLeft()
    this.setState({
      ...this.state,
      refresh: !this.state.refresh,
    })
  }

  render() {
    const { currentTurn, diceValues, showLogs, gameStatus } = this.state

    return (
      <>
        <div className="responsive">
          <GameBoardLayout
            players={monopolyInstance.Players}
            currentPlayer={currentTurn}
            diceValues={diceValues}
            onDiceRoll={this.rollDice}
            toggleCurrentTurn={this.toggleCurrentTurn}
            toggleLogs={this.toggleLogs}
            showLogs={showLogs}
            removePlayerFromGame={this.removePlayerFromGame}
            gameStatus={gameStatus}
          />
        </div>
      </>
    )
  }
}
