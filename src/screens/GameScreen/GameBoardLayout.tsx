/* eslint-disable @typescript-eslint/no-explicit-any */
import data from "../../data/gameBlocks.json";
import { SQUARE_TYPES } from "../../Constants";
import { GameBox } from "../../components";
import { BOX_TYPES } from "../../Constants";
import die1 from "../../assets/Die_1.png";
import die2 from "../../assets/Die_2.png";
import die3 from "../../assets/Die_3.png";
import die4 from "../../assets/Die_4.png";
import die5 from "../../assets/Die_5.png";
import die6 from "../../assets/Die_6.png";
import { monopolyInstance } from "../../models/Monopoly";

export const GameBoardLayout = (props: {
  players?: any;
  onDiceRoll?: any;
  diceValues?: any;
  toggleLogs?: any;
  showLogs?: any;
  gameStatus?: any;
  currentPlayer?: any;
  toggleCurrentTurn?: any;
  removePlayerFromGame?: any;
}) => {
  const {
    onDiceRoll,
    diceValues,
    toggleLogs,
    showLogs,
    gameStatus,
    currentPlayer,
  } = props;

  const getGameBottomSide = () => data.slice(0, 11).reverse();

  const getGameLeftSide = () => [...data.slice(11, 20).reverse()];

  const getGameRightSide = () => data.slice(31, 40);

  const getGameTopSide = () => data.slice(20, 31).reverse();

  const getBoxType = (
    boxElement:
      | {
          name: string;
          pricetext: string;
          color: string;
          price: string;
          groupNumber: string;
          baserent: string;
          rent1: string;
          rent2: string;
          rent3: string;
          rent4: string;
          rent5: string;
        }
      | {
          name: string;
          pricetext: string;
          color: string;
          price: number;
          groupNumber: number;
          baserent: number;
          rent1: number;
          rent2: number;
          rent3: number;
          rent4: number;
          rent5: number;
        }
      | {
          name: string;
          pricetext: string;
          color: string;
          price: number;
          groupNumber: number;
          baserent: string;
          rent1: string;
          rent2: string;
          rent3: string;
          rent4: string;
          rent5: string;
        }
  ) => {
    const { name, pricetext, baserent, price } = boxElement;
    const nameInLowerCase = name.toLowerCase();
    if (nameInLowerCase === "go") {
      return { type: BOX_TYPES.GO, price: 200 };
    } else if (nameInLowerCase.includes("tax"))
      return {
        type: BOX_TYPES.TAX,
        price: parseInt(pricetext.replace(/^\D+/g, "")),
      };
    else if (nameInLowerCase === "just visiting")
      return { type: BOX_TYPES.JAIL, price: null };
    else if (nameInLowerCase === "free parking")
      return { type: BOX_TYPES.PARKING, price: null };
    else if (nameInLowerCase === "chance")
      return { type: BOX_TYPES.CHANCE, price: null };
    else if (nameInLowerCase === "community chest")
      return { type: BOX_TYPES.COMMUNITY, price: null };
    else if (nameInLowerCase === "go to jail")
      return { type: BOX_TYPES.GO_TO_JAIL, price: null };
    else if (
      nameInLowerCase.includes("railroad") ||
      nameInLowerCase.includes("short line")
    )
      return { type: BOX_TYPES.RAILROADS, price };
    else if (typeof baserent === "string" && typeof price === "number")
      return {
        type: BOX_TYPES.UTILITIES,
        price,
      };
    else if (typeof baserent === "number")
      return {
        type: BOX_TYPES.AVENUE,
        price,
      };
  };

  const getDiceImage = (diceValue: number) => {
    if (diceValue === 1) return die1;
    if (diceValue === 2) return die2;
    if (diceValue === 3) return die3;
    if (diceValue === 4) return die4;
    if (diceValue === 5) return die5;
    if (diceValue === 6) return die6;
  };

  return (
    <div className="mainSquare">
      <div className="row top">
        {getGameTopSide().map((element, index) => {
          if (index === 0 || index === 10) {
            return (
              <GameBox
                type={SQUARE_TYPES.CORNER_SQUARE}
                id={20 + index + 1}
                key={index}
                boxType={getBoxType(element)}
                {...element}
                {...props}
              />
            );
          }
          return (
            <GameBox
              type={SQUARE_TYPES.VERTICAL_SQUARE}
              id={20 + index + 1}
              key={index}
              boxType={getBoxType(element)}
              {...element}
              {...props}
            />
          );
        })}
      </div>
      <div className="row center">
        <div className="corner-square">
          {getGameLeftSide().map((element, index) => {
            return (
              <GameBox
                type={SQUARE_TYPES.SIDE_SQUARE}
                id={11 + (9 - index)}
                key={index}
                boxType={getBoxType(element)}
                {...element}
                {...props}
              />
            );
          })}
        </div>
        <div className="center-square">
          <div className="center-square-container">
            <div className="balance-wrap">
              <div className="player-balance">
                <b> Balances</b>
              </div>

              {[...props.players].map(({ balance, color, name }, index) => (
                <div className="player-balance">
                  <div
                    style={{ border: `2px solid ${color}` }}
                    className="player-balance-item"
                  >
                    <span>
                      {name} ${balance}
                      {!index ? <span style={{ color: "red" }}>*</span> : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="dices">
              {getDiceImage(diceValues.one) && (
                <img
                  src={getDiceImage(diceValues.one)}
                  alt="Dice 1"
                  className="dice-1"
                />
              )}
              {getDiceImage(diceValues.two) && (
                <img
                  src={getDiceImage(diceValues.two)}
                  alt="Dice 2"
                  className="dice-2"
                />
              )}
            </div>

            {showLogs && (
              <div className="logs">
                <ul>
                  <button className="close-logs-btn" onClick={toggleLogs}>
                    ✗
                  </button>
                  {monopolyInstance.logs.map((log) => (
                    <li>{log}</li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ marginTop: "3rem" }}>
              {gameStatus ? (
                <button
                  type="button"
                  onClick={onDiceRoll}
                  className="roll-dice-1"
                >
                  Roll Dices
                </button>
              ) : (
                <div className="game-over">
                  Game Over {currentPlayer.name} Wins{" "}
                </div>
              )}

              <button type="button" onClick={toggleLogs} className="show-logs">
                {showLogs ? "Hide" : "Show"} Logs
              </button>
            </div>
          </div>
        </div>
        <div className="corner-square">
          {getGameRightSide().map((element, index) => {
            return (
              <GameBox
                type={SQUARE_TYPES.SIDE_SQUARE}
                id={31 + index + 1}
                key={index}
                boxType={getBoxType(element)}
                {...element}
                {...props}
              />
            );
          })}
        </div>
      </div>
      <div className="row top">
        {getGameBottomSide().map((element, index) => (
          <GameBox
            type={
              index === 0 || index === 10
                ? SQUARE_TYPES.CORNER_SQUARE
                : SQUARE_TYPES.VERTICAL_SQUARE
            }
            id={11 - index}
            key={index}
            boxType={getBoxType(element)}
            {...element}
            {...props}
          />
        ))}
      </div>
    </div>
  );
};
