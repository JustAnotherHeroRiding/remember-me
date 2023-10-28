import { fields } from "./possibleImages.js";
class ElementCreator {
    name;
    width;
    height;
    image;
    className;
    style;
    constructor(name, width, height, image, style, className) {
        this.name = name;
        this.width = width;
        this.height = height;
        if (image) {
            this.image = image;
        }
        if (style) {
            this.style = style;
        }
        if (className) {
            this.className = className;
        }
    }
    createDiv() {
        const div = document.createElement("div");
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        if (this.className) {
            div.classList.add(this.className ? this.className : "");
        }
        if (this.style) {
            Object.assign(div.style, this.style);
        }
        return div;
    }
    createImg() {
        const img = document.createElement("img");
        img.src = this.image ? this.image : "";
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        if (this.className) {
            img.classList.add(this.className ? this.className : "");
        }
        if (this.style) {
            Object.assign(img.style, this.style);
        }
        return img;
    }
    createElement() {
        switch (this.name.toUpperCase()) {
            case "DIV":
                return this.createDiv();
            case "IMG":
                return this.createImg();
        }
    }
}
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
        const addedFields = {};
        let flatBlocks = [];
        for (let i = 0; i < size * size; i++) {
            const field = fields[0];
            flatBlocks.push(new Block("block", 100, 100, field.concat(".png")));
            if (addedFields[field] == 1) {
                addedFields[field] = addedFields[field] + 1;
                fields.shift();
            }
            else {
                addedFields[field] = 1;
            }
        }
        flatBlocks = this.shuffle(flatBlocks);
        this.blocks = [];
        for (let i = 0; i < size; i++) {
            this.blocks[i] = [];
            for (let j = 0; j < size; j++) {
                this.blocks[i][j] = flatBlocks[i * size + j];
            }
        }
        this.openedBlocks = [];
    }
    shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }
        return array;
    }
    draw() {
        for (let i = 0; i < this.blocks.length; i++) {
            const row = document.createElement("div");
            row.classList.add("row");
            for (let j = 0; j < this.blocks.length; j++) {
                // TODO here we need to create a element creator class
                // to create the will be appended and set in the block
                //const div = document.createElement("div");
                const block = this.blocks[i][j];
                const attributes = block.getAttributes();
                const div = new ElementCreator("div", attributes.width.toString(), attributes.height.toString(), undefined, { backgroundColor: "black" }, // Style property
                "block").createElement();
                //div.style.width = attributes.width.toString().concat("px");
                //div.style.height = attributes.height.toString().concat("px");
                //div.classList.add("block");
                //div.style.backgroundColor = "black";
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
        // TODO Here we can create the image using the elementCreator again
        const attributes = block.getAttributes();
        const img = new ElementCreator("img", attributes.width.toString(), attributes.height.toString(), `images/${attributes.image}`).createElement();
        block.setElement(img);
        const div = block.getElement("DIV");
        const animationEndCallback = () => {
            div.appendChild(img);
            div.classList.remove("flip");
            div.removeEventListener("animationend", animationEndCallback);
        };
        div.classList.add("flip");
        div.addEventListener("animationend", animationEndCallback);
        this.openedBlocks.push(block);
        if (this.openedBlocks.length === 2) {
            let match = this.openedBlocks[0].getAttributes().image ===
                this.openedBlocks[1].getAttributes().image;
            setTimeout(() => {
                this.handleOpenPair(match);
            }, 2000);
        }
    }
    handleOpenPair(match) {
        this.openedBlocks.forEach((block) => {
            //console.log(block.getElement("DIV"));
            //console.log(block.getElement("IMG"));
            if (match) {
                /* Uncomment these lines to remove the 2 matching divs */
                /* let element = block.getElement("DIV");
                block.deleteElement(block.getElement("IMG")!);
                if (element) {
                  element.style.backgroundColor = "white";
                } */
                block
                    .getElement("DIV")
                    ?.removeEventListener("click", block.getOpenFunction());
            }
            else {
                block.deleteElement(block.getElement("IMG"));
            }
            this.openedBlocks = [];
        });
        const allBlocksOpen = this.blocks.every((row) => row.every((block) => block.getElement("IMG") !== undefined));
        if (allBlocksOpen) {
            this.gameOver(true);
        }
    }
    gameOver(victory) {
        if (victory) {
            console.log("You Won");
        }
        else {
            console.log("You Lost");
        }
    }
}
const gameBoard = new Board(4);
gameBoard.draw();
