import './App.css';

async function createSession()
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic bWVyY2hhbnQuR0FQUDo2MmFkZGE4NDFmNDQ5OWI0NGI2M2UyMDVjNmFjZjJjYw==");

    const raw = JSON.stringify({
        "session": {
            "authenticationLimit": 25
        }
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    return fetch("http://localhost:8010/proxy/api/rest/version/63/merchant/GAPP/session", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(error => console.log('error', error));
}

async function updateSession()
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Basic bWVyY2hhbnQuR0FQUDo2MmFkZGE4NDFmNDQ5OWI0NGI2M2UyMDVjNmFjZjJjYw==");

    const raw = JSON.stringify({
        "order": {
            "amount": 100,
            "currency": "USD"
        }
    });

    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const result = await createSession();

    const obj = JSON.parse(result);
    const sessionId = obj.session.id;

    const url = "http://localhost:8010/proxy/api/rest/version/63/merchant/GAPP/session/" + sessionId;

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function App()
{
    return (
        <>
            <button id="generate-btn" onClick={updateSession}>generate quote
            </button>
        </>
    );
}

export default App;
