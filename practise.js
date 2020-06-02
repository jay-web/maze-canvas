// const {World, Engine, Runner, Render, Bodies,MouseConstraint, Mouse } = Matter;


// const engine = Engine.create();
// const { world } = engine;


// // Create render

// const width = document.documentElement.clientWidth;
// const height = document.documentElement.clientHeight;


// const render = Render.create({
    
//     element: document.body,
//     engine: engine,
//     options: {
//         wireframes: false,
//         width: (width),
//         height: (height),
//         // showAngleIndicator: true,
//     }, 
    
// });

// Render.run(render);

// // create runner

// const runner = Runner.create();
// Runner.run(runner, engine);

// // create wall

// const circleRadius = width/20;

// const walls = [
//     Bodies.rectangle(width/2, 0, width, 20, {isStatic: true}),
//     Bodies.rectangle(width/2, height, width, 20, { isStatic: true}),
//     Bodies.rectangle(0, height/2, 20, height, {isStatic: true}),
//     Bodies.rectangle(width, height/2, 20, height, {isStatic: true})

// ];

// World.add(world, walls);

// // create circle

// for(var i=0; i< circleRadius/7; i++){
//     if(Math.random() < 0.3){
//         World.add(world, Bodies.circle(
//             Math.random() * width, 
//             Math.random() * height, 
//             circleRadius,
//             {
//                 render:{
//                     fillStyle: 'blue',
//                     text: {
//                         content: "jay",
//                         color: "black",
//                         size: 16,
//                         family:"Papyrus",
//                     }
//                 },
//                 restitution:0.95,
// 	            friction:0.05,
// 	            density:0.0005,
//             }
//             ));
//     }else{
//         World.add(world, Bodies.circle(
//             Math.random() * width, 
//             Math.random() * height, 
//             circleRadius,
//             {
//                 render:{
//                     fillStyle: 'green',
//                     text: {
//                         content: "Test",
//                         color: "white",
//                         size: 16,
//                         family:"Papyrus",
//                     },
                    
//                 },
//                 restitution:0.95,
// 	friction:0.05,
// 	density:0.0005,
//             }
            
//             ));
//         }
// }

// // Create mouse

// World.add(world, 
//     MouseConstraint.create(engine, {
//         mouse: Mouse.create(render.canvas),
//         constraint: {
//             stiffness: 0.9,
//             render:{
//                 visible:false
//             }
//         }
//     }));