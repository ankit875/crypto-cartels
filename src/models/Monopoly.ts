import './Player'
import { Player } from './Player'
import { Cycled } from '../utilities'
import communityCards from '../data/communityCards.json'
import chanceCards from '../data/chanceCards.json'

interface Card {
  // Define the structure of community card or chance card
  // Example:
  // description: string;
}

class Monopoly {
  public players: Cycled<Player>;
  public logs: string[];
  public communityCards: Card[];
  public chanceCards: Card[];
  public removedPlayers: Player[];

  constructor() {
    this.players = new Cycled([]);
    this.logs = [];
    this.communityCards = communityCards as Card[]; // Assuming communityCards.json structure matches Card interface
    this.chanceCards = chanceCards as Card[]; // Assuming chanceCards.json structure matches Card interface
    this.removedPlayers = [];
  }

  public set Players(newPlayers: Player[]) {
    this.players = new Cycled(newPlayers.map(({ name, color }) => new Player(name, color)));
  }

  public get Players(): Cycled<Player> {
    return this.players;
  }
}

const monopolyInstance = new Monopoly();

export { monopolyInstance };