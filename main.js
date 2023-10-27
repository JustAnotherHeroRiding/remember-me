import { fields } from "./possibleImages.js";
class Block {
    name;
    width;
    height;
    image;
    imageElement;
    divElement;
    openFunction;
    constructor(name, width, height, image, openFunction) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.image = image;
    }
    setOpenFunction(openFunction) {
        this.openFunction = openFunction;
    }
    getOpenFunction() {
        return this.openFunction;
    }
    getAttributes() {
        return {
            name: this.name,
            width: this.width,
            height: this.height,
            image: this.image,
        };
    }
    setElement(element) {
        switch (element.tagName) {
            case "DIV":
                this.divElement = element;
                break;
            case "IMG":
                this.imageElement = element;
                break;
        }
    }
    getElement(elementName) {
        switch (elementName.toUpperCase()) {
            case "DIV":
                return this.divElement;
            case "IMG":
                return this.imageElement;
        }
    }
    deleteElement(element) {
        switch (element.tagName) {
            case "DIV":
                this.divElement?.remove();
                break;
            case "IMG":
                this.imageElement?.remove();
                break;
            default:
                break;
        }
    }
}
class Board {
    blocks;
    container;
    openedBlocks;
    constructor(size) {
        this.container = document.querySelector(".container");
        this.blocks = [];
        const addedFields = {};
        for (let i = 0; i < size; i++) {
            // row
            this.blocks[i] = [];
            for (let j = 0; j < size; j++) {
                const field = fields[0];
                this.blocks[i][j] = new Block("block", 100, 100, field.concat(".png"));
                if (addedFields[field] == 1) {
                    console.log(addedFields[field]);
                    addedFields[field] = addedFields[field] + 1;
                    fields.shift();
                }
                else {
                    addedFields[field] = 1;
                }
            }
        }
        this.openedBlocks = [];
    }
    draw() {
        for (let i = 0; i < this.blocks.length; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < this.blocks.length; j++) {
                const div = document.createElement("div");
                const block = this.blocks[i][j];
                const attributes = block.getAttributes();
                div.style.width = attributes.width.toString().concat("px");
                div.style.height = attributes.height.toString().concat("px");
                div.classList.add("block");
                div.style.backgroundColor = "black";
                block.setElement(div);
                const openBlockFunction = () => this.open(block);
                div.addEventListener("click", openBlockFunction);
                block.setOpenFunction(openBlockFunction);
                row?.appendChild(div);
            }
            this.container.appendChild(row);
        }
    }
    open(block) {
        if (this.openedBlocks.length === 2) {
            return;
        }
        const img = document.createElement("img");
        const attributes = block.getAttributes();
        img.src = "images/" + attributes.image;
        img.width = attributes.width;
        img.height = attributes.height;
        block.setElement(img);
        block.getElement("DIV").appendChild(img);
        this.openedBlocks.push(block);
        if (this.openedBlocks.length === 2) {
            let match = this.openedBlocks[0].getAttributes().image ===
                this.openedBlocks[1].getAttributes().image;
            setTimeout(() => {
                this.handleOpenedBlocks(match);
            }, 2000);
        }
    }
    handleOpenedBlocks(match) {
        this.openedBlocks.forEach((block) => {
            //console.log(block.getElement("DIV"));
            //console.log(block.getElement("IMG"));
            console.log(block);
            if (match) {
                //block.deleteElement(block.getElement("IMG")!);
                //block.deleteElement(block.getElement("DIV")!);
                block
                    .getElement("DIV")
                    ?.removeEventListener("click", block.getOpenFunction());
            }
            else {
                block.getElement("DIV")?.removeChild(block.getElement("IMG"));
            }
            this.openedBlocks = [];
        });
        console.log("should remove the blocks");
    }
}
const gameBoard = new Board(4);
gameBoard.draw();
