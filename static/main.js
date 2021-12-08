function questionChoice(radioButton){
    let questionChoiceCallback = function (){
        if(this.readyState === 4 && this.status === 200) {
            let response = this.responseText;
            if(response === '0')
                alert('Incorrect!')
            else
                alert('Correct!')
        }
    }
    
    let qIndex = radioButton.name.slice(2); // to get qIndex from tag q-[index] 
    let aIndex = radioButton.value;
    let reqBody = JSON.stringify({
        'qIndex': qIndex,
        'aIndex': aIndex
    }); 

    let xRequest = new XMLHttpRequest();
    xRequest.onreadystatechange = questionChoiceCallback;
    xRequest.open('POST', '/check', questionChoiceCallback);
    xRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xRequest.send(reqBody); //send our q and a index
}

function gradeQuiz(){
    let selectedButtons = $('input[type="radio"]:checked');
    let gradeQuizCallback = function(){
        if (this.readyState === 4 && this.status === 200) {
            let grade = this.responseText;
            $('#grade').text(grade); //look for element with id grade
        }
    }

    if(selectedButtons.length < 5){
        alert('Quiz not complete. Must finish answering questions')
    }
    else{
        let responses = [];
        for (let i = 0; i < selectedButtons.length; i++){
            let button = selectedButtons[i];
            let response = {
                'qIndex': button.name.slice(2),
                'aIndex': button.value
            }
            responses.push(response);
        }

        let reqBody = JSON.stringify(responses);         
        
        let xRequest = new XMLHttpRequest();
        xRequest.onreadystatechange = gradeQuizCallback;
        xRequest.open('POST', '/grade', gradeQuizCallback);
        xRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xRequest.send(reqBody);
    }
}

$(function() {
    let quizCallback = function(){
        let questionsString = '';
        if(this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText);
            for(let i = 0; i < questions.length; i++){
                let q = questions[i];
                let options = q.options;
                let qID  = `q-${i}`; // id format of q-[id]
                let qString = `<h3>${q.stem}</h3>`;//question itself

                for(let j = 0; j< options.length; j++){ // loop through the varied number of options to populate with radio buttons
                    let opID = `op-${i}-${j}`; //question i, radio button option j
                    qString += `<input type="radio" id="${opID}" name="${qID}" value="${j}"
                    onclick="questionChoice(this);"><label for ="${opID}">${options[j]}</label>`
                }
                questionsString += qString; 
            }
        }
        questionsString += `<br>
                            <button onclick="gradeQuiz();">Submit</button>`
        document.getElementById('questions').innerHTML = questionsString;
    }
    let xRequest = new XMLHttpRequest();
    xRequest.onreadystatechange = quizCallback;
    xRequest.open('GET', '/getQuiz', quizCallback); //our getQuiz defined in index.js
    xRequest.send();
})