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

function fileList() {
    request().then((response) => {
        console.log(response.data);
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