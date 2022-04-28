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

function pay() {
    // UPDATE THE SESSION WITH THE INPUT FROM HOSTED FIELDS
    PaymentSession.updateSessionFromForm('card');
}

PaymentSession.configure({
    session: "GAPP",
    fields: {
        // ATTACH HOSTED FIELDS TO YOUR PAYMENT PAGE FOR A CREDIT CARD
        card: {
            number: "#card-number",
            securityCode: "#security-code",
            expiryMonth: "#expiry-month",
            expiryYear: "#expiry-year",
            nameOnCard: "#cardholder-name"
        }
    },
    //SPECIFY YOUR MITIGATION OPTION HERE
    frameEmbeddingMitigation: ["javascript"],
    callbacks: {
        initialized: function(response) {
            // HANDLE INITIALIZATION RESPONSE
        },
        formSessionUpdate: function(response) {
            // HANDLE RESPONSE FOR UPDATE SESSION
            if (response.status) {
                if ("ok" == response.status) {
                    console.log("Session updated with data: " + response.session.id);

                    //check if the security code was provided by the user
                    if (response.sourceOfFunds.provided.card.securityCode) {
                        console.log("Security code was provided.");
                    }

                    //check if the user entered a Mastercard credit card
                    if (response.sourceOfFunds.provided.card.scheme == 'MASTERCARD') {
                        console.log("The user entered a Mastercard credit card.")
                    }
                } else if ("fields_in_error" == response.status)  {

                    console.log("Session update failed with field errors.");
                    if (response.errors.cardNumber) {
                        console.log("Card number invalid or missing.");
                    }
                    if (response.errors.expiryYear) {
                        console.log("Expiry year invalid or missing.");
                    }
                    if (response.errors.expiryMonth) {
                        console.log("Expiry month invalid or missing.");
                    }
                    if (response.errors.securityCode) {
                        console.log("Security code invalid.");
                    }
                } else if ("request_timeout" == response.status)  {
                    console.log("Session update failed with request timeout: " + response.errors.message);
                } else if ("system_error" == response.status)  {
                    console.log("Session update failed with system error: " + response.errors.message);
                }
            } else {
                console.log("Session update failed: " + response);
            }
        }
    },
    interaction: {
        displayControl: {
            formatCard: "EMBOSSED",
            invalidFieldCharacters: "REJECT"
        }
    }
});

export function AddLibrary(urlOfTheLibrary) {
    const script = document.createElement('script');
    script.src = urlOfTheLibrary;
    script.async = true;
    document.body.appendChild(script);
}

function App()
{
    const paymentGatewayLibURL ='http://localhost:8010/proxy/form/version/64/merchant/GAPP/session.js';
    return (
        <>
            <button id="generate-btn" onClick={updateSession}>Session</button>
            {AddLibrary(paymentGatewayLibURL)}
        </>
    );
}

export default App;
