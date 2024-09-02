import fileInterface from "../fileInterface.js";

document.getElementById("openFileButton").onclick = async () => {
    await openFile()
    window.location.assign("../editor/editor.html");
}

document.getElementById("newFileButton").onclick = async () => {
    await createNewFile();
    window.location.assign("../editor/editor.html");
}

async function createNewFile(){
    let fileHandle = await window.showSaveFilePicker(
    {
        types: [{
            description: "Dichotomous key JSON file",
            accept: {"application/json":[".json"]}
        }],
        excludeAcceptAllOption: true,
        suggestedName: "new_project"
    }
    );
    await fileInterface.setNewFileHandle(fileHandle);
    let projectTemplate = (await import("./projectTemplate.json",{with:{type:"json"}})).default;
    await fileInterface.write(projectTemplate);
}

async function openFile(){
    let [fileHandle] = await window.showOpenFilePicker(
    {
        types: [{
            description: "Dichotomous key JSON file",
            accept: {"application/json":[".json"]}
        }],
        excludeAcceptAllOption: true,
        multiple: false
    }
    );
    await fileInterface.setNewFileHandle(fileHandle);
} 