import React, {Fragment, useEffect, useState} from 'react'
import { GiTrophyCup }  from 'react-icons/gi';
import Loader from '../Loader';
import Modal from '../Modal';

const QuizOver = React.forwardRef((props, ref) => {

    const {
            levelNames, 
            score, 
            maxQuestions, 
            quizLevel, 
            percent,
            loadLevelQuestions
        } = props;

    const [asked, setAsked] = useState([]);
    const [openModel, setOpenModel] = useState(false);
    
    useEffect(() => {
        setAsked(ref.current)
    }, [ref])

    const showModal = (id) => {
        setOpenModel(true);
    }

    const hideModal = () => {
        setOpenModel(false);
    }

    const average = maxQuestions / 2;

    if(score < average){
        // setTimeout(() => loadLevelQuestions(0), 3000);
        setTimeout(() => loadLevelQuestions(quizLevel), 3000);
    }

    const decision = score >= average ? (
        <Fragment>
            <div className="stepsBtnContainer">
            {
                quizLevel < levelNames.length ?
                (
                    <Fragment>
                        <p className="successMsg"> 
                            <GiTrophyCup size='50px'/> Great Job! Move to the next level
                        </p>
                        <button 
                                className="btnResult success"
                                onClick={() => loadLevelQuestions(quizLevel)}
                        >
                            Next level
                        </button>
                    </Fragment>
                )
                :
                (
                    <Fragment>
                        <p className="successMsg">Great Job! Move to the next level!</p>
                        <button 
                                className="btnResult gameOver"
                                onClick={() => loadLevelQuestions(0)}
                        >
                            Accueil
                        </button>
                    </Fragment>
                )
            }
            </div>
            <div className="percentage">
                <div className="progressPercent"> Percentage : {percent}%</div>
                <div className="progressPercent"> Note : {score}/{maxQuestions} </div>
            </div>
        </Fragment>
    ) : (
        <Fragment>
            <div className="stepsBtnContainer">
                <p className="failureMsg">You lose :(</p>
            </div>
            <div className="percentage">
                <div className="progressPercent"> Percentage : {percent}%</div>
                <div className="progressPercent"> Note : {score}/{maxQuestions} </div>
            </div>
        </Fragment>
    )

    const questionAnswer = score >= average ? (
        asked.map((question) => {
            return(
                <tr key={question.id}>
                    <td> {question.question} </td>
                    <td> {question.answer} </td>
                    <td>
                        <button 
                                className="btnInfo"
                                onClick={ () => showModal(question.heroId) }
                        >
                            Infos
                        </button>
                    </td>
                </tr>
            ) 
        })
    )
    :
    (
        <tr>
            <td colSpan="3">
                <Loader 
                    loadingMsg={"No answer"} 
                    styling={ { textAlign:'center', color:'red' } }
                />
            </td>
        </tr>
    )
    

    return (
        <Fragment>
            { decision }

            <hr />
            <p>The answers are the next : </p>

            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        { questionAnswer }
                    </tbody>
                </table>
            </div>

            <Modal showModal={openModel} hideModal={hideModal}>
                <div className="modalHeader">
                    <h2>
                        Title 2
                    </h2>
                </div>
                <div className="modalBody">
                    <h3>
                        Title 3
                    </h3>
                </div>
                <div className="modalFooter">
                    <button className="modalBtn"  onClick={hideModal}>
                        Close
                    </button>
                </div>
            </Modal>

        </Fragment>
    )
})



export default React.memo(QuizOver);
