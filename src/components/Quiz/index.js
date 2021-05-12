import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {QuizMarvel} from '../quizMarvel/';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver';
import { FaChevronRight } from 'react-icons/fa';

toast.configure();

const initalState = {
    quizLevel : 0,
    maxQuestions : 10,
    storedQuestions : [],
    question : null,
    options : [],
    idQuestion : 0,
    btnDisabled : true,
    userAnswer : null,
    score : 0,
    showWelcomeMsg: false,
    quizEnd: false,
    percent: null
}

const levelName = ["beginner" , "confirme", "expert"];

class Quiz extends Component {

    constructor(props) {
        super(props);
        this.state = initalState;
        this.storedDataRef = React.createRef();
    }

    loadQuestions = quizz => {
        const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
        
        if (fetchedArrayQuiz.length >= this.state.maxQuestions) {

            this.storedDataRef.current = fetchedArrayQuiz;
            
            const newArray = fetchedArrayQuiz.map( ({ answer, ...keepRest }) => keepRest  );

            this.setState({
                storedQuestions: newArray
            })
        }
    }

    componentDidMount() {
        this.loadQuestions(levelName[this.state.quizLevel]);
    }

    nextQuestion = () => {
        if (this.state.idQuestion === this.state.maxQuestions - 1) {
            // End of quiz
            this.setState({
                quizEnd: true
            })
        } else{
            this.setState( prevState => ({
                idQuestion: prevState.idQuestion + 1
            }))
        }

        // + 1 dans le score
        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        if(this.state.userAnswer === goodAnswer){
            this.setState((prevState) => ({
                score : prevState.score + 1
            }))

            toast.success('Great +1' , {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar:false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                bodyClassName: "toastify-color"
            });
        }else{
            toast.error('Ow! 0' , {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar:false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                bodyClassName: "toastify-color"
            });
        }
    }

    showToastMessage = (pseudo) => {
        if (!this.state.showWelcomeMsg) {

            this.setState({
                showWelcomeMsg: true
            })

            toast.warn(`Welcome ${pseudo}, and good luck!` , {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar:false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false
            });
        }
        
    }

    componentDidUpdate(prevProps, prevState) {

        const {
            maxQuestions,
            storedQuestions,
            idQuestion,
            quizEnd,
            score
        } = this.state;

        if ((storedQuestions !== prevState.storedQuestions) && storedQuestions.length ) {
            this.setState({
                question : storedQuestions[idQuestion].question,
                options : storedQuestions[idQuestion].options
            })
        }

        if ((idQuestion !== prevState.idQuestion) && storedQuestions.length) {
            this.setState({
                question : storedQuestions[idQuestion].question,
                options : storedQuestions[idQuestion].options,
                userAnswer : null,
                btnDisabled: true
            })
        }

        if (quizEnd !== prevState.quizEnd) {
            const gradepercente = this.getPercentage(maxQuestions, score);
            this.gameOver(gradepercente);
        }

        if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
            this.showToastMessage(this.props.userData.pseudo);
        } 
    }

    submitAnswer = selectedAnswer => {
        this.setState({
            userAnswer : selectedAnswer,
            btnDisabled : false
        })
    }

    getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;
    
    gameOver = percent => {

        if (percent >= 50) {
            this.setState({
                quizLevel: this.state.quizLevel + 1,
                percent
            })
        }else{
            this.setState({ percent })
        }
     }

     loadLevelQuestions = (param) => {
        this.setState({...initalState, quizLevel : param})

        this.loadQuestions(levelName[param]);
     }

    render() {
        //const { pseudo } = this.props.userData;

        const {
            quizLevel,
            maxQuestions,
            question,
            options,
            idQuestion,
            btnDisabled,
            userAnswer,
            score,
            quizEnd,
            percent
        } = this.state;
    

        const displayOptions = options.map((option, index) => {
            return (
                <p key={index} 
                    className= {`answerOptions ${userAnswer === option ? "selected" : null}`} 
                    onClick={() => this.submitAnswer(option)}
                > 
                <FaChevronRight /> {option} 
                </p>
            )
        })

        return quizEnd ? (
            <QuizOver 
                ref={this.storedDataRef}
                levelNames={levelName}
                score={score}
                maxQuestions={maxQuestions}
                quizLevel={quizLevel}
                percent={percent}
                loadLevelQuestions={this.loadLevelQuestions}
            />
        ) 
        :
        (
            <Fragment>
                {/* <h2> Pseudo : { pseudo } </h2> */}
                <Levels 
                    levelName={levelName}
                    quizLevel={quizLevel}
                />
                <ProgressBar 
                    idQuestion={idQuestion}  
                    maxQuestions={maxQuestions} 
                />
                <h2> {question} </h2>
                {displayOptions}
                <button 
                    disabled={btnDisabled} 
                    className="btnSubmit"
                    onClick={this.nextQuestion}
                >
                { idQuestion < maxQuestions - 1  ? 'Next' : 'End' }
                </button>
            </Fragment>
        )
    }
}

export default Quiz

