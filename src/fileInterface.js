import IDBWebStorage from "./IDBWebStorage.js";
const storage = new IDBWebStorage("DichoKeyStorage");

export default {
    async getFileHandle(){
        let fileHandle = await storage.getItem("projectFileHandle");
        let premission;
        try{
            premission = await fileHandle.queryPermission({mode:"readwrite"}) == "granted";
            //check to make sure the file still exists
            await fileHandle.getFile();
        }
        catch(e){
            if(e.name == "NotFoundError" || e.name == "TypeError"){
                throw new Error("No file found");
            }
            premission = false;
        }
        if(!premission){
            let popup = document.createElement("dialog");
            await (new Promise((resolve,reject) => {
                popup.innerHTML = 
                `
                <p>We need permission to edit your file</p>
                <button id="request-permission-popup-button">Give premission</button>
                `
                document.body.appendChild(popup);
                document.getElementById("request-permission-popup-button").addEventListener("click", async () => {
                    let premission = await fileHandle.requestPermission({mode: "readwrite"});
                    if(premission == "granted"){
                        popup.remove();
                        resolve();
                    }
                });
                popup.show();
            }));
        }
        return fileHandle;
    },
    async read(){
        let handle = await this.getFileHandle();
        let file = await handle.getFile();
        return JSON.parse(await file.text());
    },
    async write(newContent){
        let handle = await this.getFileHandle();
        let writeable = await handle.createWritable();
        writeable.write(JSON.stringify(newContent));
        await writeable.close();
    },

    async setNewFileHandle(handle){
        await storage.setItem("projectFileHandle",handle);
    }
}