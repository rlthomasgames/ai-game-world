import {IGameObject, IObjectController, IPlayerGameObject} from '../interface/Interfaces';
import PhysicsController from './PhysicsController';
//import {Euler, Quaternion, Vector2} from "three";
//import {MadMath} from "../Utils/MadMath";
import {Tween} from "@tweenjs/tween.js";

// @ts-ignore
import {btVector3, btQuaternion} from "../../../node_modules/ammonext";
import {Euler, Quaternion} from "three";
import {MadMath} from "../Utils/MadMath";

export class CharacterController implements IObjectController {
	private _physicsWorld:PhysicsController;

	//TODO: move all thes into the game object!
	private _forward:boolean = false;
	private _backward:boolean = false;
	private _left:boolean = false;
	private _right:boolean = false;
//	private _jump:boolean = false;
//	private _jumping:boolean = false;
//	private _falling:boolean = false;
	public _velocityX:number = 0;
	public _velocityZ:number = 0;

	public lastVelX:number = 0;
	public lastVelZ:number = 0;

	public _jumpVelocity: number = 0;
	public _jumpTween: Tween<any> | null = null;
	public physicsInfo:{
		COF_X:number,
		COF_Y:number,
		COF_Z:number,
	} = {
		COF_X:0,
		COF_Y:0,
		COF_Z:0,
	};
	public playerPhys:unknown;
	//private _impulses:btVector3 = new btVector3();

	constructor(physicsWorld:PhysicsController){
		this._physicsWorld = physicsWorld;
	}

	//TODO - implement recommended settings as test
	/*
	chatgpt recommended settings - START
	----------------------------

	using ammojs can you create the basic descriptions of the correct ammojs - friction, restitution, dampening and velocities to use for a player character to move over static physic tiles, the player has forward, backward, turn left, turn right and jump control, show the specific changes in velocities and other factors for each movement type
	ChatGPT said:
	ChatGPT
	To set up a basic Ammo.js simulation with a player character that moves over static physics tiles, you'll need to control friction, restitution, dampening, and velocities. Here’s a breakdown of how to configure each of these for your player character’s movement:

	1. Setup and Configuration:
	Player Character: Rigid body (typically a capsule or sphere collider) with properties that allow it to interact naturally with the ground.
	Ground/Static Physics Tiles: Set as static rigid bodies that the player can collide with, generally having higher friction to ensure the player doesn’t slide excessively.
	2. Ammo.js Properties Overview:
	Friction: Controls the resistance to sliding along surfaces.
	Restitution: Controls the bounciness of objects (0 = no bounce, 1 = full bounce).
	Linear Dampening: Slows down the player's movement in a straight line.
	Angular Dampening: Slows down the player’s rotation.
	Linear Velocity: Controls the forward/backward speed of the player.
	Angular Velocity: Controls the rotational speed of the player.
	3. Setting Up Player Controls in Ammo.js
	Each movement (forward, backward, turn, jump) requires adjusting these properties.

	Movement Descriptions and Configurations
	Forward and Backward Movement

	Description: To move forward or backward, adjust the linear velocity along the character’s forward axis.
	Settings:
	Friction: Moderate friction (e.g., 0.5) to maintain traction.
	Linear Velocity: Set along the forward or backward direction vector of the character.
	Linear Damping: Small damping value (e.g., 0.05) to let the player come to a gradual stop after moving.
	Example Code:
	javascript
	Copy code
	let forwardVelocity = new Ammo.btVector3(0, 0, speed); // speed for forward
	playerBody.setLinearVelocity(forwardVelocity);
	Turn Left and Right

	Description: Adjust the character's angular velocity to rotate around the Y-axis (or equivalent axis based on the orientation).
	Settings:
	Angular Velocity: Set a small angular velocity on the Y-axis to turn left or right.
	Angular Damping: Small value (e.g., 0.1) to avoid constant spinning.
	Example Code:
	javascript
	Copy code
	let turnVelocity = new Ammo.btVector3(0, turnSpeed, 0); // turnSpeed defines the rotation speed
	playerBody.setAngularVelocity(turnVelocity);
	Jumping

	Description: Jumping is achieved by setting an upward linear velocity along the Y-axis.
	Settings:
	Restitution: Set low (e.g., 0.1) so the player doesn’t bounce excessively when they hit the ground.
	Friction: Higher friction on landing helps prevent sliding after landing.
	Linear Velocity: Add a velocity on the Y-axis only (e.g., jumpStrength).
	Linear Damping: Set slightly higher (e.g., 0.1) to counteract minor velocity changes due to collisions while airborne.
	Example Code:
	javascript
	Copy code
	let jumpVelocity = new Ammo.btVector3(0, jumpStrength, 0); // jumpStrength determines jump height
	playerBody.setLinearVelocity(jumpVelocity);
	Putting It All Together: Sample Configuration for Each Movement
	1. Player Body Initialization Example
	javascript
	Copy code
	let playerShape = new Ammo.btCapsuleShape(radius, height);
	let playerTransform = new Ammo.btTransform();
	playerTransform.setIdentity();
	playerTransform.setOrigin(new Ammo.btVector3(startX, startY, startZ));

	let playerMass = 1;
	let playerInertia = new Ammo.btVector3(0, 0, 0);
	playerShape.calculateLocalInertia(playerMass, playerInertia);

	let playerMotionState = new Ammo.btDefaultMotionState(playerTransform);
	let playerRigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(playerMass, playerMotionState, playerShape, playerInertia);
	let playerBody = new Ammo.btRigidBody(playerRigidBodyInfo);

	// Set friction, restitution, damping values
	playerBody.setFriction(0.5);
	playerBody.setRestitution(0.1);
	playerBody.setDamping(0.05, 0.1); // linear, angular damping
	2. Adjusting Velocities Based on Input
	javascript
	Copy code
	function handleMovement(input) {
		// Reset velocities
		playerBody.setLinearVelocity(new Ammo.btVector3(0, playerBody.getLinearVelocity().y(), 0)); // Maintain Y velocity
		playerBody.setAngularVelocity(new Ammo.btVector3(0, 0, 0));

		// Forward Movement
		if (input.forward) {
			let forwardVelocity = new Ammo.btVector3(0, 0, -moveSpeed); // Adjust Z-axis for forward/backward
			playerBody.setLinearVelocity(forwardVelocity);
		}

		// Backward Movement
		if (input.backward) {
			let backwardVelocity = new Ammo.btVector3(0, 0, moveSpeed); // Adjust Z-axis for backward
			playerBody.setLinearVelocity(backwardVelocity);
		}

		// Turn Left
		if (input.turnLeft) {
			let turnLeftVelocity = new Ammo.btVector3(0, turnSpeed, 0); // Adjust Y-axis for turning
			playerBody.setAngularVelocity(turnLeftVelocity);
		}

		// Turn Right
		if (input.turnRight) {
			let turnRightVelocity = new Ammo.btVector3(0, -turnSpeed, 0); // Adjust Y-axis for turning
			playerBody.setAngularVelocity(turnRightVelocity);
		}

		// Jump
		if (input.jump && isGrounded) { // Ensure grounded check
			let jumpVelocity = new Ammo.btVector3(0, jumpStrength, 0);
			playerBody.setLinearVelocity(jumpVelocity);
		}
	}
	Final Notes
	Grounded Check: Ensure you have a way to detect if the player is grounded to avoid multiple jumps.
	Optimizing Friction: Friction may need fine-tuning depending on the gameplay, especially if the player seems to slide too much or stop too abruptly.
	Damping Values: Increase damping values slightly if the player feels too slippery.

	chatgpt recommended settings - END
	----------------------------
	 */

	public update(gameObject:IGameObject, delta:number):void {
		const player:IPlayerGameObject = gameObject as IPlayerGameObject;
		console.log(`character controller is updating character ${gameObject}${player}`);
		//const velocityRadVector:Vector2 = MadMath.radialPosition(new Vector2(), (this._velocityZ*player.speed)*player.pointerRadius, player.angle);
		//const xFactor = Math.round(velocityRadVector.x);
		//const zFactor = Math.round(velocityRadVector.y);
		const cOM = player.physicsBody.getCenterOfMassTransform().getOrigin();
		this.physicsInfo.COF_X = cOM.x();
		this.physicsInfo.COF_Y = cOM.y();
		this.physicsInfo.COF_Z = cOM.z();
		//this.physicsInfo.angularDamping = player.physicsBody.getLinearDamping();
		const playerCollision = this._physicsWorld.checkForHitTest(player);
		let firstImpact = false;


		player.collision = playerCollision;

		player.inputController.update();

		const moveSpeed = 18;
		const turnSpeed = 4;
		this._forward = player.inputController.up;
		this._backward = player.inputController.down;
		this._left = player.inputController.left;
		this._right = player.inputController.right;
		if(player.collision && !firstImpact) {
			// Reset velocities
			player.physicsBody.setLinearVelocity(new btVector3(0, player.physicsBody.getLinearVelocity().y(), 0)); // Maintain Y velocity
			player.physicsBody.setAngularVelocity(new btVector3(0, 0, 0));

			// Forward Movement
			if (this._forward) {
				let forwardVelocity = new btVector3(0, 0, -moveSpeed); // Adjust Z-axis for forward/backward
				player.physicsBody.setLinearVelocity(forwardVelocity);
			}

			// Backward Movement
			if (this._backward) {
				let backwardVelocity = new btVector3(0, 0, moveSpeed); // Adjust Z-axis for backward
				player.physicsBody.setLinearVelocity(backwardVelocity);
			}

			// Turn Left
			if (this._left) {
				let turnLeftVelocity = new btVector3(0, turnSpeed, 0); // Adjust Y-axis for turning
				player.physicsBody.setAngularVelocity(turnLeftVelocity);
			}

			// Turn Right
			if (this._right) {
				let turnRightVelocity = new btVector3(0, -turnSpeed, 0); // Adjust Y-axis for turning
				player.physicsBody.setAngularVelocity(turnRightVelocity);
			}

			/*
			// Jump
			if (input.jump && isGrounded) { // Ensure grounded check
				let jumpVelocity = new Ammo.btVector3(0, jumpStrength, 0);
				playerBody.setLinearVelocity(jumpVelocity);
			}

			 */

		}
		const quarternion: Quaternion = new Quaternion();
		const rotation: Euler = new Euler(MadMath.degreesToRadians(-0.5), MadMath.degreesToRadians((-player.angle) + 90), 0, 'ZYX');
		quarternion.setFromEuler(rotation);

		var quart: btQuaternion = new btQuaternion(quarternion.x, quarternion.y, quarternion.z, quarternion.w);
		var transform = player.physicsBody.getWorldTransform();
		player.animationController.update(delta / 22.5)
		transform.setRotation(quart);
	}
}