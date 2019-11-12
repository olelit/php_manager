RERERERERE

function openFile($path){
    return file_get_contents(joinPath(DIRECTORY, $path));
}

function upload($data, $file){
    $path = $data['path']."/".$file['name'];
    move_uploaded_file($file['tmp_name'], joinPath(DIRECTORY, $path));
}

function create($path){
    $folderPath = joinPath(DIRECTORY, $path);
    return mkdir($folderPath);
}