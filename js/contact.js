const idlist = []
var rowID = -1;

// Loads the first 10 contacts (if they exist) from the database
function fetchFirstLoadedContacts() {
    let tmp = {userId: parseInt(localStorage.getItem("userId")), search: ""};


	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
	 	{
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                
				for (let i = 0; i < jsonObject.results.length; i++) {
					createContact(jsonObject.results[i].FirstName, jsonObject.results[i].LastName, 
                        jsonObject.results[i].Phone, jsonObject.results[i].Email, jsonObject.results[i].ID);
				}
			}
		}
		xhr.send(jsonPayload);
	}
	catch (err) {

	}

}

let intervalID = 0;
function timedSearchContacts() {
    clearTimeout(intervalID);

    intervalID = setTimeout(() => {
        searchContacts();
      }, 250);
}

function searchContacts() {
    // Clear table
    for (let i = 0; i <= rowID; i++) {
        $("#" + i).remove();
    }

    // Take search
    let search = document.getElementById("searchBar").value;

    let tmp = {userId: parseInt(localStorage.getItem("userId")), search: search};


	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
	 	{
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    //console.log(jsonObject.error);
                    return;
                }
                
				for (let i = 0; i < jsonObject.results.length; i++) {
					createContact(jsonObject.results[i].FirstName, jsonObject.results[i].LastName, 
                        jsonObject.results[i].Phone, jsonObject.results[i].Email, jsonObject.results[i].ID);
				}
			}
		}
		xhr.send(jsonPayload);
	}
	catch (err) {

	}
}

function editContactHandler() {
    // Find table row to be modified using RegEx
    let ID = event.srcElement.id;
    let currentRowID = ID.match(/\d+/);


    // Make current row modifiable
    unlockInput(currentRowID);

    // Change "Edit" button to "Done"
    $("#editButton" + currentRowID).hide();
    $("#deleteButton" + currentRowID).hide();
    $("#doneButton" + currentRowID).show();
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
    editContact("FirstName", firstName, idlist[currentRowID]);
    editContact("LastName", lastName, idlist[currentRowID]);
    editContact("Phone", phoneNumber, idlist[currentRowID]);
    editContact("Email", email, idlist[currentRowID]);

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
    deleteContact(firstName, lastName);

    // Remove row from table
    $("#" + currentRowID).remove();
}

// Displays a popup message with input parameter for invalid contact inputs
function displayPopup(message) {
    var popup = document.getElementById("popupMessage");
    popup.textContent = message;
    popup.style.display = "block";

    setTimeout(function() {
        popup.style.display = "none";
    }, 3000); // Hide the popup after 3 seconds
}


function addContactHandler() {
    var phonePattern = /^\d{3}-?\d{3}-?\d{4}$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Grab and store each field in a variable from current row
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phoneNumber = document.getElementById("number").value;
    let email = document.getElementById("email").value;

    if (firstName === "")
    {
        displayPopup("Please enter a first name");
        return;
    } 
    else if (lastName === "") {
        displayPopup("Please enter a last name");
        return;
    } 
    else if (phoneNumber === "") {
        displayPopup("Please enter a phone number");
        return;
    } 
    else if (email === "") {
        displayPopup("Please enter an email");
        return;
    }
    else if (!phonePattern.test(phoneNumber)) {
        displayPopup("Invalid phone number");
        return;
    }
    else if (!emailPattern.test(email)) {
        displayPopup("Invalid email");
        return;
    }



    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("number").value = "";
    document.getElementById("email").value = "";

    
    // Function call to addContact with proper values
    addContact(firstName, lastName, phoneNumber, email);

    // Clear table
    for (let i = 0; i <= rowID; i++) {
        $("#" + i).remove();
    }

    // Give server time to process add contact before loading again
    setTimeout(() => {
        fetchFirstLoadedContacts();
      }, 100);
    
    
    /*
    // Make current row unmodifiable
    lockInput(rowID);

    // change "Add contact" button to "Edit" and "Delete"
    $("#addContactButton" + rowID).hide();
    $("#editButton" + rowID).show();
    $("#deleteButton" + rowID).show();

    // Append new empty contacts row
    createEmptyContactRow();
    //alert("added contact");
    */
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
function createContact(fName, lName, pNumber, email, ID) {
    $("table").append(createContactHelper(fName, lName, pNumber, email));  
    
    $("#addContactButton" + rowID).hide();
    $("#editButton" + rowID).show();
    $("#deleteButton" + rowID).show();
    $("#doneButton" + rowID).hide();

    lockInput(rowID);
    idlist[rowID] = ID;
}

function createEmptyContactRowHelper() {     
    rowID++;
    return '<tr id="' + rowID + '"><td><input type="text" class="inputInfo" id="firstName' + rowID + '" placeholder="First name" required></td><td><input type="text" class="inputInfo" id="lastName' + rowID + '" placeholder="Last name" required></td><td><input type="text" class="inputInfo" id="number' + rowID + '" placeholder="Phone number" required></td><td><input type="email" class="inputInfo" id="email' + rowID + '" placeholder="Email" required></td><td><button id="editButton' + rowID + '" type="button" class="btn btn-dark" onclick="editContactHandler();";>Modify</button><button id="deleteButton' + rowID + '" type="button" class="btn btn-dark" onclick="deleteContactHandler();";>Destroy</button><button id="doneButton' + rowID + '" type="button" class="btn btn-dark" onclick="doneEditingHandler();";>Done</button><button id="addContactButton' + rowID + '" type="button" class="btn btn-dark" onclick="addContactHandler();";>Append Entry</button></td></tr>';
}

function createContactHelper(fName, lName, pNumber, email) {     
    rowID++;
    return '<tr id="' + rowID + '"><td><input type="text" class="inputInfo" id="firstName' + rowID + '" value="' + fName + '" required></td><td><input type="text" class="inputInfo" id="lastName' + rowID + '" value="' + lName + '" required></td><td><input type="text" class="inputInfo" id="number' + rowID + '" value="' + pNumber + '" required></td><td><input type="email" class="inputInfo" id="email' + rowID + '" value="' + email + '" required></td><td><button id="editButton' + rowID + '" type="button" class="btn btn-dark" onclick="editContactHandler();";>Modify</button><button id="deleteButton' + rowID + '" type="button" class="btn btn-dark" onclick="deleteContactHandler();";>Destroy</button><button id="doneButton' + rowID + '" type="button" class="btn btn-dark" onclick="doneEditingHandler();";>Done</button><button id="addContactButton' + rowID + '" type="button" class="btn btn-dark" onclick="addContactHandler();";>Append Entry</button></td></tr>';
}

