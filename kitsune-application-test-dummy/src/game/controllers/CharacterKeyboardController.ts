import {ICharacterInputController} from "../interface/Interfaces";

export class CharacterBaseController implements ICharacterInputController {

    constructor() {
    }

    public up: boolean = false;
    public down: boolean = false;
    public left: boolean = false;
    public right: boolean = false;
    public jump: boolean = false;
    public jumping: boolean = false; // state not input :/

    public update(delta?: number): void {

    };
}

export class CharacterKeyboardController extends CharacterBaseController {
    constructor() {
        super();
        this.initListeners();
    }

    private initListeners(): void {
        window.addEventListener('mousemove', (event: MouseEvent) => {
        });
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            // console.log('keys down new...', event);
            if (event.key == 'w') {
                this.up = true;
            }
            if (event.key == 's') {
                this.down = true;
            }
            if (event.key == 'a') {
                this.left = true;
            }
            if (event.key == 'd') {
                this.right = true;
            }
            if (event.code == 'Space') {
                this.jump = false;
            }
        });
        window.addEventListener('keyup', (event: KeyboardEvent) => {
            if (event.key == 'w') {
                this.up = false;
            }
            if (event.key == 's') {
                this.down = false;
            }
            if (event.key == 'a') {
                this.left = false;
            }
            if (event.key == 'd') {
                this.right = false;
            }
            if (event.code == 'Space') {
                // console.log('PRESSED : JUMP <----------------------')
                // console.log('PRESSED : JUMP <----------------------')
                // console.log('PRESSED : JUMP <----------------------')
                // console.log('PRESSED : JUMP <----------------------')
                this.jump = true;
            }
        });
    };

    public update(delta?: number): void {
        super.update(delta);
    };
}