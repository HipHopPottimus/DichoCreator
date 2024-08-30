export class DichoDiagram{
    constructor(output,data,editable){
        this.output = output;
        this.data = data;
        this.editable = editable;
        this.refresh();
    }

    generateBranch(tree){
        let content = `<p class="editableText">${tree.name}</p>`;
        //if the tree segment has branches bellow it
        if(tree.branches){
            content += `
                <img class="branchGraphic" src="../graphics/branch.svg">
                <div>
                    ${this.generateBranch(tree.branches[0].data)}
                    ${this.generateBranch(tree.branches[1].data)}
                </div>
            `
        }
        return `<div class="treeBranch" data-catagoryName="${tree.name}">${content}</div>`;
    }

    refresh(){
        this.output.innerHTML = this.generateBranch(this.data.tree);
        for(let graphic of Array.from(document.getElementsByClassName("branchGraphic")).reverse()){
            graphic.height = window.innerWidth * 0.02;
            graphic.width = graphic.nextElementSibling.children[0].clientWidth;
        }
        if(this.editable){
            for(let textInput of document.getElementsByClassName("editableText")){
                textInput.setAttribute("contenteditable","");
                textInput.addEventListener("focusout",() => {
                    
                    this.refresh();
                });
            }
        }
    }

    getBranchFromCatagoryName(name){
        let branchesToSearch = [this.data.tree];
        while(branchesToSearch.length > 0){
            console.log(branchesToSearch);
            let nextBranches = [];
            for(let branch of branchesToSearch){
                if(branch.name == name){
                    return branch;
                }
                if(branch.branches){
                    nextBranches = nextBranches.concat(branch.branches);
                }
            }
            branchesToSearch = nextBranches;
        }
        return null;
    }
}