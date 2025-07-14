'use strict';

// Create a class

class Contact {
    constructor(name, phone, email) {
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}

// DOM Elements

const errorMessage = document.querySelector('.error-message');
const inputField = document.querySelector('.input');
const addButton = document.querySelector('.add');
const contactsContainer = document.querySelector('.contacts-container');
const contactsCount = document.querySelector('.count');

// Functions for validation

function validateInputInfo(inputInfo) {
    if (inputInfo.length < 3) {
        errorMessage.innerText = 
        'Please enter the complete information and separate them with commas!'
        return false; 
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

function isAlphabetOnly(str) {
    const alphabetRegex = /^[a-zA-ZÀ-ÿ\s'-]{1,50}$/;

    if (!alphabetRegex.test(str)) {
        errorMessage.innerText = 
        'Please enter a name or a city in correct format!'
        return false;
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9\-\+\s\(\)]{1,20}$/;

    if (!phoneRegex.test(phone)) {
        errorMessage.innerText = 
        'Please enter a valid phone number!';
        return false;
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        errorMessage.innerText = 
        'Please enter an email in correct format!'
        return false;
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

// Edit contacts

const contactsArray = [];

function listContact() {
    const input = inputField.value;
    const inputInfo = input.split(',').map(item => item.trim());

    if (!validateInputInfo(inputInfo)) return;
    const [contactName, contactPhone, contactEmail] = inputInfo;
    if (!isAlphabetOnly(contactName) || !validatePhone(contactPhone) || !validateEmail(contactEmail)) return;

    const contact = new Contact(contactName, contactPhone, contactEmail);
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact-box');
    
    contactsArray.unshift(contact);
    displayContacts(contactDiv, contact);
    contactsContainer.insertBefore(contactDiv, contactsContainer.firstChild);

    inputField.value = '';
    calcContacts();

    saveContactsToLocalStorage();
}

function displayContacts(contactDiv, contact) {
    contactDiv.innerHTML = `
    <p>Name: ${contact.name}</p>
    <p>Phone: ${contact.phone}</p>
    <div class="bottom-box">
        <p>Email: ${contact.email}</p>
        <i class="fa-solid fa-trash"></i>
    </div>
`;

    const deleteButton = contactDiv.querySelector('.fa-trash');
    deleteButton.addEventListener('click', function () {
        removeContact(contactDiv, contact);
    });
}

function removeContact(contactDiv, contact) {
    contactsContainer.removeChild(contactDiv); 

    const index = contactsArray.indexOf(contact);
    if (index > -1) {
        contactsArray.splice(index, 1);
    }

    calcContacts();
    saveContactsToLocalStorage();
}

addButton.addEventListener('click', listContact);

// Calculate contacts

function calcContacts() {
    contactsCount.innerText = contactsArray.length;
}

window.addEventListener('load', function () {
    loadContactsFromLocalStorage();
    calcContacts();
});

// Local Storage

// 保存联系人到本地
function saveContactsToLocalStorage() {
    const serialized = JSON.stringify(contactsArray);
    localStorage.setItem('contacts', serialized);
}

// 从本地加载联系人
function loadContactsFromLocalStorage() {
    const stored = localStorage.getItem('contacts');
    if (!stored) return;

    const parsedContacts = JSON.parse(stored);
    parsedContacts.forEach(c => {
        const contact = new Contact(c.name, c.phone, c.email);
        contactsArray.push(contact);

        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contact-box');
        displayContacts(contactDiv, contact);
        contactsContainer.appendChild(contactDiv);
    });
}