import { fields } from "./possibleImages.js";
class Block {
    name;
    width;
    height;
    image;
    imageElement;
    divElement;
    constructor(name, width, height, image) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.image = image;
    }
    getAttributes() {
        return {
            name: this.name,
            width: this.width,
            height: this.height,
            image: this.image,
        };
    }
    setImageElement(imageElement) {
        this.imageElement = imageElement;
    }
    setDivElement(divElement) {
        this.divElement = divElement;
    }
    getDivElement() {
        return this.divElement;
    }
    getImgElement() {
        return this.imageElement;
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
                block.setDivElement(div);
                div.addEventListener("click", () => this.open(block));
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
        block.setImageElement(img);
        block.getDivElement().appendChild(img);
        this.openedBlocks.push(block);
        if (this.openedBlocks.length === 2) {
            setTimeout(() => {
                this.openedBlocks.forEach((block) => {
                    console.log(block.getDivElement());
                    console.log(block.getImgElement());
                    block.getDivElement()?.removeChild(block.getImgElement());
                    this.openedBlocks = [];
                });
                console.log("should remove the blocks");
            }, 2000);
        }
    }
}
const gameBoard = new Board(4);
gameBoard.draw();
