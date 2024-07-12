import React, { Component } from 'react'
import logo from '../../assets/logo.png'
import { COLORS, GAME_SETTINGS } from '../../Constants'
import { monopolyInstance } from '../../models/Monopoly'
import { showToast } from '../../utilities'
import './startScreen.scss'

export class StartScreen extends Component {
  state = {
    countValidated: false,
    playerCount: 2,
    playerDetails: [],
  }

  onPlayerDataChange = (property: string, value: string, playerIndex: number) => {
    const playerDetails = this.state.playerDetails.map((player, index) => {
      if (index === playerIndex) return { ...player, [property]: value }
      else return player
    })

    this.setState(() => ({ playerDetails }))
  }

  onPlayerCountInputChange = (playerCount: number) => {
    this.setState(() => ({ playerCount }))
    this.onContinueButtonClick()
  }

  onContinueButtonClick = () => {
    if (this.state.playerCount >= 2)
      this.setState(() => ({
        countValidated: true,
        playerDetails: this.getInitialPlayersData(),
      }))
    else showToast('Enter Player Count Greater Than 2')
  }

  getInitialPlayersData = () => {
    const data = []
    for (let i = 0; i < this.state.playerCount; i += 1) {
      data.push({ name: '', color: COLORS[i] })
    }
    return data
  }

  getPlayerFormFields = () => {
    const fields = []
    for (let i = 0; i < this.state.playerCount; i += 1) {
      fields.push(
        <div className="field-group" key={i}>
          <input
            className="input"
            placeholder="Enter Player Name"
            onChange={(event) => this.onPlayerDataChange('name', event.target.value, i)}
            value={this.state.playerDetails[i]?.name}
          />
          <select
            className="input mar-2"
            onChange={(event) => this.onPlayerDataChange('color', event.target.value, i)}
            value={this.state.playerDetails[i] ? this.state.playerDetails[i].color : COLORS[i]}
          >
            {COLORS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      )
    }
    return fields
  }

  getNumberOfPlayersInputBoxes = () => {
    const inputBoxes = []
    for (let i = GAME_SETTINGS.MIN_PLAYERS; i <= GAME_SETTINGS.MAX_PLAYERS; i++) {
      inputBoxes.push(
        <div
          className={`player-count-box ${i === this.state.playerCount ? 'active' : ''}`}
          onClick={() => this.onPlayerCountInputChange(i)}
        >
          {i}
        </div>
      )
    }
    return inputBoxes
  }

  validateGameSettings = () => {
    if (this.state.playerDetails) {
      if (this.state.playerDetails.every((player) => player.name && player.color)) {
        monopolyInstance.Players = this.state.playerDetails
        this.props.history.push('/game')
      } else {
        showToast('Please Enter All Player Details')
      }
    } else showToast('Please Enter Player Details')
  }

  render() {
    return (
      <div className="start-screen">
        <div className="game-logo">
          <img src={logo} alt="Game Logo" />
        </div>
        <div className="game-form">
          {this.state.countValidated ? (
            <>
              <label htmlFor="PlayerCount">Enter Player Details</label>
              <div className="player-details-form">
                {this.getPlayerFormFields()}
                <button
                  type="button"
                  className="input mar-1 active"
                  onClick={this.validateGameSettings}
                >
                  Start Game
                </button>
                <button
                  type="button"
                  className="input mar-2 danger"
                  onClick={() => this.setState(() => ({ countValidated: false }))}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="player-count-form">
                <label htmlFor="PlayerCount" className="player-count-label">
                  Select Number of Players
                </label>
                <div className="input-wrapper">{this.getNumberOfPlayersInputBoxes()}</div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
}
