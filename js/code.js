const urlBase = 'http://cop4331-spring.xyz/LAMPAPI';
const extension = 'php';

let firstName = "";
let lastName = "";


function doLogin()
{
	localStorage.setItem("userId", 0);
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );

				localStorage.setItem("userId", jsonObject.id);


				if(parseInt(localStorage.getItem("userId")) < 1)
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;


				window.location.href = "contacts-index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister() {
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("registerName").value;
	let password = document.getElementById("registerPassword").value;
	let passwordConfirm = document.getElementById("registerConfirmPassword").value;

	document.getElementById("registerResult").innerHTML = "";



	if (password !== passwordConfirm) {
		document.getElementById("registerResult").innerHTML = "Passwords do not match";
		return;
	}
	if (firstName === "" || lastName === "" || login === "" || password === "") {
		document.getElementById("registerResult").innerHTML = "Please fill out all fields";
		return;
	}

	let rules = [
		{ regex: /.{8,}/, message: "Password must be at least 8 characters long" },
		{ regex: /[a-z]/, message: "Password must contain at least one lowercase letter" },
		{ regex: /[A-Z]/, message: "Password must contain at least one uppercase letter" },
		{ regex: /[0-9]/, message: "Password must contain at least one number" }
	];

	for (let rule of rules) {
		if (!rule.regex.test(password)) {
			document.getElementById("registerResult").innerHTML = rule.message;
			return;
		}
	}

	let tmp = { firstName: firstName, lastName: lastName, login: login, password: password };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Registration.' + extension;
	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
                    let userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("registerResult").innerHTML = "Registration failed";
					return;
				}

				// Store the userId in local storage
				localStorage.setItem("userId", userId);
                localStorage.setItem("firstName", tmp.firstName);
                localStorage.setItem("lastName", tmp.lastName);
				
				saveCookie();

				window.location.href = "contacts-index.html";
                } else {
                    document.getElementById("registerResult").innerHTML = "Server error: " + xhr.statusText;
                }
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	let userId = localStorage.getItem("userId");
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	var userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

// Logs the user out and resets session information
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	localStorage.clear();
	window.location.href = "index.html";
}

// Sends json payload with contact information to be added to database
function addContact(fName, lName, pNumber, email)
{
	let tmp = {firstName:fName, lastName:lName, phone:pNumber, email:email, userId:parseInt(localStorage.getItem("userId"))};

	let jsonPayload = JSON.stringify( tmp );


	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("userid in addContact(): " + parseInt(localStorage.getItem("userId")));
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert("error in adding contact");
	}

}


function deleteContact(fName, lName) {
	let tmp = {firstName:fName, lastName:lName, userId:parseInt(localStorage.getItem("userId"))};

	let jsonPayload = JSON.stringify( tmp );


	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//console.log("userid in deleteContact(): " + parseInt(localStorage.getItem("userId")));
				//alert("contact deleted successfully");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert("error in deleting contact");
	}
}

function editContact(field, edit, ID) {
	let tmp = {field:field, edit:edit, ID:ID};

	let jsonPayload = JSON.stringify( tmp );


	let url = urlBase + '/EditContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				//console.log("ID in editContact(): " + ID);
				//alert("contact deleted successfully");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert("error in editing contact");
	}
}
