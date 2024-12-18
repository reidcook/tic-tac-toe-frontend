import { Col, Container, Row } from 'react-bootstrap'
import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import WaitingRoom from './components/WaitingRoom'
import TicTacToe from './components/TicTacToe'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function App() {
  const [conn, setConnection] = useState();
  const [game, setGame] = useState();
  const [theUsername, setUsername] = useState();
  const [symbol, setSymbol] = useState();
  const [message, setMessage] = useState();

  const WINSTATES = {0: "", 1: "You Won", 2: "Opponent Won"};
  const [winState, setWinState] = useState(WINSTATES[0]);

  const joinGame = async (username, gameId) => {
    setUsername(username);
    try {
      // init connection
      const conn = new HubConnectionBuilder().withUrl("https://localhost:7162/GameConnect/").configureLogging(LogLevel.Information).build();

      // handlers
      conn.on("JoinSpecificGame", ( theGame ) => {
        // Game is Full
        if(theGame === null){
          setMessage("This game is already full. Try another game id.")
        }
        else{
          setGame(theGame);
          if(theGame.player1 === username){
            setSymbol('X');
          }
          else{
            setSymbol('O');
          }
        }
      })

      conn.on("UpdateGameState", ( tempGame, winner ) => {
        setGame(tempGame);
        if(winner){
          if(winner === username){
            setWinState(WINSTATES[1]);
          }
          else{
            setWinState(WINSTATES[2]);
          }
        }
      })

      await conn.start();
      await conn.invoke("JoinSpecificGame", {username, gameId})

      setConnection(conn)

    } catch (error) {
      console.log(error)
    }
  }

  if(game){
    return(<TicTacToe game={game} winState={winState} conn={conn} username={theUsername} symbol={symbol}/>)
  }
  else{
    return (
      <div>
        <main>
          <Container style={{width:"30%", textAlign: "center", marginTop: "15%"}}>
            <Row>
              <Col sm={12}>
                <h1 style={{color: 'white'}}>Welcome to..... TIC-TAC-TOE</h1>
              </Col>
            </Row>
            <WaitingRoom joinGame={joinGame}></WaitingRoom>
            {message}
          </Container>
        </main>
      </div>
    )
  }
}

export default App
