const express =  require('express');
const fs = require('fs'); //for reading provided json file

const app = express();

app.use(express.static('static'));// use static html page
app.use(express.static('node_modules/jquery/dist'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get('', (req, res) => {
    res.redirect(index.html);
});

//use the file system to parse the data from provided json file
function getQ(){
    let data = fs.readFileSync('questions.json');
    let dataQ = JSON.parse(data);
    return dataQ;
}

app.get('/getQuiz', function (req, res) {
    let dataQ = getQ(); //get the parsed json file
    let quizQ = []; // array it out into the number of questions we have 
    for(let i = 0; i<dataQ.length; i++){
        quizQ.push({
            'stem': dataQ[i].stem,
            'options': dataQ[i].options,
        });
    }
    res.send(JSON.stringify(quizQ));
});

app.post('/check', (req,res) => {
    let qIndex = parseInt(req.body.qIndex); //from what question
    let aIndex = parseInt(req.body.aIndex); //for what radio button
    
    let dataQ = getQ();
    
    let q = dataQ[qIndex];

    // answer we picked match the key, correct 1 or incorrect 0
    if(q.answerIndex === aIndex){
            res.send('1')
    }else{
            res.send('0')
    }
    
    
})

app.post('/grade', (req,res) =>{
    let dataQ = getQ(); 
    let grade = 0;

    for(let i = 0; i < req.body.length; i++){
        if(parseInt(req.body[i].aIndex) === dataQ[req.body[i].qIndex].answerIndex){
            grade++; // correct choice matches our answer key so increment our score
        }
    }
    res.send(`${grade}/5`);//display the quiz out of 5
})

app.listen(80);