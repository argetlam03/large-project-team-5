import React from 'react';
import './../styles/profile.css'

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
    const [recentStats, setRecentStats] = React.useState('');


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

    async function getRecentStats(): Promise<void> {
        var obj = {id: JSON.parse(_ud ? _ud : '').id};
        var js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/getRecentStats',
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
                setRecentStats(convertStats(res.stats));
            }
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    function convertStats(stats: number[]): string
    {
        var convertedStats : string = "[";
        for (var i = 0; i < stats.length - 1; i++)
        {
            convertedStats += stats[i].toString() + ", ";
        }
        convertedStats += stats[stats.length - 1].toString() + "]";
        return convertedStats;
    };

    getUser();
    getRecentStats();
    return (
        <div id="profileContainer">
            <h1>Profile</h1>
            <div id="profileInfo">
                <div>
                    First Name:&nbsp;
                    <span>{firstName}</span>
                </div>
                <div>
                    Last Name:&nbsp;
                    <span>{lastName}</span>
                </div>
                <div>
                    Username:&nbsp;
                    <span>{loginName}</span>
                </div>
                <div>
                    Email:&nbsp;
                    <span>{email}</span>
                </div>
                <div>
                    Average Accuracy:&nbsp;
                    <span>{avgAcc}%</span>
                </div>
                <div>
                    Average WPM:&nbsp;
                    <span>{avgWpm}</span>
                </div>
                <div>
                    Highest WPM:&nbsp;
                    <span>{maxWpm}</span>
                </div>
                <div>
                    Recent Stats:&nbsp;
                    <span>{recentStats}</span>
                </div>
                <div>
                    {message}
                </div>
            </div>
        </div >
    );
};

export default ProfileComponent;