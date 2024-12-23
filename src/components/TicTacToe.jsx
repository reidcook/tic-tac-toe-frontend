import { useEffect, useState } from 'react';
import '../App.css'

const TicTacToe = (props) => {
    const [connectionState, setConnectionState] = useState(0);
    const [theGameState, setGameState] = useState(["", "", "", "", "", "", "", "", ""]);
    const [wonMessage, setWonMessage] = useState("");
    const [turn , setTurn] = useState("");
    const CONNECTSTATUS = {0: "Waiting for other player to connect...", 1: "Both Players Connected"}

    useEffect(() => {
        setGameState(props.game.gameState);
        setWonMessage(props.winState);
        setTurn(props.game.turn);
        if(props.game.player2 && props.game.player1){
            setConnectionState(1)
        }
        else{
            setConnectionState(0)
        }
    }, [props])

    const spaceClicked = async(spaceNum) => {
        if(turn === props.username && wonMessage === ""){
            let gameState = [...theGameState];
            let id = props.game.id.toString();
            gameState[spaceNum] = props.symbol;
            console.log(props)
            // Solo Game
            if(id === '-1'){
                setGameState(gameState);
                if(winCheck(gameState)){
                    setWonMessage("You Won");
                    setTurn("");
                }
                else{
                    aiPlay(gameState);
                }
            }
            else{
                try {
                    await props.conn.invoke("UpdateGameState", id, gameState)
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    const winCheck = (gameState) => {
        for(let i = 0; i < 3; i++){
            // Checking veritcal
            if (gameState[i] != "" & gameState[i] == gameState[i + 3] & gameState[i] == gameState[i + 6]){
                return true;
            }
            // Checking Horizontal
            if (gameState[i * 3] != "" & gameState[i * 3] == gameState[(i * 3) + 1] & gameState[i * 3] == gameState[(i * 3) + 2]){
                return true;
            }
        }
        //Checking diagonal
        if (gameState[0] != "" & gameState[0] == gameState[4] & gameState[0] == gameState[8]){
            return true;
        }
        if (gameState[2] != "" & gameState[2] == gameState[4] & gameState[2] == gameState[6]){
            return true;
        }
        return false;
    }

    const aiPlay = (state) => {
        let move = Math.floor(Math.random() * 10);
        while(state[move] != ''){
            move = Math.floor(Math.random() * 10);
        }
        state[move] = 'O';
        setGameState(state);
        if(winCheck(state)){
            setWonMessage("Opponent Won");
        }
        setTurn(props.username);
    }

    return (
        <>
            <h3 style={{color: 'white'}}>Status: <span style={connectionState === 0 ? {color: 'red'} : {color: 'green'}}>{CONNECTSTATUS[connectionState]}</span></h3>
            <button className="btn btn-danger" type="button" onClick={() => window.location.reload(false)}>Disconnect</button>
            <h1 style={{textAlign: 'center', marginTop: '50px', color: 'white'}}>
                Tic-Tac-Toe
            </h1>
            {wonMessage === "" ?  
                <h2 style={{textAlign: 'center', marginBottom: '50px', marginTop: '50px', color: 'white'}}>
                    Turn: {turn}
                </h2> :
                <h2 style={{textAlign: 'center', marginBottom: '50px', marginTop: '50px', color: 'white'}}>
                    {wonMessage}
                </h2>
            }
            <div className="container game">
                <div className="row row-1">
                    <div className="square" onClick={() => spaceClicked(0)}>{theGameState[0]}</div>
                    <div className="square" onClick={() => spaceClicked(1)}>{theGameState[1]}</div>
                    <div className="square" onClick={() => spaceClicked(2)}>{theGameState[2]}</div>
                </div>
                <div className="row row-2">
                    <div className="square" onClick={() => spaceClicked(3)}>{theGameState[3]}</div>
                    <div className="square" onClick={() => spaceClicked(4)}>{theGameState[4]}</div>
                    <div className="square" onClick={() => spaceClicked(5)}>{theGameState[5]}</div>
                </div>
                <div className="row row-3">
                    <div className="square" onClick={() => spaceClicked(6)}>{theGameState[6]}</div>
                    <div className="square" onClick={() => spaceClicked(7)}>{theGameState[7]}</div>
                    <div className="square" onClick={() => spaceClicked(8)}>{theGameState[8]}</div>
                </div>
            </div>
        </>
    )
}

export default TicTacToe