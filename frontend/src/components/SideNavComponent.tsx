import LogoutComponent from './LogoutComponent';
import './../styles/sidenav.css';

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
            <button type="button" id="typeButton" className="buttons sideNavButtons" onClick={gotoType}>Typing</button>
            <button type="button" id="profileButton" className="buttons sideNavButtons" onClick={gotoProfile}>Profile</button>
            <button type="button" id="leaderboardButton" className="buttons sideNavButtons" onClick={gotoLeaderboard}>Leaderboard</button>
            <LogoutComponent/>
        </div >
    );
};

export default SideNavComponent;