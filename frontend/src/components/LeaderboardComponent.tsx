import React from 'react';
import './../styles/leaderboard.css';

function LeaderboardComponent() {
    const [message, setMessage] = React.useState('');
    const [table, setTable] = React.useState<any[]>([]);
    const [search, setSearch] = React.useState('');

    async function getLeaderboard(): Promise<void> {
        var obj = { search: '', sort: 'AvgWpm' };
        var js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/getLeaderboard',
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
                const tableData = generateTable(res.results);
                setTable([...table, ...tableData]);
            }
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };


    function generateTable(res: any[]) {
        const entries = [];

        for (let i = 0; i < res.length; i++) {
           entries.push({
            rank: i + 1,
            username: res[i].Login,
            avgAcc: res[i].AvgAcc,
            avgWpm: res[i].AvgWpm,
            maxWpm: res[i].MaxWpm
           });
        }

        return entries;
    }

    function handleSetSearch(e: any): void {
        setSearch(e.target.value);
    }

    React.useEffect(() => { getLeaderboard() }, [])
    
    return (
        table &&
        <div id="leaderboardContainer">
            <h1 id="leaderbaordHeader">Leaderboard</h1>
            <input id="userSearch" onChange={handleSetSearch} placeholder="Search" value={search} />
            <table id="leaderboardTable">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Average Accuracy</th>
                        <th>Average WPM</th>
                        <th>Highest WPM</th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    {
                        table.filter((obj) => {
                            return search === '' ? obj : obj.username.toLowerCase().includes(search);
                        })
                        .map((obj, i) => {
                            return (
                                <tr key={i} >
                                    <td>{obj.rank}</td>
                                    <th>{obj.username}</th>
                                    <td>{obj.avgAcc}</td>
                                    <td>{obj.avgWpm}</td>
                                    <td>{obj.maxWpm}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
            <div>
                {message}
            </div>
        </div>
    );
};

export default LeaderboardComponent;