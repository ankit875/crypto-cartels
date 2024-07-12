import React, { useEffect, useState } from 'react'
import { BOX_TYPES, COMMUNITY_CARDS, RAILROAD_RENTS } from '../../Constants'
import { showToast, curry } from '../../utilities'
import { monopolyInstance } from '../../models/Monopoly'
import { ActionPopup } from './ActionPopup'
import { GoBox, AvenueBox, SpecialBox } from './BoxTypes'
import './gameBox.scss'

export const GameBox = (props) => {
  const {
    type,
    name,
    id,
    players,
    currentPlayer,
    toggleCurrentTurn,
    baserent,
    boxType,
    diceValues,
    removePlayerFromGame,
  } = props
  const [playerAction, setPlayerAction] = useState(null)

  // const isGo = () => name === "GO";

  const getPropertyOwner = () => {
    return [...players].find((player) =>
      player.ownedProperties.find((property) => property.name === name)
    )
  }

  const getCurrentRentForProperty = () => {
    const currentOwner = getPropertyOwner()
    if (!currentOwner) return 0
    const propertyDetails = currentOwner.ownedProperties.find((property) => property.name === name)
    if (boxType.type === BOX_TYPES.AVENUE) {
      if (!propertyDetails.rentLevel) return baserent
      else return props[`rent${propertyDetails.rentLevel}`]
    } else if (boxType.type === BOX_TYPES.RAILROADS) {
      const allRailRoads = currentOwner.ownedProperties.filter(
        (property) => property.type === BOX_TYPES.RAILROADS
      )
      if (allRailRoads.length === 1) return RAILROAD_RENTS.FIRST
      if (allRailRoads.length === 2) return RAILROAD_RENTS.SECOND
      if (allRailRoads.length === 3) return RAILROAD_RENTS.THIRD
      if (allRailRoads.length === 4) return RAILROAD_RENTS.FOURTH
    } else if (boxType.type === BOX_TYPES.UTILITIES) {
      const allUtilities = currentOwner.ownedProperties.filter(
        (property) => property.type === BOX_TYPES.UTILITIES
      )
      if (allUtilities.length === 1) return 4 * diceValues.one * diceValues.two
      if (allUtilities.length === 2) return 10 * diceValues.one * diceValues.two
    }
  }

  const rentProperty = () => {
    const currentOwner = getPropertyOwner()

    const currentRent = getCurrentRentForProperty()
    currentPlayer.balance -= currentRent
    currentOwner.balance += currentRent

    const newPropertyData = currentOwner.ownedProperties.map((property) => {
      if (property.name === name)
        return {
          ...property,
          rentLevel: property.rentLevel + 1 > 5 ? 5 : property.rentLevel + 1,
        }
      else return property
    })

    currentOwner.ownedProperties = newPropertyData
    const message = `${currentPlayer.name} rented ${name} at $${currentRent} from ${currentOwner.name}`
    showToast(message)
    transactionLog(message)
    setPlayerAction(null)
    toggleCurrentTurn()
  }

  const buyProperty = () => {
    currentPlayer.ownedProperties.push({
      name,
      rentLevel: 0,
      timeStamp: Date.now(),
      type: boxType.type,
    })
    currentPlayer.balance -= boxType.price
    currentPlayer.playerTurn += 1
    const message = `${currentPlayer.name} bought ${name} at $ ${boxType.price}`
    showToast(message)
    transactionLog(message)
    setPlayerAction(null)
    toggleCurrentTurn()
  }

  const handlePropertyTransaction = () => {
    if (playerAction === 'Buy') {
      buyProperty()
    } else if (playerAction === 'Rent') {
      rentProperty()
    }
  }

  const handlePropertyDealing = () => {
    const isPropertyOwnedByCurrentPlayer = currentPlayer.ownedProperties.find(
      (property) => property.name === name
    )
    if (isPropertyOwnedByCurrentPlayer) {
      toggleCurrentTurn()
      return
    }
    if (!isPropertyOwnedByCurrentPlayer) {
      const currentOwner = getPropertyOwner()
      if (currentOwner) {
        setPlayerAction('Rent')
      } else {
        setPlayerAction('Buy')
      }
    }
  }

  const showPlayerCurrentPosition = () => {
    const colors = [...players]
      .filter((player) => player.currentIndex === id)
      .map((player) => player)

    return colors.map(({ color, name }) => (
      <div style={{ backgroundColor: color }} className="player-box"></div>
    ))
  }

  const getPropertyBoughtColor = () => {
    const currentOwner = getPropertyOwner()
    if (currentOwner) {
      return <div className="owner" style={{ backgroundColor: currentOwner.color }}></div>
    } else return null
  }

  const getRandomElementFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const chanceAction = (action) => {
    const message = `${currentPlayer.name} - ${action}`
    showToast(message)
    chanceLog(message)

    if (action === 'GET OUT OF JAIL FREE. This card may be kept until needed or traded.') {
      currentPlayer.getOutOfJailFree += 1
      toggleCurrentTurn()
    }
    if (
      action ===
      'Make General Repairs on All Your Property. For each house pay $25. For each hotel $100.'
    ) {
      const toPay = currentPlayer.ownedProperties.length * 25
      currentPlayer.balance -= toPay
      toggleCurrentTurn()
    }
    if (action === 'Speeding fine $15.') {
      currentPlayer.balance -= 15
      toggleCurrentTurn()
    }

    if (action === 'You have been elected chairman of the board. Pay each player $50.') {
      ;[...players].forEach((player) => {
        player.balance += 50
      })
      currentPlayer.balance -= [...players].length * 50
      toggleCurrentTurn()
    }

    if (action === 'Go back three spaces.') {
      currentPlayer.currentIndex -= 3
    }

    if (
      action ===
      'ADVANCE TO THE NEAREST UTILITY. IF UNOWNED, you may buy it from the Bank. IF OWNED, throw dice and pay owner a total ten times the amount thrown.'
    ) {
      const distanceToEletric = 13 - currentPlayer.currentIndex
      const distanceToWaterWorks = 29 - currentPlayer.currentIndex
      if (distanceToEletric < distanceToWaterWorks) {
        currentPlayer.currentIndex = 13
      } else currentPlayer.currentIndex = 29
    }

    if (action === 'Bank pays you dividend of $50.') {
      currentPlayer.balance += 50
      toggleCurrentTurn()
    }

    if (
      action ===
      'ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.'
    ) {
      const mins = [
        6 - currentPlayer.currentIndex,
        16 - currentPlayer.currentIndex,
        26 - currentPlayer.currentIndex,
      ]
      const minValue = Math.min(...mins)
      const index = mins.indexOf(minValue)
      if (index === 0) currentPlayer.currentIndex = 6
      if (index === 1) currentPlayer.currentIndex = 16
      if (index === 2) currentPlayer.currentIndex = 26
    }

    if (action === 'Pay poor tax of $15.') {
      currentPlayer.balance -= 15
      toggleCurrentTurn()
    }

    if (action === "Take a trip to Reading Rail Road. If you pass 'GO' collect $200.") {
      currentPlayer.currentIndex = 6
      currentPlayer.balance += 200
      toggleCurrentTurn()
    }

    if (action === 'ADVANCE to Boardwalk.') {
      currentPlayer.currentIndex = 40
      toggleCurrentTurn()
    }

    if (action === "ADVANCE to Illinois Avenue. If you pass 'GO' collect $200.") {
      if (currentPlayer.currentIndex === 37) {
        currentPlayer.balance += 200
      }
      currentPlayer.currentIndex = 25
      toggleCurrentTurn()
    }

    if (action === 'Your building loan matures. Collect $150.') {
      currentPlayer.balance += 150
      toggleCurrentTurn()
    }

    if (action === "ADVANCE to St. Charles Place. If you pass 'GO' collect $200.") {
      if (currentPlayer.currentIndex === 37 || currentPlayer.currentIndex === 23) {
        currentPlayer.balance += 200
      }
      currentPlayer.currentIndex = 12
      toggleCurrentTurn()
    }

    if (action === "Go to Jail. Go Directly to Jail. Do not pass 'GO'. Do not collect $200.") {
      currentPlayer.currentIndex = 11
      currentPlayer.isInJail = 1
      toggleCurrentTurn()
    }
  }

  const communityAction = (action) => {
    const message = `${currentPlayer.name} - ${action}`
    showToast(message)
    communityLog(message)

    switch (action) {
      case COMMUNITY_CARDS.GET_OUT_OF_JAIL_FREE: {
        currentPlayer.getOutOfJailFree += 1
        break
      }
      case COMMUNITY_CARDS.SECOND_PRIZE: {
        currentPlayer.balance += 10
        break
      }
      case COMMUNITY_CARDS.SALE_OF_STOCK: {
        currentPlayer.balance += 50
        break
      }
      case COMMUNITY_CARDS.LIFE_INSURANCE: {
        currentPlayer.balance += 100
        break
      }
      case COMMUNITY_CARDS.INCOME_TAX_REFUND: {
        currentPlayer.balance += 20
        break
      }

      case COMMUNITY_CARDS.HOLIDAY_FUND_MATURES: {
        currentPlayer.balance += 100
        break
      }
      case COMMUNITY_CARDS.INHERIT: {
        currentPlayer.balance += 100
        break
      }

      case COMMUNITY_CARDS.CONSULTANCY_FEE: {
        currentPlayer.balance += 25
        break
      }
      case COMMUNITY_CARDS.HOSPITAL_FEE: {
        currentPlayer.balance -= 100
        break
      }
      case COMMUNITY_CARDS.BANK_ERROR: {
        currentPlayer.balance += 200
        break
      }
      case COMMUNITY_CARDS.SCHOOL_FEES: {
        currentPlayer.balance -= 50
        break
      }

      case COMMUNITY_CARDS.DOCTOR_FEES: {
        currentPlayer.balance -= 50
        break
      }

      case COMMUNITY_CARDS.BIRTHDAY: {
        ;[...players].forEach((player) => {
          player.balance -= 10
        })
        currentPlayer.balance += [...players].length * 10
        break
      }

      case COMMUNITY_CARDS.ADVANCE_TO_GO: {
        currentPlayer.currentIndex = 1
        currentPlayer.balance += 200
        break
      }

      case COMMUNITY_CARDS.GO_TO_JAIL: {
        currentPlayer.currentIndex = 11
        currentPlayer.isInJail = 1
        break
      }

      case COMMUNITY_CARDS.STREET_REPAIRS: {
        const toPay = currentPlayer.ownedProperties.length * 40
        currentPlayer.balance -= toPay
        break
      }
      default:
        return
    }
  }

  const getPopupContent = () => {
    return (
      <>
        <h5 className="popup-header">Please Choose Action</h5>
        <h6>
          Property
          {playerAction === 'Buy'
            ? ` Price : $${boxType.price}`
            : ` Rent : $${getCurrentRentForProperty()}`}
        </h6>
        <h6>Property Name : {name}</h6>
        <h6>Player Name : {currentPlayer.name}</h6>
        <br />
        <button
          className="input"
          style={{ width: '100%', color: 'white', backgroundColor: 'green' }}
          type="button"
          onClick={handlePropertyTransaction}
        >
          {playerAction}
        </button>
      </>
    )
  }

  const monopolyLog = (transactionType, message) =>
    monopolyInstance.logs.push(`${transactionType} - ${message}`)

  const logger = curry(monopolyLog)

  const chanceLog = logger('Chance Card Picked')
  const communityLog = logger('Community Card Picked')
  const transactionLog = logger('Transaction')

  useEffect(() => {
    if (
      currentPlayer &&
      currentPlayer.currentIndex === id &&
      currentPlayer.lastTurnBlockID !== id
    ) {
      if (
        boxType.type === BOX_TYPES.AVENUE ||
        boxType.type === BOX_TYPES.UTILITIES ||
        boxType.type === BOX_TYPES.RAILROADS
      ) {
        handlePropertyDealing()
      } else if (boxType.type === BOX_TYPES.JAIL) {
        if (currentPlayer.isInJail === 1) {
          if (currentPlayer.getOutOfJailFree > 0) {
            currentPlayer.getOutOfJailFree -= 1
            const message = `${currentPlayer.name} Got Out of Jail Using GET OUT OF JAIL FREE CARD`
            showToast(message)
            transactionLog(message)
          } else {
            currentPlayer.balance -= 50
            const message = `${currentPlayer.name} Paid $50 to Get Out of Jail`
            showToast(message)
            transactionLog(message)
          }
          currentPlayer.isInJail = 0
        }
        toggleCurrentTurn()
      } else if (boxType.type === BOX_TYPES.GO_TO_JAIL) {
        currentPlayer.isInJail = 1
        currentPlayer.currentIndex = 11
        toggleCurrentTurn()
      } else if (boxType.type === BOX_TYPES.COMMUNITY) {
        const communityCard = getRandomElementFromArray(monopolyInstance.communityCards)
        communityAction(communityCard)
        toggleCurrentTurn()
      } else if (boxType.type === BOX_TYPES.CHANCE) {
        const chanceCard = getRandomElementFromArray(monopolyInstance.chanceCards)
        chanceAction(chanceCard)
      } else if (boxType.type === BOX_TYPES.TAX) {
        currentPlayer.balance -= boxType.price
        const message = `${currentPlayer.name} Paid ${name} of $${boxType.price}`
        showToast(message)
        transactionLog(message)
        toggleCurrentTurn()
      } else {
        toggleCurrentTurn()
      }
    }
    if (currentPlayer && currentPlayer.currentIndex === id) {
      currentPlayer.lastTurnBlockID = id
    }
    if (currentPlayer && currentPlayer.balance <= 0) {
      removePlayerFromGame(currentPlayer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(currentPlayer)])

  const getBoxText = () => {
    if (
      boxType.type === BOX_TYPES.GO_TO_JAIL ||
      boxType.type === BOX_TYPES.JAIL ||
      boxType.type === BOX_TYPES.PARKING ||
      boxType.type === BOX_TYPES.UTILITIES
    )
      return name
    else return ''
  }

  return (
    <div className={type}>
      {boxType.type === BOX_TYPES.GO && <GoBox name={name} />}
      {boxType.type === BOX_TYPES.AVENUE && <AvenueBox {...props} />}
      {boxType.type === BOX_TYPES.CHANCE && <SpecialBox type={boxType.type} />}
      {boxType.type === BOX_TYPES.COMMUNITY && <SpecialBox type={boxType.type} />}
      {boxType.type === BOX_TYPES.RAILROADS && <SpecialBox {...props} type={boxType.type} />}
      {boxType.type === BOX_TYPES.TAX && <SpecialBox {...props} type={boxType.type} />}
      {boxType.type === BOX_TYPES.GO_TO_JAIL}
      <div className="player-current-position">{showPlayerCurrentPosition()}</div>
      <div className="main-box-text">{getBoxText()}</div>
      {getPropertyBoughtColor()}
      {playerAction && <ActionPopup>{getPopupContent()}</ActionPopup>}
    </div>
  )
}
