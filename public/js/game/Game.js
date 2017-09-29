/**
 * MinesweeperOnline
 * Michiel Derveeuw
 */
function Game(width, height, mines) {
    this.width = width;
    this.height = height;
    this.mines = mines;
    this.field = [];

    this.draw = function () {
        if (this.field.length !== 0) {
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    if (this.field.visible[i][j] === 1) {
                        if (this.field.count[i][j] > 0) {
                            switch(this.field.count[i][j]) {
                                case 1:
                                    fill(0, 0, 255);
                                    break;
                                case 2:
                                    fill(0, 128, 0);
                                    break;
                                case 3:
                                    fill(255, 0, 0);
                                    break;
                                case 4:
                                    fill(0, 0, 128);
                                    break;
                                case 5:
                                    fill(128, 0, 0);
                                    break;
                                case 6:
                                    fill(0, 128, 128);
                                    break;
                                case 7:
                                    fill(0, 0, 0);
                                    break;
                                case 8:
                                    fill(128, 128, 128);
                                    break;
                                default:
                                    fill(0);
                                    break;
                            }
                            text(this.field.count[i][j], i * 20, j * 20, 20, 20);
                        }
                    } else {
                        fill(220);
                        rect(i * 20, j * 20, 20, 20);
                        if (this.field.visible[i][j] < 0) {
                            if (this.field.visible[i][j] === -1) {
                                fill(255, 0, 0);
                            } else {
                                fill(255, 255, 0);
                            }
                            rect(i * 20 + 2, j * 20 + 2, 16, 16);
                        }
                    }
                }
            }
            let x = floor(map(mouseX, 0, 200, 0, this.width));
            let y = floor(map(mouseY, 0, 200, 0, this.height));
            if (mouseButtons[0] && !rightPressedLeftHold) {
                if (this.field.visible[x][y] === 0 || this.field.visible[x][y] === -2) {
                    fill(250);
                    rect(x * 20, y * 20, 20, 20);
                }
                if (this.field.visible[x][y] === -2) {
                    fill(255, 255, 0);
                    rect(x * 20 + 2, y * 20 + 2, 16, 16);
                }
            }
            if (leftRightHold) {
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (x + i >= 0 && y + j >= 0 && x + i < this.width && y + j < this.height) {
                            if (this.field.visible[x + i][y + j] === 0 || this.field.visible[x + i][y + j] === -2) {
                                fill(250);
                                rect((x + i) * 20, (y + j) * 20, 20, 20);
                            }
                            if (this.field.visible[x + i][y + j] === -2) {
                                fill(255, 255, 0);
                                rect((x + i) * 20 + 2, (y + j) * 20 + 2, 16, 16);
                            }
                        }
                    }
                }
            }
        }
    };
}