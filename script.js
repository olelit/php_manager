const menuMargin = 10;
const hideClass = 'hide';


let currentPath = ['/'];
let operationFilename = '';


let manager = document.querySelector(".manager"),
    links = undefined,
    menu = document.querySelector(".context_menu");

function reinit() {
    links = manager.querySelectorAll('.row_item');

    window.addEventListener('click', (event) => {
        if (!menu.classList.contains(hideClass)) {
            menu.classList.add(hideClass);
        }
    });

    links.forEach(item => {
        item.addEventListener('contextmenu', (event) => {

            operationFilename = event.currentTarget.dataset.name;

            let mouse = window.event;
            let x = mouse.x;
            let y = mouse.y;

            menu.classList.remove(hideClass);
            menu.style.left = (x - menuMargin) + "px";
            menu.style.top = (y - menuMargin) + "px";

            event.preventDefault();
        })
    })
}

function getOutput(data) {
    let output = "";
    for(let key in data){
        if(Array.isArray(data[key]) || typeof data[key] === 'object'){
            output += "<ul>" + "<li class='first'>"+key+"</li><ul>"+getOutput(data[key])+"</ul>"+"</ul>";
        }
        else{
            output += "<li>"+data[key]+"</li>";
        }
    }
    return output;
}

function fileList() {
    request().then((response) => {
        let files = response.data;
        let output = getOutput(response.data);
        manager.innerHTML = output;

    });
}

function request(data = {op: ''}, method = "get", url = "url.php") {
    return axios({
        method: method,
        url: url,
        data: data
    });
}

fileList();
reinit();