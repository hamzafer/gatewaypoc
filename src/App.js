import './App.css';
import createDOMPurify from 'dompurify'
import {JSDOM} from 'jsdom'

const window = (new JSDOM('')).window
const DOMPurify = createDOMPurify(window)

const rawHTML = `
    <div>Please enter your payment details:</div>
    <h3>Credit Card</h3>
    <div>Card Number: <input type="text" id="card-number" class="input-field" title="card number" aria-label="enter your card number" value="" tabindex="1" readonly></div>
    <div>Expiry Month:<input type="text" id="expiry-month" class="input-field" title="expiry month" aria-label="two digit expiry month" value="" tabindex="2" readonly></div>
    <div>Expiry Year:<input type="text" id="expiry-year" class="input-field" title="expiry year" aria-label="two digit expiry year" value="" tabindex="3" readonly></div>
    <div>Security Code:<input type="text" id="security-code" class="input-field" title="security code" aria-label="three digit CCV security code" value="" tabindex="4" readonly></div>
    <div>Cardholder Name:<input type="text" id="cardholder-name" class="input-field" title="cardholder name" aria-label="enter name on card" value="" tabindex="5" readonly></div>
    <div><button id="payButton" onclick="pay('card');">Pay Now</button></div>
`

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
            {<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(rawHTML)}}/>}
            <button id="generate-btn" onClick={updateSession}>Session
            </button>
        </>
    );
}

export default App;
