const constraints = {
    name: {
        presence: {
            allowEmpty: false,
            message: 'Veuillez renseigner votre nom.'
        }
    },
    email: {
        presence: {
            allowEmpty: false,
            message: 'Veuillez renseigner votre addresse email.'
        },
        email: {
            message: 'Adresse email invalide.'
        }
    },
    message: {
        presence: {
            allowEmpty: false,
            message: 'Veuillez renseigner un message.'
        }
    }
};

const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');

form.addEventListener('focusout', function (event) {
    const formValues = {
        name: form.elements.name.value,
        email: form.elements.email.value,
        message: form.elements.message.value
    };

    const errors = validate(formValues, constraints);

    if (errors) {
        submitButton.classList.add('disabled');
    } else {
        submitButton.classList.remove('disabled');
    }
}, false);

const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
}

for (const [key, input] of Object.entries(inputs)) {
    input.addEventListener('focusout', function (event) {
        document.getElementById('invalid-' + key + '-feedback').style.display = 'none';

        let inputValue = {};
        inputValue[key] = input.value
        let inputConstraints = {};
        inputConstraints[key] = constraints[key];
        const errors = validate(inputValue, inputConstraints);

        if (errors) {
            for (const field of Object.keys(errors)) {
                document.getElementById('invalid-' + key + '-feedback').style.display = 'block';
            }
        }
    }, false);
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formValues = {
        name: form.elements.name.value,
        email: form.elements.email.value,
        message: form.elements.message.value
    };

    const errors = validate(formValues, constraints);

    if (!errors) {
        var httpRequest;
        var urlEncodedData = "";
        var urlEncodedDataPairs = [];
        for (const [key, value] of Object.entries(formValues)) {
            urlEncodedDataPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
        urlEncodedDataPairs.push('phone' + '=' + encodeURIComponent(form.elements.phone.value));

        urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert('Abandon :( Impossible de créer une instance de XMLHTTP');
            return false;
        }
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('POST', './mail/contact_me.php');
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(urlEncodedData);
    }

    function alertContents() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                document.getElementById('submitSuccessMessage').setAttribute('style', 'display: block !important;');
            } else {
                document.getElementById('submitErrorMessage').setAttribute('style', 'display: block !important;');
            }
        }

    }
}, false);