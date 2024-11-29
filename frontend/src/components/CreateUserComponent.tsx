import React, { useState } from 'react';
import './../styles/login.css';

function CreateUserComponent() {
    const [message, setMessage] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [loginName, setLoginName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [loginPassword, setPassword] = React.useState('');

    async function createUser(event: any): Promise<void> {
        event.preventDefault();
        var obj = {login: loginName, password: loginPassword,  firstName: firstName, lastName: lastName, email: email};
        var js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/createUser',
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
                setFirstName('');
                setLastName('');
                setLoginName('');
                setPassword('');
                setEmail('');
                setMessage('User created successfully. Please Login');
            }
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    function handleSetFirstName(e: any): void {
        setFirstName(e.target.value);
    }
    function handleSetLastName(e: any): void {
        setLastName(e.target.value);
    }
    function handleSetLoginName(e: any): void {
        setLoginName(e.target.value);
    }
    function handleSetEmail(e: any): void {
        setEmail(e.target.value);
    }
    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }
    return (
        <div id="signUp">
            <span id="signup-title">Sign Up</span>
            <input type="text" id="firstName" placeholder="First Name" value={firstName} onChange={handleSetFirstName} />
            <input type="text" id="lastName" placeholder="Last Name" value={lastName} onChange={handleSetLastName} />
            <input type="text" id="loginName" placeholder="Username" value={loginName} onChange={handleSetLoginName} />
            <input type="text" id="email" placeholder="Email" value={email} onChange={handleSetEmail} />
            <input type="password" id="loginPassword" placeholder="Password" value={loginPassword} onChange={handleSetPassword} />
            <button type="button" id="signUpButton" className="buttons"
                onClick={createUser} >Sign Up</button>
            <br/>
            <span id="signupResult">{message}</span>
        </div>
    );
};

export default CreateUserComponent;