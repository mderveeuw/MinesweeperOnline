/**
 * MinesweeperOnline
 * Michiel Derveeuw
 */
class Field {
    constructor(width, height, mines) {
        this.width = width;
        this.height = height;
        this.mines = mines;
        // Public data that can be sent to client
        this.public = {
            // Array keeps track of visible tiles
            // -2 means tile is marked as a possible mine
            // -1 means tile is marked as a mine
            // 0 means tile is not visible
            // 1 means tile is visible
            visible: [],
            count: []
        };
        for (let i = 0; i < this.width; i++) {
            let row = [];
            for (let j = 0; j < this.height; j++) {
                row.push(0);
            }
            this.public.visible.push(row);
        }
        for (let i = 0; i < this.width; i++) {
            let row = [];
            for (let j = 0; j < this.height; j++) {
                row.push(-1);
            }
            this.public.count.push(row);
        }
        // Array that keeps track of the amount of mines surrounding a tile
        // 0 means that there are no mines surrounding the tile
        // 1-8 means that there are 1-8 mines surrounding the tile
        // 9 means the tile has a mine
        this.count = [];
        for (let i = 0; i < this.width; i++) {
            let row = [];
            for (let j = 0; j < this.height; j++) {
                row.push(0);
            }
            this.count.push(row);
        }
        // Generate all coords, shuffle and then pick first "mines" amount
        // to put random mines in the field
        let coords = [];
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                coords.push([i, j]);
            }
        }
        // Fisher-Yates Shuffle
        // see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let currentIndex = coords.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = coords[currentIndex];
            coords[currentIndex] = coords[randomIndex];
            coords[randomIndex] = temporaryValue;
        }
        for (let i = 0; i < this.mines; i++) {
            let coord = coords[i];
            this.count[coord[0]][coord[1]] = 9;
        }
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.count[i][j] !==9) {
                    let count = 0;
                    for (let k = -1; k < 2; k++) {
                        for (let l = -1; l < 2; l++) {
                            if (0 <= i + k && i + k < this.width && 0 <= j + l && j + l < this.height) {
                                if (this.count[i + k][j + l] === 9) {
                                    count++;
                                }
                            }
                        }
                    }
                    this.count[i][j] = count;
                }
            }
        }
    }

    show (x, y) {
        if (Math.abs(this.public.visible[x][y]) === 1) {
            return;
        }

        if (this.count[x][y] > 0) {
            this.public.visible[x][y] = 1;
            this.public.count[x][y] = this.count[x][y];
        } else {
            let queue = [[x, y]];
            let coord;
            while (queue.length > 0) {
                coord = queue.shift();
                if (this.public.visible[coord[0]][coord[1]] === 0) {
                    this.public.visible[coord[0]][coord[1]] = 1;
                    this.public.count[coord[0]][coord[1]] = this.count[coord[0]][coord[1]];
                    if (this.count[coord[0]][coord[1]] === 0) {
                        for (let i = -1; i < 2; i++) {
                            for (let j = -1; j < 2; j++) {
                                if (coord[0] + i >= 0 && coord[1] + j >= 0
                                    && coord[0] + i < this.width && coord[1] + j < this.height) {
                                    if (this.public.visible[coord[0] + i][coord[1] + j] === 0
                                        && queue.filter(function (obj) {
                                            return obj[0] === coord[0] + i && obj[1] === coord[1] + j}).length === 0) {
                                        queue.push([coord[0] + i, coord[1] + j]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    mark (x, y) {
        if (this.public.visible[x][y] === 1) {
            return;
        }

        if (this.public.visible[x][y] === -2) {
            this.public.visible[x][y] = 0;
        } else {
            this.public.visible[x][y]--;
        }
    };

    clear (x, y) {
        if (this.public.visible[x][y] !== 1) {
            return;
        }

        if (this.count[x][y] > 0) {
            let satisfied = false;
            let count = 0;
            let i = -1;
            while (!satisfied && i < 2) {
                let j = -1;
                while (!satisfied && j < 2) {
                    if (x + i >= 0 && y + j >= 0 && x + i < this.width && y + j < this.height) {
                        if (this.public.visible[x + i][y + j] === -1) {
                            count++;
                            satisfied = count === this.count[x][y];
                        }
                    }
                    j++;
                }
                i++;
            }
            if (satisfied) {
                for (let k = -1; k < 2; k++) {
                    for (let l = -1; l < 2; l++) {
                        if (x + k >= 0 && y + l >= 0 && x + k < this.width && y + l < this.height) {
                            this.show(x + k, y + l);
                        }
                    }
                }
            }
        }
    };

    checkLose () {
        let i = 0;
        let j = 0;
        while (i < this.width && this.public.count[i][j] !== 9) {
            j = 0;
            while (j < this.height && this.public.count[i][j] !== 9) {
                j++;
            }
            if (this.public.count[i][j] !== 9) {
                i++;
            }
        }
        return i !== this.width;
    }


    checkWin () {
        let win = true;
        let i = 0;
        let j = 0;
        while (i < this.width && win) {
            j = 0;
            while (j < this.height && win) {
                win = !(this.public.visible[i][j] === 0
                || (this.public.visible[i][j] === -1 && this.count[i][j] !== 9)
                || (this.public.visible[i][j] !== -1 && this.count[i][j] === 9));
                j++;
            }
            i++;
        }
        return win;
    }
}

module.exports = Field;