/*
export class BasicMenu {
    public active:boolean = false;
    public currentMenuDOM:HTMLDivElement = null;
    private menuScreens:Array<IMenuScreen> = [];
    constructor(){

    }

    public addMenu(ms:IMenuScreen){
        this.menuScreens.push(ms);
    }

    public showMenu(menuName:string){
        this.menuScreens.forEach((m)=>{
            if(m.domElement.id === menuName){
                m.domElement.style.visibility = 'visible';
                m.domElement.style.display = 'initial';
                m.domElement.style.zIndex = '9999999999999999999999999999999999999999999999';
                m.onActive();
            }
        });
    }

    public hideMenu(menuName:string){
        this.menuScreens.forEach((menuToHide)=>{
            if(menuToHide.domElement.id === menuName) {
                menuToHide.domElement.style.visibility = 'hidden';
                menuToHide.domElement.style.display = 'none';
                menuToHide.domElement.style.zIndex = '0';
                menuToHide.onDeActive();
            }
        })
    }

    public hideAll(){
        // console.log('hide all menus :', this.menuScreens);
        this.menuScreens.forEach((m)=>{
            // console.log('hiding menu :', m.name);
            this.hideMenu(m.name);
        });
    }
}

export interface IMenuScreen {
    name:string|null;
    domElement:HTMLDivElement|null;
    onActive:Function|null;
    onDeActive:Function|null;
}

 */