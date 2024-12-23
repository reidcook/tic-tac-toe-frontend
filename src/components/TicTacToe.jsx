import { useEffect, useState } from 'react';
import '../App.css'

const TicTacToe = (props) => {
    const [connectionState, setConnectionState] = useState(0);
    const [theGameState, setGameState] = useState(["", "", "", "", "", "", "", "", ""])
    const CONNECTSTATUS = {0: "Waiting for other player to connect...", 1: "Both Players Connected"}

    useEffect(() => {
        setGameState(props.game.gameState)
        if(props.game.player2 && props.game.player1){
            setConnectionState(1)
        }
        else{
            setConnectionState(0)
        }
    }, [props])

    const spaceClicked = async(spaceNum) => {
        if(props.game.turn === props.username){
            let gameState = [...theGameState];
            let id = props.game.id.toString();
            gameState[spaceNum] = props.symbol;
            // setGameState(tempGameState);
            try {
                await props.conn.invoke("UpdateGameState", id, gameState)
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            <h3 style={{color: 'white'}}>Status: <span style={connectionState === 0 ? {color: 'red'} : {color: 'green'}}>{CONNECTSTATUS[connectionState]}</span></h3>
            <h1 style={{textAlign: 'center', marginTop: '50px', color: 'white'}}>
                Tic-Tac-Toe
            </h1>
            {props.winState === "" ?  
                <h2 style={{textAlign: 'center', marginBottom: '50px', marginTop: '50px', color: 'white'}}>
                    Turn: {props.game.turn}
                </h2> :
                <h2 style={{textAlign: 'center', marginBottom: '50px', marginTop: '50px', color: 'white'}}>
                    {props.winState}
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