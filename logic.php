<?php

const DIRECTORY = __DIR__."/files";

function joinPath($path , $name){
    return $path."/".$name;
}

function getFiles($allFiles = [], $path = DIRECTORY){
    $files = array_diff(scandir($path), array('..', '.'));
    foreach ($files as $file){
        $fullPath = joinPath($path, $file);
        if(is_dir($fullPath) && array_diff(scandir($fullPath), array('..', '.')) != []){
            $allFiles[$file] = getFiles($allFiles, $fullPath);
        }
        else{
            $allFiles[$file] = $file;
        }
    }
    return $allFiles;
}

function save($path, $text){
    return file_put_contents(joinPath(DIRECTORY, $path), $text);
}

function copyFile($old_path, $new_path){
    $splitFile = explode("/",$old_path);
    $name = array_pop($splitFile);
    return copy(joinPath(DIRECTORY, $old_path), joinPath(DIRECTORY, $new_path."/".$name));
}

function move($old_path, $new_path){
    $splitFile = explode("/",$old_path);
    $name = array_pop($splitFile);
    return rename(joinPath(DIRECTORY, $old_path), joinPath(DIRECTORY, $new_path."/".$name));
}

function delete($path){
    $deletePath = joinPath(DIRECTORY, $path);
    if(is_dir($deletePath)){
        delTree($deletePath);
    }
    else{
        unlink($deletePath);
    }
}

function delTree($dir) {
    $files = array_diff(scandir($dir), array('.','..'));
     foreach ($files as $file) {
       (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
     }
     return rmdir($dir);
   }

function showAll(){
    $files = getFiles();
    return $files;
}

function openFile($path){
    return file_get_contents(joinPath(DIRECTORY, $path));
}

function upload($data, $file){
    $path = $data['path']."/".$file['name'];
    move_uploaded_file($file['tmp_name'], joinPath(DIRECTORY, $path));
}

function create($path){
    $folderPath = DIRECTORY.$path."/";
    var_dump($folderPath);
    return mkdir($folderPath);
}