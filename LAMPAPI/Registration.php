<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

 $inData = getRequestInfo();

 $firstName = $inData["firstName"];
 $lastName = $inData["lastName"];
 $login = $inData["login"];
 $password = $inData["password"];

 $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
 if ($conn->connect_error)
 {
  returnWithError( $conn->connect_error );
 }
 else
 {
  $stmt = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
  $stmt->bind_param("s", $login);
  $stmt->execute();
  $result = $stmt->get_result();

  if (mysqli_num_rows($result) > 0) {
   returnWithError("Username taken");
  }
  else {
   $stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES(?,?,?,?)");
   $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
   if ($stmt->execute()) {
    // Get the userId of the newly inserted user
    $userId = $conn->insert_id;
    // Return the userId in the JSON response
    returnWithInfo($userId);
   } else {
    returnWithError("Registration failed");
   }
  }

  $stmt->close();
  $conn->close();
 }

 function getRequestInfo()
 {
  return json_decode(file_get_contents('php://input'), true);
 }

 function sendResultInfoAsJson( $obj )
 {
  header('Content-type: application/json');
  echo $obj;
 }

 function returnWithError( $err )
 {
  $retValue = '{"id":0,"error":"' . $err . '"}';
  sendResultInfoAsJson( $retValue );
 }

 // New function to return the userId
 function returnWithInfo( $id )
 {
  $retValue = '{"id":' . $id . ',"error":""}';
  sendResultInfoAsJson( $retValue );
 }

?>
