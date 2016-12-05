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
    private engines: Array<CANNON.Body>;

	constructor (state: DroneState) {
		this.state = state;
		this.configureActions();
        this.setupSimulation();
	}

    private setupSimulation() {
        // Setup our world
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0); // m/s²
        this.world.solver.tolerance = 0.000000001;

        // Create a drone shape
        this.drone = new CANNON.Body({
            mass: 5, // kg
            position: new CANNON.Vec3(0, 0.1, 0), // m
            shape: new CANNON.Box(new CANNON.Vec3(0.5,0.25,0.5))
        });
        this.world.addBody(this.drone);

        // Create engines.
        this.engines = [
            this.createEngine(-0.5, 0, -0.5),
            this.createEngine(0.5, 0, -0.5),
            this.createEngine(0.5, 0, 0.5),
            this.createEngine(-0.5, 0, 0.5)
        ];

        // Ground plane
        let plane = new CANNON.Plane();
        let groundBody = new CANNON.Body({ 
            mass: 0,
            position: new CANNON.Vec3(0, -0.3, 0)
        });
        groundBody.addShape(plane);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
        this.world.add(groundBody);

        // Start the simulation loop
        this.lastTime = Date.now();
        this.simulationLoop();
    }
    
    private createEngine(x: number, y: number, z: number): CANNON.Body {
        let shape = new CANNON.Sphere(0.1);
        let jointBody: CANNON.Body = new CANNON.Body({ 
            mass: 1
        });
        jointBody.addShape(shape);
        jointBody.collisionFilterGroup = 0;
        jointBody.collisionFilterMask = 0;
        jointBody.position.set(x,y,z);
        this.world.add(jointBody);

        // The cannon body constrained by the mouse joint
        let constrainedBody: CANNON.Body = this.drone;

        // Vector to the engine point, relative to the body
        let v1 = new CANNON.Vec3(x,y,z).vsub(constrainedBody.position);

        // Apply anti-quaternion to vector to tranform it into the local body coordinate system
        let antiRot = constrainedBody.quaternion.inverse();
        let pivot = antiRot.vmult(v1); // pivot is not in local body coordinates

        // Create a new constraint
        // The pivot for the jointBody is zero
        let engineConstraint = new CANNON.LockConstraint(constrainedBody, jointBody);

        // Add the constriant to world
        this.world.addConstraint(engineConstraint);
        return jointBody;
    }

    private simulationLoop() {
        let time = Date.now();
        let dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
        console.log(this.drone.position);

        this.state.simulation.position.setValue(this.drone.position);
        this.state.simulation.orientation.setValue(this.drone.quaternion);

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
                let localPoint: CANNON.Vec3 = new CANNON.Vec3(0,0,0);
                let forceFactor = 100;
                let torqueFactor = 100;

                this.engines[0].applyLocalForce(new CANNON.Vec3(-enginesState.rlEngine.throttle*torqueFactor, enginesState.rlEngine.throttle*forceFactor, 0), localPoint);
                this.engines[1].applyLocalForce(new CANNON.Vec3(enginesState.rrEngine.throttle*torqueFactor, enginesState.rrEngine.throttle*forceFactor, 0), localPoint);
                this.engines[2].applyLocalForce(new CANNON.Vec3(enginesState.frEngine.throttle*torqueFactor, enginesState.frEngine.throttle*forceFactor, 0), localPoint);
                this.engines[3].applyLocalForce(new CANNON.Vec3(-enginesState.flEngine.throttle*torqueFactor, enginesState.flEngine.throttle*forceFactor, 0), localPoint);
            });
	}
}