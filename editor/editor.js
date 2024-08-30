import {data, loadData, save} from "../fileBuffer.js";

window.addEventListener("DOMContentLoaded",async () => {
    try{
        await loadData();
    }
    catch{
        window.location.assign("../splashPage/splashPage.html");
    }    
    refreshDiagram();

    document.getElementById("save-button").addEventListener("click",save);
    
    document.getElementById("manage-files-button").addEventListener("click",() => {
        window.location.assign('../splashPage/splashPage.html');
    });
    
    document.getElementById("export-button").addEventListener("click",() => {
        window.location.assign('../export/export.html');
    });

    window.data = data;
});

window.addEventListener("keydown",(e) => {
    if(e.key == "s" && e.ctrlKey){
        e.preventDefault();
        save();
    }
});


function generateBranch(branchID){
    let branch = data.tree[branchID];
    let content = "";
    content += `<label for="promptInput${branchID}" class="dataField">Prompt: <input id="promptInput${branchID}" data-type="prompt" value="${branch.prompt}" onchange="dataInput(${branchID},this)"></label>`
    let imgURL = branch.img;
    let imgPlaceholder = "No image";
    if(imgURL.includes("data:image")){
        imgPlaceholder = "Uploaded file";
        imgURL = "";
    }
    content += `
        <label for="imgInput${branchID}" class="dataField">Image url: <input id="imgInput${branchID}" data-type="img" value="${imgURL}" placeholder="${imgPlaceholder}" onchange="dataInput(${branchID},this)"></label>
        <button onclick="uploadImage(${branchID})">Upload an image from your device</button>
    `;
    //if the branch has branches bellow it
    if(branch.subCatagories){
        content += `
            <button onclick="deleteSubCatagories(${branchID})">Remove sub catagories</button>
            <div class="subCatagoryContainer">
        `;
        for(let subBranch of branch.subCatagories){
            if(!subBranch) continue;
            content += generateBranch(subBranch);
        }
        content += "</div>"
    }
    else{
        content += `
            <label class="dataField">Item name: <input id="nameInput${branchID}" data-type="name" onchange="dataInput(${branchID},this)" value="${branch.name}"></input></label>
            <p>Description:</p>
            <textarea class="dataField" data-type="description" placeholder="The description for this item" id="descriptionInput${branchID}" value="${branch.description}" onchange="dataInput(${branchID},this)">${branch.description}</textarea>
            <button onclick="createSubCatagory(${branchID})">Create sub catagory</button>
        `;
    }
    return `<div class="treeBranch" data-branchID="${branchID}">${content}</div>`;
}

function refreshDiagram(){
    let startCatagories = data.startCatagories;
    let output = document.getElementById("output");
    output.innerHTML = "";
    for(let catagoryID of startCatagories){
        output.innerHTML += generateBranch(catagoryID);
    }
}

globalThis.dataInput = (branchID,field) => { 
    let type = field.getAttribute("data-type");
    data.tree[branchID][type] = field.value;
}

globalThis.uploadImage = async (branch) => {
    let [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Images",
            accept: {
              "image/*": [".png", ".jpeg", ".jpg"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
    });
    let file = await handle.getFile();
    
    let reader = new FileReader();
    reader.addEventListener("load",() => {
        data.tree[branch].img = reader.result;
        refreshDiagram();
    });
    reader.readAsDataURL(file);
}

globalThis.createSubCatagory = (branchID) => {
    data.tree[branchID].subCatagories = [];
    for(let i = 0;i < 2;i++){
        let index = data.tree.indexOf(false);
        if(index == -1) index = data.tree.length;
        data.tree[branchID].subCatagories.push(index);
        data.tree[index] = {
            prompt: "",
            img: "",
            description: ""
        }
        refreshDiagram();
    }
}

globalThis.deleteSubCatagories = (branchID) => {
    for(let catagory of data.tree[branchID].subCatagories){
        data.tree[catagory] = false;
    }
    data.tree[branchID].subCatagories = false;
    refreshDiagram();
}