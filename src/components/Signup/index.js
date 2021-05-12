import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Signup = (props) => {

    const firebase = useContext(FirebaseContext);

    const data = {
        pseudo : '',
        email  : '',
        password : '',
        confirPassword: ''
    }

    const [logindData, setLogindData] = useState(data);

    const [error, setError] = useState('')

    const handleChange = (e) => {
        setLogindData({...logindData, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();    // Escape reloading the page
        const { email, password, pseudo } = logindData;
        firebase.signUpUser(email, password)
        .then((authUser) => {
            return firebase.user(authUser.user.uid).set({
                pseudo,
                email
            })
        })
        .then( () => {
            setLogindData({...data});    // Make data empty
            props.history.push('/welcome');
        })
        .catch( (error) => {
            setError(error);
            setLogindData({...data});  
        })
    }

    const { pseudo, email, password, confirPassword} = logindData;

    const btn = pseudo === ''  || email === '' || password === '' || password !== confirPassword ?
        <button disabled> Sign Up </button> : <button> Sign Up </button>;

    // Errors management
    const errorMsg = error !== '' && <span > {error.message} </span>;

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup">
                </div>
                <div className="formBoxRight">
                    <div className="formContent">
                        {errorMsg}
                        <h2>Sign Up</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={handleChange} value={pseudo} type="text" id="pseudo" autoComplete="off" required />
                                <label htmlFor="pseudo"> Pseudo </label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={email} type="email" id="email" autoComplete="off" required />
                                <label htmlFor="email"> Email </label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={password} type="password" id="password" autoComplete="off" required />
                                <label htmlFor="password"> Password </label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={confirPassword} type="password" id="confirPassword" autoComplete="off" required />
                                <label htmlFor="confirPassword"> Confirm Password </label>
                            </div>

                            {btn}
                        </form>
                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Already member? Login.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;
