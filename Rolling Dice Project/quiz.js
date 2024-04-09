(function () {
  function Question(question, answers, correct) {
    this.question = question;
    this.answers = answers;
    this.correct = correct
  }

  Question.prototype.displayQuestion = function () {
    console.log(this.question);

    for (let i = 0; i < this.answers.length; i++) {
      console.log(i + 1 + "). " + this.answers[i])
    }
  }

  Question.prototype.checkAnswer = function (ans, callback) {
    var sc;

    if (ans === this.correct) {
      console.log('Correct Answer');
      sc = callback(true);
    }
    else {
      console.log('Wrong Answer');
      sc = callback(false);
    }

    this.displayScore(sc);
  }

  Question.prototype.displayScore = function(score) {
    c0nsole.log('Your Score is ' + score);
  }

  var questions = [q1, q2];

  function score() {
    var sc = 0;
    return function(correct){
      if(correct){
        sc++;
      }
      return sc;
    }
  }

  var keepScore = score();

  function nextQuestion() {
    var q1 = new Question('You Name ?', ['Varun', 'Bharat'], 0);

    var q2 = new Question('You Age ?', ['19', '20'], 0);

    // var q3 = new Question('You Name ?', ['Varun', 'Bharat'], 0);



    var n = Math.floor(Math.random() * questions.length)

    questions[n].displayQuestion();

    var answer = (prompt("Your Answer : "));

    if (answer !== 'exit') {
      nextQuestion();
      questions[n].checkAnswer(parseInt(answer),keepScore );
    }

  }

  nextQuestion();

})();