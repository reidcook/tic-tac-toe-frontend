import { Col, Container, Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import WaitingRoom from './components/WaitingRoom'
import TicTacToe from './components/TicTacToe'
import Login from './Login'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

function App() {
  const [conn, setConnection] = useState();
  const [game, setGame] = useState();
  const [theUsername, setUsername] = useState();
  const [symbol, setSymbol] = useState();
  const [message, setMessage] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const WINSTATES = {0: "", 1: "You Won", 2: "Opponent Won"};
  const [winState, setWinState] = useState(WINSTATES[0]);

  useEffect(() => {
    fetch("https://localhost:7162/User/getUser",
      {
        credentials: 'include'
      }
    )
    .then((response) => response.json())
    .then((data) => {
      if(data){
        console.log(data)
        setUsername(data.userName)
        setLoggedIn(true)
      }
      else{
        setUsername("Logged Out")
      }
    })
  }, [])


  const joinGame = async (username, gameId) => {
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

  if(!loggedIn){
    return( 
      <div>
        <span style={{color: 'white'}}>{theUsername}</span>
      <main>
        <Container style={{width:"30%", textAlign: "center", marginTop: "15%"}}>
          <Row>
            <Col sm={12}>
              <h1 style={{color: 'white'}}>Login</h1>
            </Col>
          </Row>
          <Login setUsername={setUsername} setLoggedIn={setLoggedIn}/>
        </Container>
      </main>
    </div>)
  }

  if(game){
    return(<TicTacToe game={game} winState={winState} conn={conn} username={theUsername} symbol={symbol}/>)
  }
  else{
    return (
      <div>
        <span style={{color: 'white'}}>Username: {theUsername}</span>
        <main>
          <Container style={{width:"30%", textAlign: "center", marginTop: "15%"}}>
            <Row>
              <Col sm={12}>
                <h1 style={{color: 'white'}}>Welcome to..... TIC-TAC-TOE</h1>
              </Col>
            </Row>
            <WaitingRoom username={theUsername} joinGame={joinGame}></WaitingRoom>
            {message}
          </Container>
        </main>
      </div>
    )
  }
}

export default App
