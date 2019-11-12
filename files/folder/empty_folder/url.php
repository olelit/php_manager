<?php

include ('logic.php');
//axios отпрляет json строку 
$data = json_decode(file_get_contents("php://input"), true);
if(isset($data['op'])){
    switch($data['op']){
        case 'open':{
            echo openFile($data['path']);
            exit;
            break;
        }
        case 'save':{
            save($data['path'], $data['text']);
            exit;
            break;
        }
    }
    exit;
}

if(isset($_GET['op'])){
    switch($_GET['op']){
        case 'copy':{
            copyFile($_GET['old_path'], $_GET['new_path']);
            break;
        }
        case 'move':{
            move($_GET['old_path'], $_GET['new_path']);
            break;
        }
        case 'delete':{
            delete($_GET['path']);
            break;
        }
        case 'create':{
            create($_GET['path']);
            break;
        }
    }
    exit;
}

if(isset($_POST['op'])){
    upload($_POST, $_FILES['file']);
    exit;
}

if(isset($_GET['path'])){
    echo json_encode(showAll("/".$_GET['path']),  JSON_UNESCAPED_UNICODE);
}
else{
    echo json_encode(showAll(),  JSON_UNESCAPED_UNICODE);
}
