import {AnimationAction, AnimationClip, AnimationMixer, LoopRepeat, Object3D, Scene} from "three";
import {GLTF} from "three/examples/jsm/loaders/GLTFLoader";

export default class CharacterAnimationController {
    private _characterModel: Scene;
    private _animationMixer: AnimationMixer;
    private _animations: AnimationClip[];
    private _animationActions: { [id: string]: AnimationAction } = {};
    private _currentAnimation: AnimationAction | null;
    private _lastAction: AnimationAction;
    private _timeout: any;

    constructor(characterModel: GLTF) {
        console.log('character = ', characterModel, 'children = ')
        characterModel.scene.traverse((child)=>{
            console.log(child)
        })
        this._characterModel = characterModel.scene as unknown as Scene;
        this._animationMixer = new AnimationMixer(this._characterModel);
        this._animations = characterModel.animations;
        console.log('check animations..')
        for( let a in this._animations ){
            console.log(`animation : ${this._animations[a].name}`);
        }
        this._animations.forEach((anim: AnimationClip) => {
            this._animationActions[anim.name] = this._animationMixer.clipAction(anim);
        });
    }

    public setStartAnimation(animName: string): void {
        this._currentAnimation = this._animationActions[animName];
        this._currentAnimation.reset();
        this._currentAnimation.timeScale = 22;
        this._currentAnimation.loop = LoopRepeat;
        this._currentAnimation.play();
    }

    public getModel(): Object3D {
        return this._characterModel;
    }

    public pause(easeTime:number):void {
        (this._currentAnimation as AnimationAction).halt(easeTime);
    }

    public playAction(action: string, mixTime:number = 0.001, duration?:number, timeScale?:number): void {
        if(mixTime != 0) {
            if (this._currentAnimation != this._animationActions[action] && !this._timeout && this._currentAnimation) {
                this._lastAction = this._currentAnimation;
                // console.log(action, this._animationActions[action], this._animationActions[action].timeScale)
                if(duration) {
                    this._animationActions[action].setDuration(duration);
                } else {
                    duration = 1;
                }
                if(timeScale) {
                    this._animationActions[action].setEffectiveTimeScale(timeScale);
                } else {
                    timeScale = 1;
                }
                this._currentAnimation.crossFadeTo(this._animationActions[action], mixTime, true);
                this._currentAnimation = this._animationActions[action];
                this._currentAnimation.play();
                this._timeout = setTimeout(() => {
                    this._lastAction.stop();
                    this._timeout = null;
                }, mixTime * duration / timeScale);
            }
        } else {
            if(this._currentAnimation != this._lastAction) {
                if (this._lastAction) {
                    this._lastAction.stop();
                }
                if (this._currentAnimation) {
                    this._currentAnimation.stop();
                }
                this._currentAnimation = null;
                this._currentAnimation = this._animationActions[action];
                this._lastAction = this._currentAnimation;
                this._currentAnimation.play();
            }
        }
    }

    public stop():void {
        if (this._lastAction) {
            this._lastAction.stop();
        }
        if (this._currentAnimation) {
            this._currentAnimation.stop();
        }
    }

    public update(delta: number): void {
        this._animationMixer.update(delta);
    }
}