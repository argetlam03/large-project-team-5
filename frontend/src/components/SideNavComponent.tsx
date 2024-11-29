import React, { useState } from 'react';
import LogoutComponent from './LogoutComponent';
function SideNavComponent() {

    function gotoProfile(){
        window.location.href = '/profile';
    };
    function gotoLeaderboard(){
        window.location.href = '/leaderboard';
    };
    function gotoType(){
        window.location.href = '/type';
    };

    return (
        <div id="sideNavHeader">
            <input type="button" id="profileButton" className="buttons" value="Profile" onClick={gotoProfile} />
            <input type="button" id="leaderboardButton" className="buttons" value="Leaderboard" onClick={gotoLeaderboard} />
            <input type="button" id="typeButton" className="buttons" value="Type" onClick={gotoType} />
            <LogoutComponent/>
        </div >
    );
};

export default SideNavComponent;