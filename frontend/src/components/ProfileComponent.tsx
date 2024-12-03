import React, { useEffect, useRef, useState } from 'react';
import './../styles/profile.css';

function ProfileComponent() {
    const [message, setMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loginName, setLoginName] = useState('');
    const [email, setEmail] = useState('');
    const [avgAcc, setAvgAcc] = useState(0);
    const [avgWpm, setAvgWpm] = useState('');
    const [maxWpm, setMaxWpm] = useState('');
    const [recentStats, setRecentStats] = useState<number[]>([]);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const _ud = localStorage.getItem('user_data');

    const drawLineGraph = (stats: number[]) => {
        const canvas = canvasRef.current;
        if (!canvas || stats.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const padding = 40;
        const graphWidth = canvas.width - (padding * 2);
        const graphHeight = canvas.height - (padding * 2);

        const displayStats = [...stats].reverse();

        const maxValue = Math.max(...displayStats);
        const minValue = Math.min(...displayStats);
        const range = maxValue - minValue || 1;

        ctx.beginPath();
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1;
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();

        ctx.fillStyle = '#03FCE3';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round(minValue + (range * (i / 5)));
            const y = canvas.height - padding - ((i / 5) * graphHeight);
            ctx.fillText(value.toString(), padding - 5, y + 4);
        }

        // Draw X-axis labels (most recent = 1)
        ctx.textAlign = 'center';
        displayStats.forEach((_, index) => {
            const x = padding + ((index / (displayStats.length - 1)) * graphWidth);
            const testNumber = displayStats.length - index;
            ctx.fillText(testNumber.toString(), x, canvas.height - padding + 20);
        });

        ctx.beginPath();
        ctx.strokeStyle = '#4F46E5';
        ctx.lineWidth = 2;
        displayStats.forEach((wpm, index) => {
            const x = padding + ((index / (displayStats.length - 1)) * graphWidth);
            const y = canvas.height - padding - ((wpm - minValue) / range * graphHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        ctx.fillStyle = '#4F46E5';
        displayStats.forEach((wpm, index) => {
            const x = padding + ((index / (displayStats.length - 1)) * graphWidth);
            const y = canvas.height - padding - ((wpm - minValue) / range * graphHeight);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.fillStyle = '#1F2937';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Recent WPM History', canvas.width / 2, padding - 10);
    };

    async function getUser() {
        const obj = { id: JSON.parse(_ud || '').id };
        const js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/getUser',
                {
                    method: 'POST', 
                    body: js, 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            const res = await response.json();
            if (res.error !== '') {
                setMessage(res.error);
            } else {
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
        catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unknown error occurred');
            }
        }
    }

    async function getRecentStats() {
        const obj = { id: JSON.parse(_ud || '').id };
        const js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/getRecentStats',
                {
                    method: 'POST',
                    body: js,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            const res = await response.json();
            if (res.error !== '') {
                setMessage(res.error);
            } else {
                setMessage('');
                setRecentStats(res.stats);
            }
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unknown error occurred');
            }
        }
    }

    useEffect(() => {
        getUser();
        getRecentStats();
    }, []);

    useEffect(() => {
        drawLineGraph(recentStats);
    }, [recentStats]);
    
    return (
        recentStats &&
        <div id="profileContainer">
            <h1 id="profileHeader">Profile</h1>
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
                <div className="mt-4">
                    <canvas 
                        ref={canvasRef}
                        width={600}
                        height={300}
                        className="w-full"
                    />
                </div>
                <div>
                    {message}
                </div>
            </div>
        </div>
    );
}

export default ProfileComponent;