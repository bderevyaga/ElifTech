<?php
header('HTTP/1.1 201 Created');
header("Content-Type: application/json;charset=utf-8");
header('Access-Control-Allow-Origin: *');  

$dsn= 'mysql:host=mysql.hostinger.com.ua;dbname=u919952063_test';
$db_user = "***";
$db_pass = "***";

$dbh = new PDO($dsn, $db_user, $db_pass);
$dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

//http://www.chlab.ch/blog/archives/webdevelopment/manually-parse-raw-http-data-php
function parse_raw_http_request(array &$a_data)
{
  $input = file_get_contents('php://input');
  preg_match('/boundary=(.*)$/', $_SERVER['CONTENT_TYPE'], $matches);
  if (!count($matches))
  {
    parse_str(urldecode($input), $a_data);
    return $a_data;
  }
  $boundary = $matches[1];
  $a_blocks = preg_split("/-+$boundary/", $input);
  array_pop($a_blocks);
  foreach ($a_blocks as $id => $block)
  {
    if (empty($block))
    continue;
    if (strpos($block, 'application/octet-stream') !== FALSE)
    {
      preg_match("/name=\"([^\"]*)\".*stream[\n|\r]+([^\n\r].*)?$/s", $block, $matches);
      $a_data['files'][$matches[1]] = $matches[2];
    }
    else
    {
      preg_match('/name=\"([^\"]*)\"[\n|\r]+([^\n\r].*)?\r$/s', $block, $matches);
      $a_data[$matches[1]] = $matches[2];
    }
  }
}

$_PUT = array (); 
$_DELETE = array (); 
if($_SERVER['REQUEST_METHOD'] == 'PUT'){
  parse_raw_http_request($_PUT);
  $dbh->query("UPDATE `tree` SET `name` = '".$_PUT['name']."', `point` = '".$_PUT['point']."' WHERE `tree`.`id` = ". $_PUT['id']);
}else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
  parse_raw_http_request($_DELETE);
  $dbh->query("DELETE FROM `tree` WHERE `tree`.`id` = ". $_DELETE['id']);
}else if($_SERVER['REQUEST_METHOD'] == 'GET'){
  $get_info = $dbh->prepare('SELECT * from tree');
  if($get_info->execute())
  {
      $information = $get_info->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($information);
  }
}else if($_SERVER['REQUEST_METHOD'] == 'POST'){
  $dbh->query("INSERT INTO `tree` (`id`, `name`, `point`, `parent`) VALUES (NULL, '". $_POST['name'] ."', '". $_POST['point'] ."', '". $_POST['parent'] ."')");
  $get_info = $dbh->prepare('SELECT * from tree');
  if($get_info->execute())
  {
      $information = $get_info->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($information);
  }
}
$dbh = null;
