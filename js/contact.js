
var rowID = -1;
// Loads the first 10 contacts (if they exist) from the database
function fetchFirstLoadedContacts() {

}
function editContact() {
    // Find table row to be modified using RegEx
    let ID = event.srcElement.id;
    let currentRowID = ID.match(/\d+/);


    // Make current row modifiable
    unlockInput(currentRowID);

    // Change "Edit" button to "Done"
    $("#editButton" + currentRowID).hide();
    $("#deleteButton" + currentRowID).hide();
    $("#doneButton" + currentRowID).show();


    //alert("editing contact");
}
function doneEditingHandler() {
    // Find table row to be modified using RegEx
    let ID = event.srcElement.id;
    let currentRowID = ID.match(/\d+/);


    // Grab and store each field in a variable from current row
    let firstName = $("#firstName" + currentRowID).val();
    let lastName = $("#lastName" + currentRowID).val();
    let phoneNumber = $("#number" + currentRowID).val();
    let email = $("#email" + currentRowID).val();

    // Function call to editContact with proper values


    // Make current row unmodifiable
    lockInput(currentRowID);

    // change buttons to "Edit" and "Delete"
    $("#doneButton" + currentRowID).hide();
    $("#editButton" + currentRowID).show();
    $("#deleteButton" + currentRowID).show();
}
function deleteContactHandler() {
    // Find table row to be deleted using RegEx
    let ID = event.srcElement.id;
    let currentRowID = ID.match(/\d+/);

    // Grab and store each field in a variable from current row
    let firstName = $("#firstName" + currentRowID).val();
    let lastName = $("#lastName" + currentRowID).val();

    // Function call to deleteContact
    deleteContact(firstName, lastName, parseInt(localStorage.getItem("userId")));

    // Remove row from table
    $("#" + currentRowID).remove();

    alert("deleted contact");
}
function addContactHandler() {
    // Grab and store each field in a variable from current row
    let firstName = $("#firstName" + rowID).val();
    let lastName = $("#lastName" + rowID).val();
    let phoneNumber = $("#number" + rowID).val();
    let email = $("#email" + rowID).val();

    
    // Function call to addContact with proper values
    //alert("Contact made with " + firstName + " " + lastName + " " + phoneNumber + " " + email);
    addContact(firstName, lastName, phoneNumber, email);

    // Make current row unmodifiable
    lockInput(rowID);

    // change "Add contact" button to "Edit" and "Delete"
    $("#addContactButton" + rowID).hide();
    $("#editButton" + rowID).show();
    $("#deleteButton" + rowID).show();

    // Append new empty contacts row
    createEmptyContactRow();
    //alert("added contact");
}
function lockInput(currentRowID) {
    $("#firstName" + currentRowID).prop("readonly", true);
    $("#lastName" + currentRowID).prop("readonly", true);
    $("#number" + currentRowID).prop("readonly", true);
    $("#email" + currentRowID).prop("readonly", true);

    $("#firstName" + currentRowID).css({
        'border': 'none',
        'background': 'transparent'
    });
    $("#lastName" + currentRowID).css({
        'border': 'none',
        'background': 'transparent'
    });
    $("#number" + currentRowID).css({
        'border': 'none',
        'background': 'transparent'
    });
    $("#email" + currentRowID).css({
        'border': 'none',
        'background': 'transparent'
    });
}
function unlockInput(currentRowID) {
    $("#firstName" + currentRowID).prop("readonly", false);
    $("#lastName" + currentRowID).prop("readonly", false);
    $("#number" + currentRowID).prop("readonly", false);
    $("#email" + currentRowID).prop("readonly", false);

    $("#firstName" + currentRowID).css({
        'border': '1px solid grey',
        'background': 'white'
    });
    $("#lastName" + currentRowID).css({
        'border': '1px solid grey',
        'background': 'white'
    });
    $("#number" + currentRowID).css({
        'border': '1px solid grey',
        'background': 'white'
    });
    $("#email" + currentRowID).css({
        'border': '1px solid grey',
        'background': 'white'
    });
}
function createEmptyContactRow() {
    $("table").append(createEmptyContactRowHelper());  
    $("#addContactButton" + rowID).show();
    $("#editButton" + rowID).hide();
    $("#deleteButton" + rowID).hide();
    $("#doneButton" + rowID).hide();
}
function createContact(fName, lName, pNumber, email) {
    $("table").append(createContactHelper(fName, lName, pNumber, email));  
    $("#addContactButton" + rowID).hide();
    $("#editButton" + rowID).show();
    $("#deleteButton" + rowID).show();
    $("#doneButton" + rowID).hide();
    lockInput(rowID);
}
function createEmptyContactRowHelper() {     
    rowID++;
    return '<tr id="' + rowID + '"><td><input type="text" class="inputInfo" id="firstName' + rowID + '" placeholder="First name" required></td><td><input type="text" class="inputInfo" id="lastName' + rowID + '" placeholder="Last name" required></td><td><input type="text" class="inputInfo" id="number' + rowID + '" placeholder="Phone number" required></td><td><input type="email" class="inputInfo" id="email' + rowID + '" placeholder="Email" required></td><td><button id="editButton' + rowID + '" type="button" class="btn btn-dark" onclick="editContact();";>Modify</button><button id="deleteButton' + rowID + '" type="button" class="btn btn-dark" onclick="deleteContactHandler();";>Destroy</button><button id="doneButton' + rowID + '" type="button" class="btn btn-dark" onclick="doneEditingHandler();";>Done</button><button id="addContactButton' + rowID + '" type="button" class="btn btn-dark" onclick="addContactHandler();";>Append Entry</button></td></tr>';
}
function createContactHelper(fName, lName, pNumber, email) {     
    rowID++;
    return '<tr id="' + rowID + '"><td><input type="text" class="inputInfo" id="firstName' + rowID + '" value="' + fName + '" required></td><td><input type="text" class="inputInfo" id="lastName' + rowID + '" value="' + lName + '" required></td><td><input type="text" class="inputInfo" id="number' + rowID + '" value="' + pNumber + '" required></td><td><input type="email" class="inputInfo" id="email' + rowID + '" value="' + email + '" required></td><td><button id="editButton' + rowID + '" type="button" class="btn btn-dark" onclick="editContact();";>Modify</button><button id="deleteButton' + rowID + '" type="button" class="btn btn-dark" onclick="deleteContactHandler();";>Destroy</button><button id="doneButton' + rowID + '" type="button" class="btn btn-dark" onclick="doneEditingHandler();";>Done</button><button id="addContactButton' + rowID + '" type="button" class="btn btn-dark" onclick="addContactHandler();";>Append Entry</button></td></tr>';
}

$(document).ready(function () {
    $("table").append(createEmptyContactRow());  
    $("table").append(createContact("david", "david", "david", "david"));              
});


