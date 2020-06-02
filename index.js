const { World, Engine, Runner, Render, Bodies, Body, Events } = Matter;


const engine = Engine.create();

// disable the gravity

engine.world.gravity.y = 0;
const { world } = engine;


// Create render

const width = window.innerWidth;
const height = window.innerHeight;
const cellsHorizontal = 5;
const cellsVertical = 3;

const unitWidth = width / cellsHorizontal;
const unitLength = height / cellsVertical;



const render = Render.create({

    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: (width),
        height: (height),
        // showAngleIndicator: true,
    },

});

Render.run(render);

// create runner

const runner = Runner.create();
Runner.run(runner, engine);

// create wall
const walls = [
    Bodies.rectangle(width / 2, 0, width, 3, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 3, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 3, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 3, height, { isStatic: true })

];

World.add(world, walls);

// Create the grid Array to store blocks

const grid = Array(cellsVertical)
                .fill(null)
                .map(() => Array(cellsHorizontal).fill(false));


// create the vertical array to store vertical lines(walls of blocks)

const verticals = Array(cellsVertical)
                    .fill(null)
                    .map(() => Array(cellsHorizontal - 1).fill(false));
 
// create the horizontal array to store horizontal lines(walls of blocks) 

const horizontals = Array(cellsVertical - 1)
                    .fill(null)
                    .map(() => Array(cellsHorizontal).fill(false));


// create the starting point

const startRow = Math.floor(Math.random() * cellsVertical);
const startCol = Math.floor(Math.random() * cellsHorizontal);

// ? Interaction between startRow and startCol, will be the starting point


// Neighbour order shuffling 

const shuffle = (arr) => {
    let counter = arr.length;

    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        // ! swap the index
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }

    return arr;
};


// Main game function
const playGame = (row, column) => {
    // * If we have visited the cell at [ row, column], then return
        if(grid[row][column]){
            return;
        }

    // * Mark this cell as visited
        grid[row][column] = true;

    // * Assemble, randomly ordered list of neighbors

    const neighbors = shuffle([
        [row - 1, column, "up"],
        [row, column + 1, "right" ],
        [row + 1, column, "down"],
        [row, column - 1, "left"]
    ]);

    // console.log("neigbour", neighbors);
    // * For each neighbor...

        for( let nb of neighbors) {
            const [ nextRow, nextCol, direction] = nb;
            // * See if the neighbor is out of bounds
            if(nextRow < 0 || nextRow >= cellsVertical || nextCol < 0 || nextCol >= cellsHorizontal){
                continue;
            }
            // * If we have visited that neighbor , continue to next neighbor
            if( grid[nextRow][nextCol]){
                continue;
            }
            
            // * Remove a wall either horizontal or vertical

            if(direction == "left"){
                verticals[row][column -1 ] = true;
            }else if(direction == "right"){
                verticals[row][column] = true;
            }else if(direction == "up"){
                horizontals[row - 1][column] = true;
            }else if(direction == "down"){
                horizontals[row][column] = true;
            }

            playGame(nextRow, nextCol);
        }
        
        // ! visit the next cell

        // console.log("game started", row, column);
        
        
}

// call the main function
playGame(startRow, startCol);


// iterate over horizontals and create wall on canvas
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open){
            return;     // if wall is open, means no wall, so return
        }else{
            const wall = Bodies.rectangle(
                columnIndex * unitWidth + unitWidth/2,            // x axis
                rowIndex * unitLength + unitLength,                 // y axis
                unitWidth,
                3,
                {   label: "wall",
                    isStatic: true,
                    render: {
                        fillStyle: "red"
                    }
                }
            );
            World.add(world, wall);
        }
    });
});

// iterate over verticals and create wall on canvas

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open){
            return;
        }else{
            const wall = Bodies.rectangle(
                columnIndex * unitWidth + unitWidth,  // x axis
                rowIndex * unitLength + unitLength/2,           // y axis
                5,
                unitLength,
                {
                    isStatic: true,
                    label: "wall",
                    render: {
                        fillStyle: "red"
                    }
                }

            );
            World.add(world, wall);
        }
    });
})

// create the goal

const goal = Bodies.rectangle(
    width - unitWidth/2,
    height - unitLength/2,
    unitWidth * .7,
    unitLength * .7,
    {
        isStatic: true,
        label: "goal",
        render: {
            fillStyle: "green"
        }
    }

)

World.add(world, goal);

// create the ball
const ballRadius  = Math.min(unitWidth, unitLength) / 4;
const ball = Bodies.circle(
    unitWidth/2,
    unitLength/2,
    ballRadius,
    {
        isStatic: false,
        label:"ball",
        render: {
            fillStyle: "blue"
        }
    }
);

World.add(world, ball);

// Handling keypress

document.addEventListener("keydown", (event) => {
    const { x, y} = ball.velocity;

    console.log(x, y);
    if(event.keyCode == "104" || event.keyCode == "87"){
        Body.setVelocity(ball, { x, y: y - 5});
    }
    if(event.keyCode == "98" || event.keyCode == "83"){
        Body.setVelocity(ball, {x, y : y+ 5});
    }
    if(event.keyCode == "102" || event.keyCode == "68"){
        Body.setVelocity(ball, { x: x+5, y});
    }
    if(event.keyCode == "100" || event.keyCode == "65"){
        Body.setVelocity(ball, {x: x-5, y});
    }
});


// console.log("blocks", grid);

// console.log("verticals", verticals);

// console.log("horizontal", horizontals);

// check win condition

Events.on(engine, "collisionStart", (event) => {
    const labels = ["ball", "goal"];
    event.pairs.forEach((collision) => {
        if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)){
            document.querySelector("h1").classList.remove("hidden");
            document.querySelector("button").classList.remove("hidden");
            world.gravity.y = 1;
            world.bodies.forEach((body) => {
                if(body.label == "wall"){
                    Body.setStatic(body, false);
                }
            });
        }
    });
});


// restart again

document.querySelector("button").addEventListener("click", () => {
    window.location.reload();
});