import React, {useState} from 'react';

function Login() {
    const [values, setValues] = useState({
        clientId: '',
        clientSecret: ''
    });
    const [errorOrSuccess, setErrorOrSuccess] = useState(null);

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const connect = async (e) => {
        e.preventDefault();

        let res = await fetch( 'http://'+window.location.hostname+':3001/auth/login-oauth2', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: Object.keys(values).map(key => key+"="+encodeURIComponent(values[key])).join("&")+"&grant_type="+encodeURIComponent("client_credentials")
        });

        if (res.status === 200) {
            localStorage.setItem("seller", JSON.stringify(await res.json()));
            setErrorOrSuccess(true);
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } else {
            setErrorOrSuccess(false);
        }
    }

    return (
        <>
            <h1>Connexion marchand</h1>
            <form onSubmit={connect}>
                <label>
                    Client id :
                    <input name="clientId" type="text" value={values.client_id} onChange={handleChange}/>
                </label><br/>
                <label>
                    Client secret :
                    <input name="clientSecret" type="text" value={values.client_secret} onChange={handleChange}/>
                </label><br/>
                <input type="submit" value="Connexion"/>
            </form>
            {
                errorOrSuccess === false &&
                    <p style={{color: 'red'}}>Echec de connexion</p>
            }
            {
                errorOrSuccess === true &&
                    <p style={{color: 'green'}}>Connexion réussi</p>
            }
        </>
    )
}

export default Login;