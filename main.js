var fields = ['dolphin', 'lion', 'panda', 'parrot', 'monkey', 'giraffe', 'penguin', 'rabbit'];
var Block = /** @class */ (function () {
    function Block(name, width, height, image) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.image = image;
    }
    Block.prototype.getAttributes = function () {
        return {
            name: this.name,
            width: this.width,
            height: this.height,
            image: this.image
        };
    };
    Block.prototype.setImageElement = function (imageElement) {
        this.imageElement = imageElement;
    };
    Block.prototype.setDivElement = function (divElement) {
        this.divElement = divElement;
    };
    Block.prototype.getDivElement = function () {
        return this.divElement;
    };
    Block.prototype.getImgElement = function () {
        return this.imageElement;
    };
    return Block;
}());
var Board = /** @class */ (function () {
    function Board(size) {
        this.container = document.querySelector('.container');
        this.blocks = [];
        var addedFields = {};
        for (var i = 0; i < size; i++) {
            // row
            this.blocks[i] = [];
            for (var j = 0; j < size; j++) {
                var field = fields[0];
                this.blocks[i][j] = new Block('block', 100, 100, field.concat('.png'));
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
    Board.prototype.draw = function () {
        var _this = this;
        for (var i = 0; i < this.blocks.length; i++) {
            var row = document.createElement('div');
            row.classList.add('row');
            var _loop_1 = function (j) {
                var div = document.createElement('div');
                var block = this_1.blocks[i][j];
                var attributes = block.getAttributes();
                div.style.width = attributes.width.toString().concat("px");
                div.style.height = attributes.height.toString().concat("px");
                div.classList.add('block');
                div.style.backgroundColor = 'black';
                block.setDivElement(div);
                div.addEventListener('click', function () { return _this.open(block); });
                row === null || row === void 0 ? void 0 : row.appendChild(div);
            };
            var this_1 = this;
            for (var j = 0; j < this.blocks.length; j++) {
                _loop_1(j);
            }
            this.container.appendChild(row);
        }
    };
    Board.prototype.open = function (block) {
        var _this = this;
        if (this.openedBlocks.length === 2) {
            return;
        }
        var img = document.createElement('img');
        var attributes = block.getAttributes();
        img.src = 'images/' + attributes.image;
        img.width = attributes.width;
        img.height = attributes.height;
        block.setImageElement(img);
        block.getDivElement().appendChild(img);
        this.openedBlocks.push(block);
        if (this.openedBlocks.length === 2) {
            setTimeout(function () {
                _this.openedBlocks.forEach(function (block) {
                    var _a;
                    console.log(block.getDivElement());
                    console.log(block.getImgElement());
                    (_a = block.getDivElement()) === null || _a === void 0 ? void 0 : _a.removeChild(block.getImgElement());
                    _this.openedBlocks = [];
                });
                console.log('should remove the blocks');
            }, 2000);
        }
    };
    return Board;
}());
var gameBoard = new Board(4);
gameBoard.draw();
