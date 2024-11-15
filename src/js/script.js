// Copyright (C) 2022-2024 Solution Libre
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.


const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');

const validation = (new JustValidate('#contactForm', { validateBeforeSubmitting: true, }))
    .addField('#name', [
        {
            rule: 'required',
            errorMessage: 'Veuillez renseigner votre nom.',
        },
    ])
    .addField('#email', [
        {
            rule: 'required',
            errorMessage: 'Veuillez renseigner votre adresse email.',
        },
        {
            rule: 'email',
            errorMessage: 'Adresse email invalide.',
        },
    ])
    .addField('#message', [
        {
            rule: 'required',
            errorMessage: 'Veuillez renseigner un message.',
        },
    ])
    .onValidate(({ isValid }) => {
        if (isValid) {
            submitButton.classList.remove('disabled');
        } else {
            submitButton.classList.add('disabled');
        }
    });

// Add individual validation for input fields on focus out event
const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
}

for (const [key, input] of Object.entries(inputs)) {
    input.addEventListener('focusout', function () {
        validation.revalidateField('#' + key);
    }, false);
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    validation.revalidate().then(isValid => {
        const formValues = {
            name: form.elements.name.value,
            email: form.elements.email.value,
            message: form.elements.message.value,
            phone: form.elements.phone.value,
        };

        let urlEncodedData = "";
        let urlEncodedDataPairs = [];
        for (const [key, value] of Object.entries(formValues)) {
            urlEncodedDataPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        }
        urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

        const httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert('Abandon :( Impossible de créer une instance de XMLHTTP');
            return false;
        }
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    document.getElementById('submitSuccessMessage').setAttribute('style', 'display: block !important;');
                } else {
                    const submitErrorMessage = document.getElementById('submitErrorMessage')
                    submitErrorMessage.children[0].textContent=JSON.parse(httpRequest.responseText).message;
                    submitErrorMessage.setAttribute('style', 'display: block !important;');
                }
            }
        };
        httpRequest.open('POST', './mail/contact_me.php');
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(urlEncodedData);
    })
}, false);
