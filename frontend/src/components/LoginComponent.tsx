import React, { useState } from 'react';
function LoginComponent() {
    const [message, setMessage] = React.useState('');
    const [loginName, setLoginName] = React.useState('');
    const [loginPassword, setPassword] = React.useState('');
    async function doLogin(event: any): Promise<void> {
        event.preventDefault();
        var obj = { login: loginName, password: loginPassword };
        var js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/login',
                {
                    method: 'POST', body: js, headers: {
                        'Content-Type':
                            'application/json'
                    }
                });
            var res = JSON.parse(await response.text());
            if (res.error != '') {
                setMessage(res.error);
            }
            else {
                var user =
                    { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/type';
            }
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    function handleSetLoginName(e: any): void {
        setLoginName(e.target.value);
    }
    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }
    return (
        <div id="loginDiv">
            <span id="inner-title">Login</span><br />
            <input type="text" id="loginName" placeholder="Username" onChange={handleSetLoginName} />
            <input type="password" id="loginPassword" placeholder="Password" onChange={handleSetPassword} />
            <input type="submit" id="loginButton" className="buttons" value="Do It"
                onClick={doLogin} />
            <br/>
            <span id="loginResult">{message}</span>
        </div>
    );
};


export default LoginComponent;