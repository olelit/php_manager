<?php

include ('logic.php');

$functionName = "showAll";


echo json_encode(showAll(),  JSON_UNESCAPED_UNICODE);