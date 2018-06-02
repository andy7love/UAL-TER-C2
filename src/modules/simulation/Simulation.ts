import { DroneState } from '../../states/DroneState';
import { IDroneModule } from '../../interfaces/Module';
import * as CANNON from 'cannon';

export class Simulation implements IDroneModule {
	public name: string = 'Simulation';
	private enabled: boolean = false;
	private state: DroneState;
	private lastTime: number;
	private fixedTimeStep = 1.0 / 60.0; // seconds
	private maxSubSteps = 3;
	private world: CANNON.World;
	private drone: CANNON.Body;
	private engines: Array<CANNON.Body>;
	private disposers: Array<any> = [];

	public setState(state: DroneState) {
		this.state = state;
	}

	public enable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.enabled = true;
			this.configureActions();
			this.setupSimulation();
			resolve();
		});
	}

	public disable(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			this.enabled = false;
			this.disposers.forEach(dispose => {
				dispose();
			});
			resolve();
		});
	}

	private setupSimulation() {
		// Setup our world
		this.world = new CANNON.World();
		this.world.gravity.set(0, -9.82, 0); // m/s²
		// this.world.solver.tolerance = 0.000000001;

		// Create a drone body with the drone shape
		this.drone = new CANNON.Body({
			mass: 5, // kg
			position: new CANNON.Vec3(0, 0.1, 0) // m
		});
		this.drone.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 0.5)));
		this.world.addBody(this.drone);

		// Create engines.
		this.engines = [
			this.createEngine(-0.5, 0, -0.5),
			this.createEngine(0.5, 0, -0.5),
			this.createEngine(0.5, 0, 0.5),
			this.createEngine(-0.5, 0, 0.5)
		];

		// Ground plane
		const plane = new CANNON.Plane();
		const groundBody = new CANNON.Body({
			mass: 0,
			position: new CANNON.Vec3(0, -0.3, 0)
		});
		groundBody.addShape(plane);
		groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
		this.world.addBody(groundBody);

		// Start the simulation loop
		this.lastTime = Date.now();
		this.simulationLoop();
	}

	private createEngine(x: number, y: number, z: number): CANNON.Body {
		const shape = new CANNON.Sphere(0.1);
		const jointBody: CANNON.Body = new CANNON.Body({
			mass: 1
		});
		jointBody.addShape(shape);
		jointBody.collisionFilterGroup = 0;
		jointBody.collisionFilterMask = 0;
		jointBody.position.set(x, y, z);
		this.world.addBody(jointBody);

		// The CANNON body constrained by the mouse joint
		const constrainedBody: CANNON.Body = this.drone;

		// Vector to the engine point, relative to the body
		const v1 = new CANNON.Vec3(x, y, z).vsub(constrainedBody.position);

		// Apply anti-quaternion to vector to tranform it into the local body coordinate system
		const antiRot = constrainedBody.quaternion.inverse();
		const pivot = antiRot.vmult(v1); // pivot is not in local body coordinates

		// Create a new constraint
		// The pivot for the jointBody is zero
		const engineConstraint = new CANNON.LockConstraint(constrainedBody, jointBody);

		// Add the constriant to world
		this.world.addConstraint(engineConstraint);
		return jointBody;
	}

	private simulationLoop() {
		const time = Date.now();
		const dt = (time - this.lastTime) / 1000;
		this.lastTime = time;

		this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);

		// Apply joystick and "air" parameters to fake motors.
		const enginesState = this.state.target.engines.getValue();

		const localPoint: CANNON.Vec3 = new CANNON.Vec3(0, 0, 0);
		const airPressureFactor = this.drone.position.y * -0.01 + 1;
		const forceFactor = 55 * airPressureFactor;
		const torqueFactor = forceFactor;

		const forces = [
			new CANNON.Vec3(-enginesState.bl.throttle * torqueFactor, enginesState.bl.throttle * forceFactor, 0),
			new CANNON.Vec3(enginesState.br.throttle * torqueFactor, enginesState.br.throttle * forceFactor, 0),
			new CANNON.Vec3(enginesState.fr.throttle * torqueFactor, enginesState.fr.throttle * forceFactor, 0),
			new CANNON.Vec3(-enginesState.fl.throttle * torqueFactor, enginesState.fl.throttle * forceFactor, 0)
		];

		this.engines.map((engine, index) => {
			engine.applyLocalForce(forces[index], localPoint);
		});

		// Set result position and orientation.
		this.state.simulation.position.setValue(this.drone.position);
		this.state.simulation.orientation.setValue(this.drone.quaternion);

		setTimeout(() => {
			if (this.enabled) {
				this.simulationLoop();
			}
		}, 30);
	}

	private configureActions() {
		// nothing yet...
	}
}
