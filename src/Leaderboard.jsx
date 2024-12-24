import { useEffect, useState } from "react";
const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    useEffect(() => {
        fetch("https://localhost:7162/User/leaderboard",
          {
            credentials: 'include'
          }
        )
        .then((response) => response.json())
        .then((data) => createLeaderboard(data))
      }, [])

    const createLeaderboard = (data) => {
        console.log(data)
        let leaderboardData = data.sort(compareLeaderboard);
        leaderboardData = leaderboardData.slice(0, 10);
        setLeaderboard(leaderboardData);
    }

    const compareLeaderboard = (a, b) => {
        if(a.wins < b.wins){
            return 1;
        }
        else if(a.wins > b.wins){
            return -1;
        }
        return 0;
    }

    return (
        <div style={{color: "white", marginTop:"10px"}}>
            <h3>Leaderboard</h3>
            <div className='container' style={{border: "#b5adad", borderStyle: "solid"}}>
                <div className="row" style={{borderBottom: "#b5adad", borderBottomStyle: "solid"}}>
                    <div className="col-2"></div>
                    <div className="col-5">Name</div>
                    <div className="col-5">Wins</div>
                </div>
                {leaderboard.map((usr, i) => {
                    return(
                        <div className="row" key={i}>
                            <div style={{borderRight: "#b5adad", borderRightStyle: "solid"}} className="col-2">{i + 1}.</div>
                            <div style={{overflow: 'hidden', textOverflow: "ellipsis", borderRight: "#b5adad", borderRightStyle: "solid"}} className="col-5">{usr.name}</div>
                            <div className="col-5">{usr.wins}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
    
}

export default Leaderboard