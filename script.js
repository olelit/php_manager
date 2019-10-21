const menuMargin = 10;
const hideClass = 'hide';
const submenuClass = 'submenu';

let manager = document.querySelector(".manager"),
    links = undefined,
    menu = document.querySelector(".context_menu"),
    modal = document.querySelector('.modal'),
    closeModal = document.querySelector('.close'),
    text = document.querySelector('.modal textarea'),
    bufferPath = "",
    pathToFileOrFolder = "",
    operationFilename = "",
    newDirectory = "",
    lastEvent = undefined;

document.querySelector(".save").addEventListener('click', (event) => {
    let textContent = text.value;
    request({ op: "save", text: textContent, path: bufferPath }, 'put').then((response) => {
        text.value = "";
        closeModal.click();
    });
});

document.querySelector('.new_folder').addEventListener('click', (event) => {
    let folderModal = document.querySelector(".folder_modal");
    if (folderModal.classList.contains('hide')) {
        folderModal.classList.remove('hide')
    }
});

let op = "";
document.querySelector('.copy').addEventListener('click', (event) => {
    op = "copy";
});


document.querySelector('.move').addEventListener('click', (event) => {
    op = "move";
});


document.querySelector('.paste').addEventListener('click', (event) => {
    request({ op: op, old_path: pathToFileOrFolder, new_path: bufferPath }).then((responce) => {
        reinit();
    });
});

document.querySelector('.create').addEventListener('click', (event) => {
    let folderModal = document.querySelector(".folder_modal");
    let folderName = document.querySelector(".folder_name").value;
    if (folderName.length > 0) {
        if (!folderModal.classList.contains('hide')) {
            path = bufferPath + "/" + folderName;
            request({ op: "create", path: path }).then((responce) => {
                reinit();
            });
            folderModal.classList.add('hide');
        }
    }
});

document.querySelector('.upload').addEventListener('click', (event) => {
    document.querySelector(".upload_file").click();
});

document.querySelector('.delete').addEventListener('click', (event) => {
    request({ op: "delete", path: pathToFileOrFolder }, 'delete').then((response) => {
        reinit();
    });
});

document.querySelector('.upload_file').addEventListener('change', (event) => {
    let files = event.target.files || event.dataTransfer.files;
    let formData = new FormData();
    let file = document.querySelector('.upload_file').files[0];
    formData.append("file", file);
    formData.append("op", 'upload');
    formData.append("path", bufferPath);

    axios.post('url.php', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((responce) => {
        lastEvent.currentTarget.innerHTML += "<li class = 'file'>" + file.name + "</li>";
        bufferPath = "";
        //
    })
});

function reinit() {
    links = manager.querySelectorAll('li');
    window.addEventListener('click', (event) => {
        if (!menu.classList.contains(hideClass)) {
            menu.classList.add(hideClass);
        }
    });

    links.forEach(item => {
        item.addEventListener('dblclick', (event) => {
            let element = event.target.nextSibling;
            if (element !== null && element.classList.contains(submenuClass)) {
                if (element.classList.contains(hideClass)) {
                    element.classList.remove(hideClass);
                }
                else {
                    element.classList.add(hideClass);
                }
            }
            else {
                let op = 'open';
                let filename = event.target.innerText;
                if (modal.classList.contains('hide')) {
                    modal.classList.remove('hide');
                }
                path = createFullPath(event);

                request({ op: 'open', path: path }, 'post').then((response) => {
                    text.value = response.data;
                    bufferPath = path;
                });
            }
        });
        item.addEventListener('contextmenu', (event) => {

            operationFilename = event.currentTarget.innerText;

            let mouse = window.event;
            let x = mouse.x;
            let y = mouse.y;

            menu.classList.remove(hideClass);
            menu.style.left = (x - menuMargin) + "px";
            menu.style.top = (y - menuMargin) + "px";

            if (event.target.classList.contains('folder')) {
                bufferPath = createFullPath(event);
            }

            if (op === "") {
                pathToFileOrFolder = createFullPath(event);
            }

            lastEvent = event;

            event.preventDefault();
        })
    })
}

function createFullPath(event) {
    path = "";
    let elem = event.target;
    let parents = event.path;
    let index = parents.length - 3;
    while (index >= 0) {

        let parent = parents[index];

        if (parent.localName == 'div' && parent.classList.contains('submenu')) {
            path += parent.previousSibling.innerText + "/";
        }

        index--;
    }

    path += elem.innerText;
    return path;
}

function getOutput(data) {
    let output = "";
    for (let key in data) {
        if (Array.isArray(data[key]) || typeof data[key] === 'object') {
            output += "<ul>" + "<li class='first folder'>" + key + "</li><div class = 'submenu hide'><ul>" + getOutput(data[key]) + "</ul></div>" + "</ul>";
        }
        else if (key.indexOf(".") == -1) {
            output += "<ul>" + "<li class='first folder'>" + key + "</li><div class = 'submenu hide'><ul></ul></div>" + "</ul>";
        }
        else {
            let elemClass = 'file';
            output += "<li class = " + elemClass + ">" + data[key] + "</li>";
        }
    }
    return output;
}

let files = [];
function fileList() {
    request().then((response) => {
        files = response.data;
        let output = getOutput(response.data);
        manager.innerHTML = output;
        reinit();
    });
}

function request(data = {}, method = "get", headers = {}, url = "url.php", ) {
    let ajax = undefined;
    switch (method) {
        case "get": {
            ajax = axios.get(url, {
                params: data
            });
            break;
        }
        case "post": {
            ajax = axios.post(url, data, {
                headers: headers
            });
            break;
        }
        case "put": {
            ajax = axios.put(url, data);
            break;
        }
        case "delete": {
            ajax = axios.delete(url, { params: data });
            break;
        }
    }
    return ajax;
}

closeModal.addEventListener('click', (event) => {
    modal.classList.add('hide');
});

fileList();
