import { fields } from "./possibleImages.js";
class Animation {
  private gameoverMessage: HTMLHeadingElement;

  constructor(h2Element: HTMLHeadingElement) {
    this.gameoverMessage = h2Element;
  }
  showConfetti() {
    // Number of pieces of confetti to throw
    const confettiCount = 200;
    // Array to store the confetti
    const confettiArray: HTMLElement[] = [];

    // Create the confetti pieces and add them to the array
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.textContent = "🎉";
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 2 + 3}s`;
      confettiArray.push(confetti);
    }

    // Function to start the confetti animation
    const startConfetti = () => {
      if (this.gameoverMessage) {
        this.gameoverMessage.textContent = "You Won!";
      }
      confettiArray.forEach((confetti) => {
        document.body.appendChild(confetti);
      });
    };

    // Function to stop the confetti animation
    const stopConfetti = () => {
      confettiArray.forEach((confetti) => {
        confetti.remove();
      });
    };

    // Start the confetti animation
    startConfetti();

    // Stop the confetti animation after 5 seconds
    setTimeout(stopConfetti, 5000);
  }
}

enum ElementType {
  DIV = "div",
  IMG = "img"
}

class ImprovedElementCreator {

  static createElement(
      elementType: ElementType
  ) {
    return document.createElement(elementType);
  }

}

class BlockElement {

  private readonly name: string;
  private readonly width: number;
  private readonly height: number;
  private readonly figure: Figure;
  private readonly div: HTMLDivElement;
  private readonly onClick?: (block: BlockElement) => void;

  constructor(
      name: string,
      width: number,
      height: number,
      figure: Figure,
      onClick: (block: BlockElement) => void
  ) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.figure = figure;
    this.onClick = onClick;
    this.div = this.createBlock();
    const ref = this;
    this.div.addEventListener('click', this.click.bind(ref));
  }

  private createBlock(): HTMLDivElement {
    const divElement =
        ImprovedElementCreator.createElement(ElementType.DIV) as HTMLDivElement;
    divElement.style.width = `${this.width}px`;
    divElement.style.height = `${this.width}px`;
    divElement.classList.add("block");
    return divElement;
  }

  getDivElementRef() {
    return this.div;
  }

  click() {
    this.onClick && this.onClick(this);
  }

  open() {
    this.div.appendChild(this.figure.getImgElementRef());
  }

  reset() {
    this.div.removeChild(this.figure.getImgElementRef());
  }

}

class Figure {
  private readonly img: HTMLImageElement;

  constructor(link: string) {
    this.img = ImprovedElementCreator.createElement(ElementType.IMG) as HTMLImageElement;
    this.img.src = link;
    this.img.style.width = 'inherit';
    this.img.style.height = 'inherit';
  }

  getImgElementRef() {
    return this.img;
  }

}

class Board {
  private readonly blocks: BlockElement[][];
  private readonly container;
  private limit: number;
  private openedBlocks: BlockElement[];
  private boardSize: number;
  private size: number;

  constructor(size: number) {
    this.size = size;
    this.boardSize = size * size;
    this.container = document.querySelector(".container")!!;
    this.limit = 2;
    this.openedBlocks = [];
    this.blocks = [];

    const blocksArray = this.createBlockArray();
    for (let i = 0; i < size; i++) {
      this.blocks[i] = [];
      for (let j = 0; j < size; j++) {
        this.blocks[i][j] = blocksArray[i * size + j];
      }
    }
  }

  openBlock(block: BlockElement) {
    if (this.openedBlocks.length === this.limit) {
      this.openedBlocks.forEach((b) => b.reset());
      this.openedBlocks = [];
      return;
    }
    block.open();
    this.openedBlocks.push(block);
  }

  createBlockArray(): BlockElement[] {
    let blocksArray = [];
    const addedFields: { [key: string]: number } = {};
    for (let i = 0; i < this.boardSize; i++) {
      const field = fields[0];
      const link = `images/${field}.png`
      const figure = new Figure(link);
      const block =
          new BlockElement("block", 100, 100, figure, this.openBlock.bind(this));
      blocksArray.push(block);
      if (addedFields[field] == 1) {
        addedFields[field] = addedFields[field] + 1;
        fields.shift();
      } else {
        addedFields[field] = 1;
      }
    }
    return blocksArray;
  }

  shuffleBlocks(blocksArray: BlockElement[]) {
    let currentIndex = blocksArray.length,
        randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [blocksArray[currentIndex], blocksArray[randomIndex]] = [
        blocksArray[randomIndex],
        blocksArray[currentIndex],
      ];
    }
    return blocksArray;
  }

  draw() {
    for (let i = 0; i < this.blocks.length; i++) {
      const row = document.createElement("div");
      row.classList.add("row");
      for (let j = 0; j < this.blocks.length; j++) {
        const block = this.blocks[i][j].getDivElementRef();
        row?.appendChild(block);
      }
      this.container.appendChild(row);
    }
  }
}

const gameBoard = new Board(4);
gameBoard.draw();
