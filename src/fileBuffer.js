import fileInterface from "./fileInterface.js";
export var data = new Object();

export async function save(){
    await fileInterface.write(data);
}

export async function loadData(){
    data = await fileInterface.read();
}

export var dataModified = false;

export async function checkModifications(){
    let previousState = dataModified
    dataModified = JSON.stringify(data) != JSON.stringify(await fileInterface.read());
    let title = document.querySelector("title");
    if(previousState != dataModified){
        if(dataModified){
            title.innerHTML += title.innerHTML.includes(" *") ? "" : " *";
        }
        else{
            title.innerHTML = title.innerHTML.replaceAll(" *","");
        }
    }
    window.setTimeout(checkModifications,1000);
}

window.setTimeout(checkModifications,1000);

window.addEventListener("beforeunload", async (e) => {
    if(dataModified) e.preventDefault();
});