const urlBase = 'http://cop4331-spring.xyz/LAMPAPI';
const extension = 'php';

//var userId = 0;
//localStorage.setItem("userId", 0);
let firstName = "";
let lastName = "";


function doLogin()
{
	//userId = 0;
	localStorage.setItem("userId", 0);
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
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
				//userId = jsonObject.id;
				localStorage.setItem("userId", jsonObject.id);
				//console.log("first log:" + localStorage.getItem("userId"));
				//alert(userId);


				if(parseInt(localStorage.getItem("userId")) < 1)
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;


				window.location.href = "contacts-index.html";

				//console.log("second log:" + localStorage.getItem("userId"));

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
	userId = 0;
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;

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

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Registration.' + extension;
	let xhr = new XMLHttpRequest();

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 ) {
					document.getElementById("registerResult").innerHTML = "Registration failed";
					return;
				}

				firstName = tmp.firstName;
				lastName = tmp.lastName;
				login = jsonObject.username;
				password = jsonObject.password;
				saveCookie();

				window.location.href = "contacts-index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
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
	//alert("cookie read, userid is: " + userId);
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	localStorage.clear();
	window.location.href = "index.html";
}

// This will be test, just changing the endpoint for now
function addContact(fName, lName, pNumber, email)
{
	// let newContact = document.getElementById("contactText").value;
	// document.getElementById("contactAddResult").innerHTML = "";
	//console.log("user id is: " + userId);
    //let tmp = {color:newContact,userId,userId};
    // let newContactSplit = newContact.split(" ");
    // let tmp = {firstName:newContactSplit[0], lastName:newContactSplit[1], phone:newContactSplit[2], email:newContactSplit[3], userId:userId}
	//let tmp = {firstName:fName, lastName:lName, phone:pNumber, email:email, userId:userId};
	let tmp = {firstName:fName, lastName:lName, phone:pNumber, email:email, userId:parseInt(localStorage.getItem("userId"))};

	//let newContact = document.getElementById("contactText").value;
	//document.getElementById("contactAddResult").innerHTML = "";

	//let tmp = {color:newContact,userId,userId};
	//let newContactSplit = newContact.split(" ");
	//let tmp = {firstName:newContactSplit[0], lastName:newContactSplit[1], phone:newContactSplit[2], email:newContactSplit[3], userId:userId}
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
				//alert("contact added successfully");
				// document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert("error in adding contact");
		// document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function searchContacts ()
{
	let tmp = {userId: parseInt(localStorage.getItem("userId")), search: "" };
	
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
					
				}
			}
		}
		xhr.send(jsonPayload);
	}
	catch (err) {

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
				console.log("userid in deleteContact(): " + parseInt(localStorage.getItem("userId")));
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
	let tmp = {field:field, edit:edit, ID:ID)};
	
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
				console.log("ID in editContact(): " + ID);
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


// function addColor()
// {
// 	let newColor = document.getElementById("colorText").value;
// 	document.getElementById("colorAddResult").innerHTML = "";
//
// 	let tmp = {color:newColor,userId,userId};
// 	let jsonPayload = JSON.stringify( tmp );
//
// 	let url = urlBase + '/AddColor.' + extension;
//
// 	let xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try
// 	{
// 		xhr.onreadystatechange = function()
// 		{
// 			if (this.readyState == 4 && this.status == 200)
// 			{
// 				document.getElementById("colorAddResult").innerHTML = "Color has been added";
// 			}
// 		};
// 		xhr.send(jsonPayload);
// 	}
// 	catch(err)
// 	{
// 		document.getElementById("colorAddResult").innerHTML = err.message;
// 	}
//
// }
//
// function searchColor()
// {
// 	let srch = document.getElementById("searchText").value;
// 	document.getElementById("colorSearchResult").innerHTML = "";
//
// 	let colorList = "";
//
// 	let tmp = {search:srch,userId:userId};
// 	let jsonPayload = JSON.stringify( tmp );
//
// 	let url = urlBase + '/SearchColors.' + extension;
//
// 	let xhr = new XMLHttpRequest();
// 	xhr.open("POST", url, true);
// 	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
// 	try
// 	{
// 		xhr.onreadystatechange = function()
// 		{
// 			if (this.readyState == 4 && this.status == 200)
// 			{
// 				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
// 				let jsonObject = JSON.parse( xhr.responseText );
//
// 				for( let i=0; i<jsonObject.results.length; i++ )
// 				{
// 					colorList += jsonObject.results[i];
// 					if( i < jsonObject.results.length - 1 )
// 					{
// 						colorList += "<br />\r\n";
// 					}
// 				}
//
// 				document.getElementsByTagName("p")[0].innerHTML = colorList;
// 			}
// 		};
// 		xhr.send(jsonPayload);
// 	}
// 	catch(err)
// 	{
// 		document.getElementById("colorSearchResult").innerHTML = err.message;
// 	}
//
// }
