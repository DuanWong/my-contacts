'use strict';

// Create a class

class Contact {
    constructor(name, phone, email, address, note) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.note = note;
    }
}

// DOM Elements

const errorMessage = document.querySelector('.error-message');
const inputName = document.querySelector('.input-one');
const inputPhone = document.querySelector('.input-two');
const inputEmail = document.querySelector('.input-three');
const inputAddress = document.querySelector('.input-four');
const inputNote = document.querySelector('.input-five');

const addButton = document.querySelector('.add');
const contactsContainer = document.querySelector('.contacts-container');
const contactsCount = document.querySelector('.count');
const modal = document.querySelector('.modal');
const createBtn = document.querySelector('.create');
const addCancel = document.querySelector('.add-cancel');

// Functions for validation

function validateName(name) {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{1,50}$/;

    if (!nameRegex.test(name)) {
        errorMessage.innerText = 
        'Please enter a name in correct format!'
        return false;
    } else {
        errorMessage.innerText = '';
        return true;
    }
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9\-\+\s\(\)]{1,20}$/;

    if (phone.trim() === '') {
        errorMessage.innerText = '';
        return true;
    }

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

    if (email.trim() === '') {
        errorMessage.innerText = '';
        return true;
    }

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
    const contactName = inputName.value.trim();
    const contactPhone = inputPhone.value.trim();
    const contactEmail = inputEmail.value.trim();
    const contactAddress = inputAddress.value.trim();
    const contactNote = inputNote.value.trim();

    if (!validateName(contactName) || !validatePhone(contactPhone) || !validateEmail(contactEmail)) return;

    const contact = new Contact(contactName, contactPhone, contactEmail, contactAddress, contactNote);
    const contactDiv = document.createElement('div');
    contactDiv.classList.add('contact-box');
    
    contactsArray.unshift(contact);
    displayContacts(contactDiv, contact);
    contactsContainer.insertBefore(contactDiv, contactsContainer.firstChild);

    inputName.value = '';
    inputPhone.value = '';
    inputEmail.value = '';
    inputAddress.value = '';
    inputNote.value = '';
    calcContacts();

    saveContactsToLocalStorage();
    closeModal();
}

function displayContacts(contactDiv, contact) {
    contactDiv.innerHTML = `
    <div class="bottom-box">
        <p><strong>Name: </strong>${contact.name}</p>
        <i class="fa-solid fa-xmark"></i>
    </div>
    <p><strong>Phone: </strong>${contact.phone}</p>
    <p><strong>Email: </strong>${contact.email}</p>
    <p><strong>Address: </strong>${contact.address}</p>
    <p><strong>Note: </strong>${contact.note}</p>
`;

    const deleteButton = contactDiv.querySelector('.fa-xmark');
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

// Modal
function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

createBtn.addEventListener('click', openModal);
addCancel.addEventListener('click', closeModal);
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