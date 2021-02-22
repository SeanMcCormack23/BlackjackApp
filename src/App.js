// import css styles sheet
import "./styles.css";
import React, { Component } from "react";
// import JSON data containing 52 card objects from JSON.js file
import { deckOfCardsArray } from "./JSON.js";
// import reference to Header file containing navigation bar
import Header from "./Header.js";
// storing JSON data in a constant
const deckArray = deckOfCardsArray;
// generates random number to randomly select card from deck
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class App extends Component {
  constructor(props) {
    super(props);
    // state variables used throughout applciation
    this.state = {
      // array used to store all 52 cards
      cardDeck: [],
      // array used to store cards in playersHand
      playerHand: [],
      // array used to store cards in dealersHand
      dealerHand: [],
      // boolean to indicate game has started
      gameBegun: false,
      // boolean to indicate cards have been dealt
      cardsDealt: false,
      // boolean used to disable buttons after a player has selected "Stand"
      hitInactive: false,
      // boolean used to indicate players turn is over
      playerTurnOver: false,
      // boolean used to indicate the player has gone bust
      bust: false,
      // boolean used to indicate player has won
      playerWins: false,
      // boolean used to indicate dealer has won
      dealerWins: false,
      // boolean to indicate game is a draw
      draw: false
    };
  }
  // used to calculate total of player/dealer hands
  // cards from player/dealer hand arrays are iterated through with a for each
  // loop, if the card value is an Ace the card is "pushed"(added to end of the array)
  // otherwise cards are added to the front of the array using unshift
  // then a reduce function is used on this newly formed array
  // stipulating the value for face cards as 10
  // as the reduce function reaches the aces at the end of the array
  // aces can be worth a value of 1 or 11, depending on if the addition of the ace
  // results in a total exceeding 21
  // if this is the case the ace value becomes 1 rather than 11
  getCount(cards) {
    const rearranged = [];
    cards.forEach((card) => {
      if (card.Value === "A") {
        rearranged.push(card);
      } else if (card.Value) {
        rearranged.unshift(card);
      }
    });
    return rearranged.reduce((total, card) => {
      if (card.Value === "J" || card.Value === "Q" || card.Value === "K") {
        return total + 10;
      } else if (card.Value === "A") {
        if (total + 11 <= 21) {
          return total + 11;
        } else {
          return total + 1;
        }
      } else {
        return total + card.Value;
      }
    }, 0);
  }
  // This function randomly selects a card object from the deck array
  // and adds this card to the player hand array
  playerHit(card) {
    // Get a random number from length of remaining cards
    let indexToremove = getRandomInt(deckArray.length);
    // get the object at this index to remove
    var removedCard = deckArray[indexToremove];
    // add the selected card with concatenation to the playerHand array
    // and store in "joined" variable
    var joined = this.state.playerHand.concat(removedCard);
    // use getCount function to determine total value of playerHand array
    // if playerHand array total exceeds 21, the player has gone bust, update state variable bust to true
    if (this.getCount(joined) > 21) {
      this.setState({ bust: true });
    }
    // if playerHand total is greater than dealerHand array total, but not exceding 21, player has won, update state variable
    if (
      this.getCount(joined) > this.getCount(this.state.dealerHand) &&
      this.getCount(joined) <= 21
    ) {
      this.setState({ playerWon: true });
    }
    this.setState({ playerHand: joined });
    var array = deckArray.splice(indexToremove, 1);
    this.setState({ deckArray: array });
  }

  // This function adds 2 cards to the players hand array
  // when the deal card button pressed
  add2ToPlayerHandArray(card) {
    // get a random number from length of remaining cards
    let indexToremove = getRandomInt(deckArray.length);
    // get the object to remove
    var removedCard = deckArray[indexToremove];
    // add the selected card with concatenation to the playerHand array
    // and store in "joined" variable
    var joined = this.state.playerHand.concat(removedCard);
    // remove the card from the deck
    var array = deckArray.splice(indexToremove, 1);
    // update playersHand and deck state variables
    this.setState({ playerHand: joined });
    this.setState({ deckArray: array });

    // repeat process adding the second hand to playersHand array and updating
    // playersHand and the deck array
    let indexToremove2 = getRandomInt(deckArray.length);
    var removedCard2 = deckArray[indexToremove2];
    var joined2 = joined.concat(removedCard2);
    var array2 = deckArray.splice(indexToremove2, 1);
    this.setState({ playerHand: joined2 });
    this.setState({ deckArray: array2 });
  }

  // This function adds 2 cards to the dealers hand when the deal cards
  // button is pressed
  add2ToDealerHandArray(card) {
    // get a random number from length of remaining cards
    let indexToremove = getRandomInt(deckArray.length);
    // get the object to remove
    var removedCard = deckArray[indexToremove];
    // add the selected card with concatenation to the playerHand array
    // and store in "joined" variable
    var joined = this.state.dealerHand.concat(removedCard);
    // update state of dealers hand
    this.setState({ dealerHand: joined });
    // remove the card from deck
    var array = deckArray.splice(indexToremove, 1);
    // update playersHand and deck state variables
    this.setState({ cardDeck: array });
    // repeat same process as above to add the second card to dealers
    // hannd, updating both the dealersHand and the deck
    let indexToremove2 = getRandomInt(deckArray.length);
    var removedCard2 = deckArray[indexToremove2];
    var joined2 = joined.concat(removedCard2);
    var array2 = deckArray.splice(indexToremove2, 1);
    this.setState({ dealerHand: joined2 });
    this.setState({ deckArray: array2 });
  }
  // This function sets the state of the boolean variables playerTurnOver, hitInactive,
  // and dealersTurn to true
  stand(playersHand, dealersHand) {
    this.setState({ playerTurnOver: true });
    this.setState({ hitInactive: true });
    this.setState({ dealersTurn: true });
    var playerTotal = this.getCount(this.state.playerHand);
    var dealerTotal = this.getCount(this.state.dealerHand);

    // the following are if/else if statements determining the players position after
    // standing
    if (
      // if the players total is greater than the dealers and also
      // less than 21, playerWins state variable is updated to true
      playerTotal > dealerTotal &&
      playerTotal <= 21
    ) {
      this.setState({ playerWins: true });
      // if the player total is less than the dealers dealerWins
      // state is updated to true
    } else if (playerTotal < dealerTotal) {
      this.setState({ dealerWins: true });
      // if player total and dealer total are equal, the draw state
      // variable is updated to true
    } else if (playerTotal === dealerTotal) {
      this.setState({ draw: true });
      // else the player is bust and the bust state variable is
      // set to true
    } else {
      this.setState({ bust: true });
    }
  }

  // this reloads the window the window to refresh the deck
  // a bit hacky but unfortuantely we couldn't get the state of the
  // deck to update with the JSOn data if it became empty
  startNewGame() {
    window.location.reload();
  }

  // this function calls the add2ToPlayerHandArray and
  //add2ToDealerHandArray functions. It also update the state
  // variable gameBegun and cardsDealt to true
  dealCards() {
    this.setState({ gameBegun: true });
    this.add2ToPlayerHandArray();
    this.add2ToDealerHandArray();
    this.setState({ cardsDealt: true });
  }

  render() {
    // declaring a state variable which will be used latere to disable our buttons
    var playerHitDisable = false;
    // setting the playerHitDiable variable to be true if all the variables
    // listed in the if statement below are true
    if (
      (this.state.playerTurnOver === true && this.state.hitInactive === true) ||
      this.state.bust === true ||
      this.state.playerWins === true ||
      this.state.dealerWins === true ||
      this.state.draw === true
    ) {
      playerHitDisable = true;
    }

    // the require method is used here to create a link to render the image
    // file in the map functions below, which are referenced in the JSON
    const image = (link) => require(`${link}`);

    // assigning the value of this.state.playerHand and this.state.dealerHand
    // to variables
    const playersHand = this.state.playerHand;
    const dealersHand = this.state.dealerHand;

    return (
      // div to contain entire App page
      <div className="App">
        {/* element to render navigation bar at top of page */}
        <Header />
        {/* div to contain the Deal Card button */}
        <div className="dealButton">
          <button
            button
            type="button"
            // bootstrap class for button styling
            class="btn btn-dark btn-circle btn-xl"
            // button will be disabled when cardsDealt is true
            disabled={this.state.cardsDealt}
            // an event listener which on the click of the Deal Cards button will
            // call the function dealCards and start the game
            onClick={() => this.dealCards()}
          >
            Deal Cards
          </button>
        </div>{" "}
        {/* closing of dealButton div */}
        {/* div to contain the hit, stand and new game buttons */}
        <div className="buttons">
          {/* the stand button will render when cardsDealt is true */}
          {this.state.cardsDealt && (
            <button
              button
              type="button"
              // bootstrap class for button styling
              class="btn btn-dark btn-circle btn-xl"
              // button will be disabled when playerHitDisabler is true
              disabled={playerHitDisable}
              // an event listener which on the click of the player stand button will
              // call the stand function
              onClick={() => this.stand()}
            >
              Player Stand
            </button>
          )}
          {/* the playerHit button will render when cardsDealt is true */}
          {this.state.cardsDealt && (
            <button
              button
              type="button"
              // bootstrap class for button styling
              class="btn btn-dark btn-circle btn-xl"
              // button will be disabled when playerHitDisabler is true
              disabled={playerHitDisable}
              // an event listener which on the click of the player hit button
              // will call the playerHit function
              onClick={() => this.playerHit()}
            >
              Player Hit
            </button>
          )}
          {/* the startNewGame button will render when cardsDealt is true */}
          {this.state.cardsDealt && (
            <button
              button
              type="button"
              // bootstrap class for button styling
              class="btn btn-dark btn-circle btn-xl"
              // button will be disabled when when gameBegun is false
              disabled={!this.state.gameBegun}
              // an event listener which on the click of the start new game
              // button  will call the startNewGame function
              onClick={() => this.startNewGame()}
            >
              New Game
            </button>
          )}
        </div>
        {/* div to contain the rendering of the text informing the 
        player whether they have won, lost drawn or went bust */}
        <div className="gameDecision">
          {/* if playerWins and playerTurnOver are true, YOU WIN is rendered 
          to the screen */}
          {this.state.playerWins && this.state.playerTurnOver && (
            <h1>YOU WIN</h1>
          )}
          {/* if dealerWins is true, YOU LOSE is rendered to the screen */}
          {this.state.dealerWins && <h1>YOU LOSE</h1>}
          {/* if draw is true, DRAW is rendered to the screen */}
          {this.state.draw && <h1> DRAW</h1>}
          {/* if bust is true, BUST, YOU LOSE is rendered to the screen */}
          {this.state.bust && <h1> BUST, YOU LOSE!</h1>}
        </div>
        {/* if gameBegun is true the heading Your Cards and the total of 
        the players hand is rendered to the screen */}
        {this.state.gameBegun && (
          // div containing players cards and the total of the players hand
          <div className="player">
            <h2> Your Cards</h2>
            Total: {this.getCount(playersHand)}
          </div>
        )}
        {/* the map function below is called if gameBegun is true */}
        {this.state.gameBegun && (
          // div containing the rendered card images in the playersHand array
          <div className="playersCards">
            {/* map funciton iterating through playersHand array and rendering the card
            images */}
            {playersHand.map((c, ID) => (
              // the unique key is set to the ID property of the object
              <tr key={ID} className="cards">
                <td>
                  {/* the below image tag maps the image using the path stored
                  in the const image declared at the top of the render function  */}
                  <img
                    // reference to image path
                    src={image(c.Image)}
                    // bootstrap responsive image class
                    class="img-responsive"
                    // this will render the Value property of the object if there
                    // is an issue rendering the image
                    alt={c.Value}
                    // These two attributes set the height and width of the image in pixels
                    width="60"
                    height="120"
                  />
                </td>
              </tr>
            ))}
          </div>
        )}
        {/* if playerTurnOver is true the heading Dealers Cards and the total of 
        the dealers hand is rendered to the screen */}
        {this.state.playerTurnOver && (
          // div containing the Dealers Cards title and dealersHand total
          <div className="dealer">
            <h2>Dealers Cards</h2>
            Total: {this.getCount(dealersHand)}
          </div>
        )}
        {/* the map function below is called if playerTurnOver is true i.e
        if the player has pressed the stand button */}
        {this.state.playerTurnOver && (
          // div containing dealers cards and the total of the dealers hand
          <div className="dealersCards">
            {/* map funciton iterating through dealersHand array and rendering the card
            images */}
            {dealersHand.map((c, ID) => (
              // the unique key is set to the ID property of the object
              <tr key={ID} className="cards">
                <td>
                  {/* the below image tag maps the image using the path stored
                  in the const image declared at the top of the render function  */}
                  <img
                    // reference to image path
                    src={image(c.Image)}
                    // bootstrap responsive image class
                    class="img.responsive"
                    // this will render the Value property of the object if there
                    // is an issue rendering the image
                    alt={c.Value}
                    // These two attributes set the height and width of the image in pixels
                    width="60"
                    height="120"
                  />
                </td>
              </tr>
            ))}
          </div>
        )}
        {/* if bust is true the heading Dealers Cards and the total of 
        the dealers hand is rendered to the screen */}
        {this.state.bust && (
          // the info that will be rendered is the same as above
          <div className="dealer">
            <h2>Dealers Cards</h2>
            <p>Total {this.getCount(dealersHand)}</p>
          </div>
        )}
        {/* the map function below is called if bust is true i.e
          / if the players hand total has exceeded 21
          / the image mapping follows the same logic and 
          / the same semantics as above*/}
        {this.state.bust && (
          <div className="dealersCards">
            {dealersHand.map((c, ID) => (
              <tr key={ID} className="cards">
                <td>
                  <img
                    src={image(c.Image)}
                    class="img.responsive"
                    alt={c.Value}
                    width="60"
                    height="120"
                  />
                </td>
              </tr>
            ))}
          </div>
        )}
      </div>
    ); // end of return
  } // end of render
} // end of class App
export default App;
