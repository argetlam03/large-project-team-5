import React from 'react';
import './../styles/type.css';

function TypeComponent() {
    var _ud = localStorage.getItem('user_data');
    const [message, setMessage] = React.useState('');
    const [isDisabled, setIsDisabled] = React.useState<boolean>(true);
    const [misses, setMisses] = React.useState<number>(0);
    const [wordIndex, setWordIndex] = React.useState<number>(0);
    const [letterIndex, setLetterIndex] = React.useState<number>(0);
    const [totalLetter, setTotalLetter] = React.useState<number>(0);
    const texts = ['Academic success is not without its challenges. Students inevitably face setbacks, disappointments, and obstacles along the way. The key to overcoming these challenges is resilience the ability to bounce back from adversity and keep moving forward. Resilience involves developing a positive mindset, maintaining a strong support system, and learning from mistakes. It means not giving up in the face of difficulty but rather using setbacks as opportunities for growth and learning. Building resilience is an ongoing process, but it is an essential skill for anyone who wants to achieve long-term success in their academic pursuits.',
                        'Teamwork requires a degree of flexibility and adaptability. The ability to adjust to changing circumstances, embrace new ideas, and overcome unexpected obstacles is essential for any team to thrive. When faced with challenges, team members must be willing to work together to find solutions, adapt their strategies, and learn from their mistakes. By embracing a growth mindset and a willingness to adapt, teams can navigate the inevitable ups and downs of collaboration and emerge stronger and more resilient.',
                        'Trust is the glue that holds teams together, the invisible bond that enables members to rely on each other, share ideas openly, and take risks without fear of judgment or reprisal. Trust is not built overnight; it requires consistent communication, mutual respect, and a willingness to be vulnerable. When team members trust each other, they are more likely to collaborate effectively, share information freely, and support each other through challenges. A lack of trust, on the other hand, can breed suspicion, conflict, and ultimately undermine the team\'s performance.',
                        'Well-formatted documents reflect professionalism and attention to detail. Use appropriate fonts, margins, and line spacing for readability. Create clear headings and subheadings to organize information. Utilize lists and tables to present data effectively.',
                        'Don\'t settle for mediocrity. Step outside the familiar confines of your comfort zone and dare to explore the uncharted territories of your potential. Growth, both personally and professionally, often happens when we push ourselves beyond what we think is possible. Embrace challenges as exciting opportunities to learn, expand your skills, and discover hidden strengths you never knew you had. Each hurdle you overcome becomes a stepping stone on your journey to greatness.',
                        'A strong leader is essential for guiding a team towards its goals. Effective leaders inspire and motivate their team members, provide clear direction and expectations, and create a positive and supportive work environment. They empower their team members to take ownership of their work, encourage collaboration, and resolve conflicts constructively. Leaders also play a crucial role in recognizing and celebrating the team\'s achievements, fostering a sense of pride and accomplishment that fuels continued success.',
                        'In the hustle and bustle of daily life, it\'s easy to neglect our own well-being. But remember, you can\'t pour from an empty cup. Taking care of your physical and mental health is crucial for maintaining high self-confidence, motivation, and overall productivity. Make time for activities that nourish your mind, body, and spirit. Prioritize sleep, exercise, and a balanced diet. Engage in hobbies that bring you joy and relaxation. Remember, self-care isn\'t selfish; it\'s an investment in your long-term happiness and success.'
                    ];

    const [sampleText, setSampleText] = React.useState(texts[Math.floor(Math.random() * texts.length)]);
    const [textArray, setTextArray] = React.useState(sampleText.split(' '));

    function typingHandler(event: any): void {
        const workingWord = textArray[wordIndex];
        const workingLetter = workingWord.charAt(letterIndex);
        var curWord = event.target.value;
        var curLetter = curWord.charAt(curWord.length - 1);

        if (totalLetter >= sampleText.length) return;

        // skip word
        if (curLetter == " ") {
            var input = document.getElementById("typingBox") as HTMLInputElement;
            input.value = "";

            var loop = totalLetter;
            while (sampleText.charAt(loop) != " ") {
                const e = document.getElementById("letter-" + loop) as HTMLSpanElement;
                e.classList.add('redColor');
                e.classList.remove('greenColor');
                e.classList.remove('blackColor');
                loop++;
            }

            setTotalLetter(loop + 1);
            setMisses(misses + Math.max(workingWord.length - letterIndex, 0));
            setLetterIndex(0);
            setWordIndex(wordIndex + 1);
        }
        
        // delete
        else if (curWord.length - 1 != letterIndex) {
            if (letterIndex !== 0) {
                const e = document.getElementById("letter-" + (totalLetter - 1)) as HTMLSpanElement;
                e.classList.add('blackColor');
                e.classList.remove('greenColor');
                e.classList.remove('redColor');
                setLetterIndex(letterIndex - 1);
                setTotalLetter(totalLetter - 1);
            }
        } 
        
        // correct
        else if (curLetter == workingLetter) {
            const e = document.getElementById("letter-" + totalLetter) as HTMLSpanElement;
            e.classList.add('greenColor');
            e.classList.remove('blackColor');
            e.classList.remove('redColor');
            setLetterIndex(letterIndex + 1);
            setTotalLetter(totalLetter + 1);
        } 
        
        // incorrect
        else if (curLetter != workingLetter) {
            const e = document.getElementById("letter-" + totalLetter) as HTMLSpanElement;
            e.classList.add('redColor');
            e.classList.remove('greenColor');
            e.classList.remove('blackColor');
            setLetterIndex(letterIndex + 1);
            setMisses(misses + 1);
            setTotalLetter(totalLetter + 1);
        }
    };

    const waitForTimeout = () => {
        setTextArray(sampleText.split(' '));
        setMessage('');
        setIsDisabled(false);
        var timeValue = (document.getElementById("timerSelect")) as HTMLSelectElement;
        return new Promise(resolve => setTimeout(resolve, parseInt(timeValue.value)*1000));
    }

    async function doneTyping() {
        await waitForTimeout();

        for (let i = 0; i < sampleText.length; i++) {
            const e = document.getElementById("letter-" + i) as HTMLSpanElement;
            e.classList.add('blackColor');
            e.classList.remove('redColor');
            e.classList.remove('greenColor');
        }

        var input = document.getElementById("typingBox") as HTMLInputElement;
        input.value = "";
        setIsDisabled(true);
        var timeValue = document.getElementById("timerSelect") as HTMLSelectElement;
        var miss = document.getElementById("misses")!.innerText;
        var ind = document.getElementById("wordIndex")!.innerText;
        var wpm: number = (parseInt(ind) + 1)*(60/parseInt(timeValue.value)), acc = ((1 - (parseInt(miss) / sampleText.length)) * 100);
        setMessage('Finished. WPM: ' + wpm + ' Accuracy: ' + acc.toFixed(2) + '%');
        setMisses(0);
        setWordIndex(0);
        setLetterIndex(0);
        saveScore(wpm, acc);
        setTotalLetter(0);
        setSampleText(texts[Math.floor(Math.random() * texts.length)]);
        return;
    }

    async function saveScore(wpm: number, acc: number): Promise<void> {
        var obj = { id: JSON.parse(_ud ? _ud : '').id, acc: acc, wpm: wpm };
        var js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/saveScore',
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
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    const showCursor = (index: number): boolean => {
        return index === totalLetter;
    };

    return (
        sampleText != '' &&
        <div id="typeArea">
            <div id="typeHeader">Typing</div>
            <div id="textBox">
                {
                    Array.from(sampleText).map((obj, i) => {
                        return (
                            <span key={i}>
                                {showCursor(i) && <span className="cursor">|</span>}
                                <span id={"letter-" + i}>{obj}</span>
                            </span>
                        );
                    })
                }
            </div>
            <input id="typingBox" type="text" placeholder="Click start, then type!" disabled={isDisabled} onChange={typingHandler} />
            <div className="timer-options">
                <select id="timerSelect" defaultValue="15" disabled={!isDisabled}>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                </select>
                <button type="button" id="startTimer" onClick={doneTyping} disabled={!isDisabled}>Start Timer</button>
            </div>
            <br />
            <div id="doneTyping">
                {message}
            </div>
            <div id="misses" hidden>{misses}</div>
            <div id="wordIndex" hidden>{wordIndex}</div>
        </div>
    );
};

export default TypeComponent;