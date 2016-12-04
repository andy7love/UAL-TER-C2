/// <reference path="../../typings/globals/cannon/index.d.ts" />
import { DroneState } from "../states/DroneState";
let CANNON = require('cannon');

export class Simulation {
	private state: DroneState;
    private lastTime: number;
    private fixedTimeStep = 1.0 / 60.0; // seconds
    private maxSubSteps = 3;
    private world: CANNON.World;
    private drone: CANNON.Body;

	constructor (state: DroneState) {
		this.state = state;
		this.configureActions();
        this.setupSimulation();
	}

    private setupSimulation() {
        // Setup our world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // m/s²
        this.world.solver.tolerance = 0.001;

        // Create a sphere
        let radius = 1; // m
        this.drone = new CANNON.Body({
            mass: 5, // kg
            position: new CANNON.Vec3(0, 10, 0), // m
            shape: new CANNON.Sphere(radius)
        });
        this.world.addBody(this.drone);

        // Ground plane
        let plane = new CANNON.Plane();
        let groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(plane);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        this.world.add(groundBody);

        // Start the simulation loop
        this.lastTime = Date.now();
        this.simulationLoop();
    }

    private simulationLoop() {
        let time = Date.now();
        let dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
        console.log(this.drone.position);

        this.state.simulation.position.setValue(this.drone.position);
        this.state.simulation.orientation.setValue(this.drone.orientation);

        setTimeout(() => {
            this.simulationLoop();
        }, 30);
    }

	private configureActions() {
		this.state.engines
            .getStream()
            .changes()
            .skipDuplicates()
            .onValue((enginesState) => {
                let throttle: number = enginesState.flEngine.throttle;
                let forceFactor = 100;
                let force:CANNON.Vec3 = new CANNON.Vec3(0, throttle*forceFactor, 0);
                let localPoint: CANNON.Vec3 = new CANNON.Vec3(0,0,0);
                this.drone.applyLocalForce(force, localPoint);
            });
	}
}