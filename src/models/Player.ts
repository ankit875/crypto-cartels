export class Player {
  name: string
  color: string
  balance: number
  currentIndex: number
  ownedProperties: never[]
  playerTurn: number
  lastTurnBlockID: null
  lastDiceValue: number
  getOutOfJailFree: number
  constructor(playerName: string, color: string) {
    this.name = playerName
    this.color = color
    this.balance = 1500
    this.currentIndex = 1
    this.ownedProperties = []
    this.playerTurn = 0
    this.lastTurnBlockID = null
    this.lastDiceValue = 0
    this.getOutOfJailFree = 0
  }
}
