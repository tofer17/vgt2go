# VGT2GO

---

**Virtual Game Table to Go**

VGT2GO is an HTML5-based virtual game table; players select a game and play it on a single device. The device needs only be online to load the game and games can be saved and resumed.

### Planned Games ###
* Gin
* Uno
* Dominoes
* Blackjack
* Tic-tac-toe
* Chess

----

## Design Notes

When vgt2go.html is loaded in the browser, it instantiates the main VGT app. It allows the user to create a new game, or resume an existing game. "Resuming" a new game just jumps right in where it let off pretty much (the active player will need to input their PIN). 

When creating a new game, the first user is considered the "host" and gets to adjust game options in addition to inputting personal data (such as name and PIN). When done, the host selects "Add Next Player" (assuming the game permits more than one player). 

Users can continue to enter personal information. Displayed for them is a drop-down that lists: "Add Next Player," or "Return to Host;" clicking the OK button does so (which will require the Host to enter their PIN, or bring up a new-player entry). But the host would see listed "Add Next Player" and "Return to <name>"... This way, players can navigate themselves, adding new players, etc..

Game options are described on each player's entry page; these are read-only (except to the host).

Once the minimum player count is reached, the list includes "Start Game," and once the maximum is reached, "Add Next Player" is disabled. When the host ok's "Start Game," it starts; however, when other players do so, the host must enter their PIN, and then select and formally start the game-- this way, the host can make any final changes before the game starts. 

Usually the "host" is considered the "dealer" (thus often goes last) or the "first player" (e.g., White in a game of chess)-- however, this is a game option that the host can adjust. The host can also rearrange seating order.

Game-play commences and is saved to local storage often. When a game finishes, depending on the game, another round may commence (such as playing to a point limit); certain games will allow players to leave other games may allow new players between rounds (like Blackjack). When a game ends, control is returned to the host who can elect to drop players (and bang it's donw) or add new players:
* Host indicates to add a new player in drop-down, clicks "Ok."
* New player screen displays and new player enters their information, they can only click "Return to Host."
* Then the host can select "Start Next Round," or "Add New Player," etc.

Technically, selecting a new game immediately creates that and saves it. It can be resumed from that moment onwards. The game will be saved every 5 minutes, or whenever a "play" is made (such as in chess, when a piece is moved, or in Gin when a discard is made).


