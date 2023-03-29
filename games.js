const fetch = require('node-fetch');

export function magicBall() {
    let listofanswers = [
        "It is certain.",
        "It is decidedly so.",
        "Without a doubt.",
        "Yes, definitely.",
        "You may rely on it.",
        "As I see it, yes.",
        "Most likely.",
        "Outlook good.",
        "Yes.",
        "Signs point to yes.",
        "Reply hazy, try again.",
        "Ask again later.",
        "Better not tell you now....",
        "Don't count on it.",
        "My reply is no.",
        "My sources say no.",
        "Outlook not so good.",
        "Very doubtful."
    ]
    var answer = listofanswers[Math.floor(Math.random()*listofanswers.length)];
    return answer
}

export async function advice() {
    const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json());
    var answer = data.slip.advice
    return answer
}

export async function randomFact() {
    const data =await fetch('https://uselessfacts.jsph.pl/random.json?language=en').then(res => res.json());;
    var answer = data.text
    return answer
}