<?php

const DIRECORY = __DIR__."/files";

function joinPath($path, $name){
    return $path."/".$name;
}

function getFiles($allFiles = [], $path = DIRECORY){
    $files = array_diff(scandir($path), array('..', '.'));
    foreach ($files as $file){
        $fullPath = joinPath($path, $file);
        if(is_dir($fullPath) && array_diff(scandir($fullPath), array('..', '.')) != []){
            $allFiles[$file][] = [$file => getFiles($allFiles, $fullPath)];
        }
        else{
            $allFiles[$path][] = $file;
        }
    }
    return $allFiles;
}

function showAll(){
    $files = getFiles();
    return $files;

    //$files =

    //echo $ind;
}