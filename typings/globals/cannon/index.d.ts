/** Declaration file generated by dts-gen */
declare namespace CANNON {
    export class AABB {
        constructor(options: any);
        clone(): any;
        contains(aabb: any): any;
        copy(aabb: any): any;
        extend(aabb: any): void;
        getCorners(a: any, b: any, c: any, d: any, e: any, f: any, g: any, h: any): void;
        overlaps(aabb: any): any;
        setFromPoints(points: any, position: any, quaternion: any, skinSize: any): any;
        toLocalFrame(frame: any, target: any): any;
        toWorldFrame(frame: any, target: any): any;
    }
    export class ArrayCollisionMatrix {
        constructor();
        get(i: any, j: any): any;
        reset(): void;
        set(i: any, j: any, value: any): void;
        setNumObjects(n: any): void;
    }
    export class Body {
        constructor(options: any);
        position: Vec3;
        quaternion: Quaternion;
        collisionFilterGroup: any;
        collisionFilterMask: any;
        addShape(shape: any, _offset?: any, _orientation?: any): any;
        applyForce(force: any, worldPoint: any): void;
        applyImpulse(impulse: any, worldPoint: any): void;
        applyLocalForce(localForce: any, localPoint: any): void;
        applyLocalImpulse(localImpulse: any, localPoint: any): void;
        computeAABB(): void;
        getVelocityAtWorldPoint(worldPoint: any, result: any): any;
        pointToLocalFrame(worldPoint: any, result: any): any;
        pointToWorldFrame(localPoint: any, result: any): any;
        sleep(): void;
        sleepTick(time: any): void;
        updateBoundingRadius(): void;
        updateInertiaWorld(force: any): void;
        updateMassProperties(): void;
        updateSolveMassProperties(): void;
        vectorToLocalFrame(worldVector: any, result: any): any;
        vectorToWorldFrame(localVector: any, result: any): any;
        wakeUp(): void;
        static AWAKE: number;
        static DYNAMIC: number;
        static KINEMATIC: number;
        static SLEEPING: number;
        static SLEEPY: number;
        static STATIC: number;
        static idCounter: number;
        static sleepEvent: {
            type: string;
        };
        static sleepyEvent: {
            type: string;
        };
    }
    export class Box {
        constructor(halfExtents: any);
        calculateLocalInertia(mass: any, target: any): any;
        calculateWorldAABB(pos: any, quat: any, min: any, max: any): void;
        forEachWorldCorner(pos: any, quat: any, callback: any): void;
        getSideNormals(sixTargetVectors: any, quat: any): any;
        updateBoundingSphereRadius(): void;
        updateConvexPolyhedronRepresentation(): void;
        volume(): any;
        static calculateInertia(halfExtents: any, mass: any, target: any): void;
    }
    export class Broadphase {
        constructor();
        aabbQuery(world: any, aabb: any, result: any): any;
        collisionPairs(world: any, p1: any, p2: any): void;
        doBoundingBoxBroadphase(bodyA: any, bodyB: any, pairs1: any, pairs2: any): void;
        doBoundingSphereBroadphase(bodyA: any, bodyB: any, pairs1: any, pairs2: any): void;
        intersectionTest(bodyA: any, bodyB: any, pairs1: any, pairs2: any): void;
        makePairsUnique(pairs1: any, pairs2: any): void;
        needBroadphaseCollision(bodyA: any, bodyB: any): any;
        setWorld(world: any): void;
        static boundingSphereCheck(bodyA: any, bodyB: any): any;
    }
    export class ConeTwistConstraint {
        constructor(bodyA: any, bodyB: any, options: any);
        update(): void;
    }
    export class Constraint {
        constructor(bodyA: any, bodyB: any, options: any);
        disable(): void;
        enable(): void;
        update(): void;
        static idCounter: number;
    }
    export class ContactEquation {
        constructor(bodyA: any, bodyB: any, maxForce: any);
        computeB(h: any): any;
        getImpactVelocityAlongNormal(): any;
    }
    export class ConvexPolyhedron {
        constructor(points: any, faces: any, uniqueAxes: any);
        calculateLocalInertia(mass: any, target: any): void;
        calculateWorldAABB(pos: any, quat: any, min: any, max: any): void;
        clipAgainstHull(posA: any, quatA: any, hullB: any, posB: any, quatB: any, separatingNormal: any, minDist: any, maxDist: any, result: any): void;
        clipFaceAgainstHull(separatingNormal: any, posA: any, quatA: any, worldVertsB1: any, minDist: any, maxDist: any, result: any): void;
        clipFaceAgainstPlane(inVertices: any, outVertices: any, planeNormal: any, planeConstant: any): any;
        computeEdges(): void;
        computeLocalAABB(aabbmin: any, aabbmax: any): void;
        computeNormals(): void;
        computeWorldFaceNormals(quat: any): void;
        computeWorldVertices(position: any, quat: any): void;
        findSeparatingAxis(hullB: any, posA: any, quatA: any, posB: any, quatB: any, target: any, faceListA: any, faceListB: any): any;
        getAveragePointLocal(target: any): any;
        getFaceNormal(i: any, target: any): any;
        getPlaneConstantOfFace(face_i: any): any;
        pointIsInside(p: any): any;
        testSepAxis(axis: any, hullB: any, posA: any, quatA: any, posB: any, quatB: any): any;
        transformAllPoints(offset: any, quat: any): void;
        updateBoundingSphereRadius(): void;
        volume(): any;
        static computeNormal(va: any, vb: any, vc: any, target: any): void;
        static project(hull: any, axis: any, pos: any, quat: any, result: any): void;
    }
    export class Cylinder {
        constructor(radiusTop: any, radiusBottom: any, height: any, numSegments: any);
    }
    export class DistanceConstraint {
        constructor(bodyA: any, bodyB: any, distance: any, maxForce: any);
        update(): void;
    }
    export class Equation {
        constructor(bi: any, bj: any, minForce: any, maxForce: any);
        addToWlambda(deltalambda: any): void;
        computeB(a: any, b: any, h: any): any;
        computeC(): any;
        computeGW(): any;
        computeGWlambda(): any;
        computeGiMGt(): any;
        computeGiMf(): any;
        computeGq(): any;
        setSpookParams(stiffness: any, relaxation: any, timeStep: any): void;
        static id: number;
    }
    export class EventTarget {
        constructor();
        addEventListener(type: any, listener: any): any;
        dispatchEvent(event: any): any;
        hasEventListener(type: any, listener: any): any;
        removeEventListener(type: any, listener: any): any;
    }
    export class FrictionEquation {
        constructor(bodyA: any, bodyB: any, slipForce: any);
        computeB(h: any): any;
    }
    export class GSSolver {
        constructor();
        solve(dt: any, world: any): any;
    }
    export class GridBroadphase {
        constructor(aabbMin: any, aabbMax: any, nx: any, ny: any, nz: any);
        collisionPairs(world: any, pairs1: any, pairs2: any): void;
    }
    export class Heightfield {
        constructor(data: any, options: any);
        calculateLocalInertia(mass: any, target: any): any;
        calculateWorldAABB(pos: any, quat: any, min: any, max: any): void;
        clearCachedConvexTrianglePillar(xi: any, yi: any, getUpperTriangle: any): void;
        getCacheConvexTrianglePillarKey(xi: any, yi: any, getUpperTriangle: any): any;
        getCachedConvexTrianglePillar(xi: any, yi: any, getUpperTriangle: any): any;
        getConvexTrianglePillar(xi: any, yi: any, getUpperTriangle: any): void;
        getHeightAt(x: any, y: any, edgeClamp: any): any;
        getIndexOfPosition(x: any, y: any, result: any, clamp: any): any;
        getRectMinMax(iMinX: any, iMinY: any, iMaxX: any, iMaxY: any, result: any): void;
        setCachedConvexTrianglePillar(xi: any, yi: any, getUpperTriangle: any, convex: any, offset: any): void;
        setHeightValueAtIndex(xi: any, yi: any, value: any): void;
        update(): void;
        updateBoundingSphereRadius(): void;
        updateMaxValue(): void;
        updateMinValue(): void;
        volume(): any;
    }
    export class HingeConstraint {
        constructor(bodyA: any, bodyB: any, options: any);
        disableMotor(): void;
        enableMotor(): void;
        setMotorMaxForce(maxForce: any): void;
        setMotorSpeed(speed: any): void;
        update(): void;
    }
    export class LockConstraint {
        constructor(bodyA: any, bodyB: any, options: any);
        update(): void;
    }
    export class Mat3 {
        constructor(elements: any);
        copy(source: any): any;
        e(row: any, column: any, value: any): any;
        getTrace(target: any): void;
        identity(): void;
        mmult(m: any, target: any): any;
        reverse(target: any): any;
        scale(v: any, target: any): any;
        setRotationFromQuaternion(q: any): any;
        setTrace(vec3: any): void;
        setZero(): void;
        smult(s: any): void;
        solve(b: any, target: any): any;
        toString(): any;
        transpose(target: any): any;
        vmult(v: any, target: any): any;
    }
    export class NaiveBroadphase {
        constructor();
        aabbQuery(world: any, aabb: any, result: any): any;
        collisionPairs(world: any, pairs1: any, pairs2: any): void;
    }
    export class Narrowphase {
        constructor(world: any);
        "1"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "16"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any, rsi: any, rsj: any, faceListA: any, faceListB: any): void;
        "17"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "18"(planeShape: any, convexShape: any, planePosition: any, convexPosition: any, planeQuat: any, convexQuat: any, planeBody: any, convexBody: any): void;
        "20"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "257"(sphereShape: any, trimeshShape: any, spherePos: any, trimeshPos: any, sphereQuat: any, trimeshQuat: any, sphereBody: any, trimeshBody: any): void;
        "258"(planeShape: any, trimeshShape: any, planePos: any, trimeshPos: any, planeQuat: any, trimeshQuat: any, planeBody: any, trimeshBody: any): void;
        "3"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "33"(sphereShape: any, hfShape: any, spherePos: any, hfPos: any, sphereQuat: any, hfQuat: any, sphereBody: any, hfBody: any): void;
        "36"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "4"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "48"(convexShape: any, hfShape: any, convexPos: any, hfPos: any, convexQuat: any, hfQuat: any, convexBody: any, hfBody: any): void;
        "5"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "6"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "65"(sj: any, si: any, xj: any, xi: any, qj: any, qi: any, bj: any, bi: any): void;
        "66"(sj: any, si: any, xj: any, xi: any, qj: any, qi: any, bj: any, bi: any): void;
        "68"(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        "80"(sj: any, si: any, xj: any, xi: any, qj: any, qi: any, bj: any, bi: any): void;
        boxBox(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        boxConvex(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        boxHeightfield(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        boxParticle(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        convexConvex(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any, rsi: any, rsj: any, faceListA: any, faceListB: any): void;
        convexHeightfield(convexShape: any, hfShape: any, convexPos: any, hfPos: any, convexQuat: any, hfQuat: any, convexBody: any, hfBody: any): void;
        convexParticle(sj: any, si: any, xj: any, xi: any, qj: any, qi: any, bj: any, bi: any): void;
        createContactEquation(bi: any, bj: any, si: any, sj: any, rsi: any, rsj: any): any;
        createFrictionEquationsFromContact(contactEquation: any, outArray: any): any;
        createFrictionFromAverage(numContacts: any): void;
        getContacts(p1: any, p2: any, world: any, result: any, oldcontacts: any, frictionResult: any, frictionPool: any): void;
        planeBox(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        planeConvex(planeShape: any, convexShape: any, planePosition: any, convexPosition: any, planeQuat: any, convexQuat: any, planeBody: any, convexBody: any): void;
        planeParticle(sj: any, si: any, xj: any, xi: any, qj: any, qi: any, bj: any, bi: any): void;
        planeTrimesh(planeShape: any, trimeshShape: any, planePos: any, trimeshPos: any, planeQuat: any, trimeshQuat: any, planeBody: any, trimeshBody: any): void;
        sphereBox(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        sphereConvex(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        sphereHeightfield(sphereShape: any, hfShape: any, spherePos: any, hfPos: any, sphereQuat: any, hfQuat: any, sphereBody: any, hfBody: any): void;
        sphereParticle(sj: any, si: any, xj: any, xi: any, qj: any, qi: any, bj: any, bi: any): void;
        spherePlane(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        sphereSphere(si: any, sj: any, xi: any, xj: any, qi: any, qj: any, bi: any, bj: any): void;
        sphereTrimesh(sphereShape: any, trimeshShape: any, spherePos: any, trimeshPos: any, sphereQuat: any, trimeshQuat: any, sphereBody: any, trimeshBody: any): void;
    }
    export class ObjectCollisionMatrix {
        constructor();
        get(i: any, j: any): any;
        reset(): void;
        set(i: any, j: any, value: any): void;
        setNumObjects(n: any): void;
    }
    export class Particle {
        constructor();
        calculateLocalInertia(mass: any, target: any): any;
        calculateWorldAABB(pos: any, quat: any, min: any, max: any): void;
        updateBoundingSphereRadius(): void;
        volume(): any;
    }
    export class Plane {
        constructor();
        calculateLocalInertia(mass: any, target: any): any;
        calculateWorldAABB(pos: any, quat: any, min: any, max: any): void;
        computeWorldNormal(quat: any): void;
        updateBoundingSphereRadius(): void;
        volume(): any;
    }
    export class PointToPointConstraint {
        constructor(bodyA: any, pivotA: any, bodyB: any, pivotB: any, maxForce: any);
        update(): void;
    }
    export class Pool {
        constructor();
        constructObject(): void;
        get(): any;
        release(...args: any[]): void;
    }
    export class Quaternion {
        constructor(x: any, y: any, z: any, w: any);
        clone(): any;
        conjugate(target: any): any;
        copy(source: any): any;
        inverse(target?: any): any;
        mult(q: any, target: any): any;
        normalize(): void;
        normalizeFast(): void;
        set(x: any, y: any, z: any, w: any): void;
        setFromAxisAngle(axis: any, angle: any): void;
        setFromEuler(x: any, y: any, z: any, order: any): any;
        setFromVectors(u: any, v: any): void;
        toArray(): any;
        toAxisAngle(targetAxis: any): any;
        toEuler(target: any, order: any): void;
        toString(): any;
        vmult(v: any, target: any): any;
    }
    export class Ray {
        constructor(from: any, to: any);
        "1"(shape: any, quat: any, position: any, body: any): void;
        "16"(shape: any, quat: any, position: any, body: any, options: any): void;
        "2"(shape: any, quat: any, position: any, body: any): void;
        "256"(mesh: any, quat: any, position: any, body: any, options: any): void;
        "32"(shape: any, quat: any, position: any, body: any): void;
        "4"(shape: any, quat: any, position: any, body: any): any;
        getAABB(result: any): void;
        intersectBodies(bodies: any, result: any): void;
        intersectBody(body: any, result: any): void;
        intersectBox(shape: any, quat: any, position: any, body: any): any;
        intersectConvex(shape: any, quat: any, position: any, body: any, options: any): void;
        intersectHeightfield(shape: any, quat: any, position: any, body: any): void;
        intersectPlane(shape: any, quat: any, position: any, body: any): void;
        intersectShape(shape: any, quat: any, position: any, body: any): void;
        intersectSphere(shape: any, quat: any, position: any, body: any): void;
        intersectTrimesh(mesh: any, quat: any, position: any, body: any, options: any): void;
        intersectWorld(world: any, options: any): any;
        reportIntersection(normal: any, hitPointWorld: any, shape: any, body: any, hitFaceIndex: any): void;
        static ALL: number;
        static ANY: number;
        static CLOSEST: number;
        static pointInTriangle(p: any, a: any, b: any, c: any): any;
    }
    export class RaycastResult {
        constructor();
        abort(): void;
        reset(): void;
        set(rayFromWorld: any, rayToWorld: any, hitNormalWorld: any, hitPointWorld: any, shape: any, body: any, distance: any): void;
    }
    export class RaycastVehicle {
        constructor(options: any);
        addToWorld(world: any): void;
        addWheel(options: any): any;
        applyEngineForce(value: any, wheelIndex: any): void;
        castRay(wheel: any): any;
        getVehicleAxisWorld(axisIndex: any, result: any): void;
        getWheelTransformWorld(wheelIndex: any): any;
        removeFromWorld(world: any): void;
        setBrake(brake: any, wheelIndex: any): void;
        setSteeringValue(value: any, wheelIndex: any): void;
        updateFriction(timeStep: any): void;
        updateSuspension(deltaTime: any): void;
        updateVehicle(timeStep: any): void;
        updateWheelTransform(wheelIndex: any): void;
        updateWheelTransformWorld(wheel: any): void;
    }
    export class RigidVehicle {
        constructor(options: any);
        addToWorld(world: any): void;
        addWheel(options: any): any;
        applyWheelForce(value: any, wheelIndex: any): void;
        disableMotor(wheelIndex: any): void;
        getWheelSpeed(wheelIndex: any): any;
        removeFromWorld(world: any): void;
        setMotorSpeed(value: any, wheelIndex: any): void;
        setSteeringValue(value: any, wheelIndex: any): void;
        setWheelForce(value: any, wheelIndex: any): void;
    }
    export class RotationalEquation {
        constructor(bodyA: any, bodyB: any, options: any);
        computeB(h: any): any;
    }
    export class RotationalMotorEquation {
        constructor(bodyA: any, bodyB: any, maxForce: any);
        computeB(h: any): any;
    }
    export class SAPBroadphase {
        constructor(world: any);
        aabbQuery(world: any, aabb: any, result: any): any;
        autoDetectAxis(): void;
        collisionPairs(world: any, p1: any, p2: any): void;
        setWorld(world: any): void;
        sortList(): void;
        static checkBounds(bi: any, bj: any, axisIndex: any): any;
        static insertionSortX(a: any): any;
        static insertionSortY(a: any): any;
        static insertionSortZ(a: any): any;
    }
    export class SPHSystem {
        constructor();
        add(particle: any): void;
        getNeighbors(particle: any, neighbors: any): void;
        gradw(rVec: any, resultVec: any): void;
        nablaw(r: any): any;
        remove(particle: any): void;
        update(): void;
        w(r: any): any;
    }
    export class Shape {
        constructor();
        calculateLocalInertia(mass: any, target: any): void;
        updateBoundingSphereRadius(): void;
        volume(): void;
        static idCounter: number;
        static types: {
            BOX: number;
            COMPOUND: number;
            CONVEXPOLYHEDRON: number;
            CYLINDER: number;
            HEIGHTFIELD: number;
            PARTICLE: number;
            PLANE: number;
            SPHERE: number;
            TRIMESH: number;
        };
    }
    export class Solver {
        constructor();
        addEquation(eq: any): void;
        removeAllEquations(): void;
        removeEquation(eq: any): void;
        solve(dt: any, world: any): any;
    }
    export class Sphere {
        constructor(radius: any);
        calculateLocalInertia(mass: any, target: any): any;
        calculateWorldAABB(pos: any, quat: any, min: any, max: any): void;
        updateBoundingSphereRadius(): void;
        volume(): any;
    }
    export class SplitSolver {
        constructor(subsolver: any);
        createNode(): any;
        solve(dt: any, world: any): any;
    }
    export class Spring {
        constructor(bodyA: any, bodyB: any, options: any);
        applyForce(): void;
        getWorldAnchorA(result: any): void;
        getWorldAnchorB(result: any): void;
        setWorldAnchorA(worldAnchorA: any): void;
        setWorldAnchorB(worldAnchorB: any): void;
    }
    export class Trimesh {
        constructor(vertices: any, indices: any);
        calculateLocalInertia(mass: any, target: any): any;
        calculateWorldAABB(pos: any, quat: any, min: any, max: any): void;
        computeLocalAABB(aabb: any): void;
        getEdgeVector(edgeIndex: any, vectorStore: any): void;
        getEdgeVertex(edgeIndex: any, firstOrSecond: any, vertexStore: any): void;
        getNormal(i: any, target: any): any;
        getTriangleVertices(i: any, a: any, b: any, c: any): void;
        getTrianglesInAABB(aabb: any, result: any): any;
        getVertex(i: any, out: any): any;
        getWorldVertex(i: any, pos: any, quat: any, out: any): any;
        setScale(scale: any): void;
        updateAABB(): void;
        updateBoundingSphereRadius(): void;
        updateEdges(): void;
        updateNormals(): void;
        updateTree(): void;
        volume(): any;
        static computeNormal(va: any, vb: any, vc: any, target: any): void;
        static createTorus(radius: any, tube: any, radialSegments: any, tubularSegments: any, arc: any): any;
    }
    export class Vec3 {
        constructor(x: any, y: any, z: any);
        x: number;
        y: number;
        z: number;
        almostEquals(v: any, precision: any): any;
        almostZero(precision: any): any;
        clone(): any;
        copy(source: any): any;
        cross(v: any, target: any): any;
        crossmat(): any;
        distanceSquared(p: any): any;
        distanceTo(p: any): any;
        dot(v: any): any;
        isAntiparallelTo(v: any, precision: any): any;
        isZero(): any;
        length(): any;
        lengthSquared(): any;
        lerp(v: any, t: any, target: any): void;
        mult(scalar: any, target: any): any;
        negate(target: any): any;
        norm(): any;
        norm2(): any;
        normalize(): any;
        scale(scalar: any, target: any): any;
        set(x: any, y: any, z: any): any;
        setZero(): void;
        tangents(t1: any, t2: any): void;
        toArray(): any;
        toString(): any;
        unit(target: any): any;
        vadd(v: any, target: any): any;
        vsub(v: any, target: any): any;
    }
    export class Vec3Pool {
        constructor();
        constructObject(): any;
        // Native method; no parameter or return type inference available
        type(p0: any): any;
    }
    export class World {
        constructor();
        gravity: any;
        solver: any;
        add(body: any): void;
        addBody(body: any): void;
        addConstraint(c: any): void;
        addContactMaterial(cmat: any): void;
        addMaterial(m: any): void;
        clearForces(): void;
        collisionMatrixTick(): void;
        getContactMaterial(m1: any, m2: any): any;
        internalStep(dt: any): void;
        numObjects(): any;
        rayTest(from: any, to: any, result: any): void;
        raycastAll(from: any, to: any, options: any, callback: any): any;
        raycastAny(from: any, to: any, options: any, result: any): any;
        raycastClosest(from: any, to: any, options: any, result: any): any;
        remove(body: any): void;
        removeBody(body: any): void;
        removeConstraint(c: any): void;
        step(dt: any, timeSinceLastCalled: any, maxSubSteps: any): void;
    }
    export const version: string;
    export function ContactMaterial(m1: any, m2: any, options: any): void;
    export function Material(options: any): void;
    export namespace ContactMaterial {
        const idCounter: number;
    }
    export namespace Material {
        const idCounter: number;
    }
    export namespace Vec3 {
        namespace UNIT_X {
            const x: number;
            const y: number;
            const z: number;
            function almostEquals(v: any, precision: any): any;
            function almostZero(precision: any): any;
            function clone(): any;
            function copy(source: any): any;
            function cross(v: any, target: any): any;
            function crossmat(): any;
            function distanceSquared(p: any): any;
            function distanceTo(p: any): any;
            function dot(v: any): any;
            function isAntiparallelTo(v: any, precision: any): any;
            function isZero(): any;
            function length(): any;
            function lengthSquared(): any;
            function lerp(v: any, t: any, target: any): void;
            function mult(scalar: any, target: any): any;
            function negate(target: any): any;
            function norm(): any;
            function norm2(): any;
            function normalize(): any;
            function scale(scalar: any, target: any): any;
            function set(x: any, y: any, z: any): any;
            function setZero(): void;
            function tangents(t1: any, t2: any): void;
            function toArray(): any;
            function toString(): any;
            function unit(target: any): any;
            function vadd(v: any, target: any): any;
            function vsub(v: any, target: any): any;
        }
        namespace UNIT_Y {
            const x: number;
            const y: number;
            const z: number;
            function almostEquals(v: any, precision: any): any;
            function almostZero(precision: any): any;
            function clone(): any;
            function copy(source: any): any;
            function cross(v: any, target: any): any;
            function crossmat(): any;
            function distanceSquared(p: any): any;
            function distanceTo(p: any): any;
            function dot(v: any): any;
            function isAntiparallelTo(v: any, precision: any): any;
            function isZero(): any;
            function length(): any;
            function lengthSquared(): any;
            function lerp(v: any, t: any, target: any): void;
            function mult(scalar: any, target: any): any;
            function negate(target: any): any;
            function norm(): any;
            function norm2(): any;
            function normalize(): any;
            function scale(scalar: any, target: any): any;
            function set(x: any, y: any, z: any): any;
            function setZero(): void;
            function tangents(t1: any, t2: any): void;
            function toArray(): any;
            function toString(): any;
            function unit(target: any): any;
            function vadd(v: any, target: any): any;
            function vsub(v: any, target: any): any;
        }
        namespace UNIT_Z {
            const x: number;
            const y: number;
            const z: number;
            function almostEquals(v: any, precision: any): any;
            function almostZero(precision: any): any;
            function clone(): any;
            function copy(source: any): any;
            function cross(v: any, target: any): any;
            function crossmat(): any;
            function distanceSquared(p: any): any;
            function distanceTo(p: any): any;
            function dot(v: any): any;
            function isAntiparallelTo(v: any, precision: any): any;
            function isZero(): any;
            function length(): any;
            function lengthSquared(): any;
            function lerp(v: any, t: any, target: any): void;
            function mult(scalar: any, target: any): any;
            function negate(target: any): any;
            function norm(): any;
            function norm2(): any;
            function normalize(): any;
            function scale(scalar: any, target: any): any;
            function set(x: any, y: any, z: any): any;
            function setZero(): void;
            function tangents(t1: any, t2: any): void;
            function toArray(): any;
            function toString(): any;
            function unit(target: any): any;
            function vadd(v: any, target: any): any;
            function vsub(v: any, target: any): any;
        }
        namespace ZERO {
            const x: number;
            const y: number;
            const z: number;
            function almostEquals(v: any, precision: any): any;
            function almostZero(precision: any): any;
            function clone(): any;
            function copy(source: any): any;
            function cross(v: any, target: any): any;
            function crossmat(): any;
            function distanceSquared(p: any): any;
            function distanceTo(p: any): any;
            function dot(v: any): any;
            function isAntiparallelTo(v: any, precision: any): any;
            function isZero(): any;
            function length(): any;
            function lengthSquared(): any;
            function lerp(v: any, t: any, target: any): void;
            function mult(scalar: any, target: any): any;
            function negate(target: any): any;
            function norm(): any;
            function norm2(): any;
            function normalize(): any;
            function scale(scalar: any, target: any): any;
            function set(x: any, y: any, z: any): any;
            function setZero(): void;
            function tangents(t1: any, t2: any): void;
            function toArray(): any;
            function toString(): any;
            function unit(target: any): any;
            function vadd(v: any, target: any): any;
            function vsub(v: any, target: any): any;
        }
    }
}