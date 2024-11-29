function LogoutComponent() {
    var _ud = localStorage.getItem('user_data');
    if (_ud == null) _ud = "";
    function doLogout(event: any): void {
        event.preventDefault();
        localStorage.removeItem("user_data")
        window.location.href = '/';
    };
    return (
        <span id="logout">
            <button type="button" id="logoutButton" className="buttons"
                onClick={doLogout}> Log Out </button>
        </span>
    );
};
export default LogoutComponent;