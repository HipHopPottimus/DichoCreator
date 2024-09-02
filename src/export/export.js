import {data, loadData, save, dataModified} from "../fileBuffer.js";

window.addEventListener("DOMContentLoaded",async () => {
    try{
        await loadData();
    }
    catch{
        window.location.assign("../splashPage/splashPage.html");
    }
    
    document.getElementById("return-button").addEventListener("click",() => {
        history.back();
    });

    for(let tooltipElement of document.querySelectorAll("[data-tooltip]")){
        tooltipElement.innerHTML += `<span class="tooltip">${tooltipElement.getAttribute("data-tooltip")}</span>`;
    }
});

globalThis.exportDichoKey = async () => {
    let title = document.getElementById("title").value;
    let itemName = document.getElementById("name").value.toLowerCase();
    let theme = document.getElementById("theme").value;

    let colorStyleSheet = await (await fetch(`./themes/${theme}.css`)).text();

    let output = await (await fetch("./exportedDichoFileTemplate.html")).text();
    
    output = output.replaceAll(`"_DATA"`,JSON.stringify(data));
    output = output.replaceAll(`_ITEM`,itemName);
    output = output.replaceAll(`_TITLE`,title);
    output = output.replaceAll(`/*_COLOR_STYLE*/`,colorStyleSheet);

    let handle = await window.showSaveFilePicker(
        {
            types: [{
                description: "HTML",
                accept: {"text/html":[".html"]}
            }],
            excludeAcceptAllOption: true,
            suggestedName: `${title}_export`
        }
    );
    let writable = await handle.createWritable();
    await writable.write(output);
    await writable.close();

    document.getElementById("output").innerHTML = `
        <p>Dichotomous key exported sucsesfully. View it at <a href="${URL.createObjectURL(await handle.getFile())}" target="_blank">${handle.name}</a></p>
        <p>Warning: This link is not permanent! It will expire when you close this page. For permanent access, open the file from your device.<p>
    `;
}