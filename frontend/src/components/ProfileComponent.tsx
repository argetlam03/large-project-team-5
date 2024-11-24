import React, { useState } from 'react';
function ProfileComponent() {
    var _ud = localStorage.getItem('user_data');
    
    const [message, setMessage] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [loginName, setLoginName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [avgAcc, setAvgAcc] = React.useState('');
    const [avgWpm, setAvgWpm] = React.useState('');
    const [maxWpm, setMaxWpm] = React.useState('');

    async function getUser(): Promise<void> {
        var obj = {id: JSON.parse(_ud ? _ud : '').id};
        var js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/getUser',
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
                setMessage('');
                setFirstName(res.firstName);
                setLastName(res.lastName);
                setLoginName(res.loginName);
                setEmail(res.email);
                setAvgAcc(res.avgAcc);
                setAvgWpm(res.avgWpm);
                setMaxWpm(res.maxWpm);
            }
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    getUser();
    return (
        <div id="profileHeader">
            <span>
                {firstName}
            </span>
            <span>
                {lastName}
            </span>
            <span>
                {loginName}
            </span>
            <span>
                {email}
            </span>
            <span>
                {avgAcc}
            </span>
            <span>
                {avgWpm}
            </span>
            <span>
                {maxWpm}
            </span>
            <span>
                {message}
            </span>
            show profile hopefully

        </div >
    );
};

export default ProfileComponent;