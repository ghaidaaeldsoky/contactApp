// Variables:
let generatedId = localStorage.getItem("generatedId") ? parseInt(localStorage.getItem("generatedId")) : 0;

// Contact Class:
class Contact {
    id;
    constructor(name, phone, email, gender) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.gender = gender; // (male,female)
        this.id= generatedId++;
        localStorage.setItem("generatedId", generatedId);
    }

}
// Contacts Class
class Contacts {
    contacts;
    constructor(){
        this.contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    }

    addContact(contact) {
        if (contact instanceof Contact) {
            this.contacts.push(contact);
            this.saveContacts();
            return true;
        }
        return false;
    }

    getAllContacts(){
        return this.contacts;
    }

    findContactById(id) {
        return this.contacts.find(contact => contact.id === id);
    }

    deleteContact(id) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            this.contacts.splice(index, 1);
            this.saveContacts();
            return true;
        }
        return false; // Contact not found
    }
    editContact(id, newDetails) {
        let contact = this.findContactById(id);
        if (contact) {
            contact.name = newDetails.name || contact.name;
            contact.phone = newDetails.phone || contact.phone;
            contact.email = newDetails.email || contact.email;
            contact.gender = newDetails.gender || contact.gender;
            this.saveContacts();
            return true;
        }
        return false; // Contact not found
    }

    saveContacts() {
        localStorage.setItem("contacts", JSON.stringify(this.contacts));
    }
}

const contactList = new Contacts();

// const contact1 = new Contact("Ahmed", "0123456789", "ahmed@example.com", "male");
// const contact2 = new Contact("Sara", "0112233445", "sara@example.com", "female");

// contactList.addContact(contact1);
// contactList.addContact(contact2);

console.log(contactList.getAllContacts()); 

// 1- Home Page 
$(document).ready(function () {
    updateContactsList();
});

function updateContactsList() {
    let $contactsList = $("#contactsList");
    $contactsList.empty();

    contactList.getAllContacts().forEach(contact => {
        let contactItem = `
            <li>
                <a href="#details" onclick="showContactDetails(${contact.id})">
                    <img src="./imgs/${contact.gender === 'male' ? 'man' : 'woman'}.png" />
                    <h2>${contact.name}</h2>
                    <p>${contact.phone}</p>
                    <a href="tel:${contact.phone}" > </a>
                </a>
            </li>
        `;
        console.log(contact.id);
        $contactsList.append(contactItem);
    });

    $contactsList.listview("refresh"); 
}


// 2- Add Page
$(document).ready(function () {
    $("#saveContactBtn").on("click", function (event) {
        event.preventDefault(); 
        let name = $("#text-basic").val().trim();
        let phone = $("#tel").val().trim();
        let email = $("#email-1").val().trim();
        let gender = $("input[name='gender']:checked").val();

        if (name && phone && email && gender) {
            let newContact = new Contact(name, phone, email, gender);
            contactList.addContact(newContact);

            updateContactsList();
            clearFormFields();

            alert(`${newContact.name} added succesfully!`);

            $.mobile.changePage("#home");
        } else {
            alert("Please Fill all inputs");
        }
    });

    $("#cancelBtn").on("click", function (event) {
        event.preventDefault(); 
            updateContactsList();
            clearFormFields();
            $.mobile.changePage("#home");
        
    });

    function clearFormFields() {
        $("#text-basic").val("");
        $("#tel").val(""); 
        $("#email-1").val(""); 
        $("input[type='radio']").prop("checked", false); 
    }
});

// 3- Detail Page
function showContactDetails(contactId) {
    let contact = contactList.findContactById(parseInt(contactId));
    console.log(contact);
    if (contact) {
        $("#contact-name").text(contact.name);
        $("#contact-phone").text(contact.phone);
        $("#contact-email").text(contact.email);
        $("#contact-gender").text(contact.gender);
        $("#contact-img").attr("src", `./imgs/${contact.gender === 'female' ? 'woman' : 'man'}.png`);

        $("#deleteContactBtn").attr("data-id", contactId);
        $("#editContactBtn").attr("data-id", contactId);
        $("#callContact").attr("data-id", contactId);


        $.mobile.changePage("#details");
    }
}

$(document).on("click", "#deleteContactBtn", function () {
    let contactId = $(this).attr("data-id");

    if (contactList.deleteContact(parseInt(contactId))) {
        // alert("Contact deleted successfully!");
        updateContactsList();
    } else {
        alert("Error deleting contact!");
    }
});

$(document).on("click", "#callContact", function () {
    let contactId = $(this).attr("data-id");
    let contactCall = contactList.findContactById(parseInt(contactId));

    if (contactCall) {
        window.location.href = `tel:${contactCall.phone}`; 
    } else {
        alert("Error: Contact not found!");
    }
});




// 4- Edit Page

$(document).on("click", "#editContactBtn", function () {
    let contactId = $(this).attr("data-id");
    let contact = contactList.findContactById(parseInt(contactId));

    // navigateEdit(contact);
    if (contact) {
        
        console.log("Editing Contact:", contact);
        $("#contact-name").text(contact.name);
        $("#edit-name").val(contact.name);
        $("#edit-tel").val(contact.phone);
        $("#edit-email").val(contact.email);
        $("input[name='edit-gender'][value='" + contact.gender + "']").prop("checked", true);

        $("#saveUpdates").attr("data-id", contactId);
        $.mobile.changePage("#editContact");
    }
});

$(document).on("click", "#saveUpdates", function (event) {
    event.preventDefault();
    let contactId = $(this).attr("data-id");
    let updatedContact = {
        name: $("#edit-name").val().trim(),
        phone: $("#edit-tel").val().trim(),
        email: $("#edit-email").val().trim(),
        gender: $("input[name='edit-gender']:checked").val()
    };

    if (updatedContact.name && updatedContact.phone && updatedContact.email && updatedContact.gender) {
        contactList.editContact(parseInt(contactId), updatedContact);
        console.log(updatedContact);
        updateContactsList();
        $.mobile.changePage("#home");
    } else {
        alert("Please fill all inputs!");
    }
});



