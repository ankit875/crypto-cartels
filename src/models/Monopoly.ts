import './Player'
import { Player } from './Player'
import { Cycled } from '../utilities'
import communityCards from '../data/communityCards.json'
import chanceCards from '../data/chanceCards.json'

class Monopoly {
  players = []
  logs = []
  communityCards = communityCards
  chanceCards = chanceCards
  removedPlayers = []

  set Players(newPlayers) {
    this.players = new Cycled(newPlayers.map(({ name, color }) => new Player(name, color)))
  }
  get Players() {
    return this.players
  }
}

const monopolyInstance = new Monopoly()
export { monopolyInstance }
