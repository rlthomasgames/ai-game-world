/*
export default class BasicLoaderDisplay {
    public static instance: BasicLoaderDisplay;
    private spinnerAngle:number = 0;
    private loader:HTMLDivElement;

    private lastStage: string = 'Initial';

    constructor() {
        this.createView();
        BasicLoaderDisplay.instance = this;
    }

    createView() {
        const loadingText = document.createElement('div');
        loadingText.id = 'loader';
        loadingText.style.background = 'rgba(0,0,0,0.45)';
        loadingText.style.zIndex = '99';
        loadingText.style.margin = 'auto';
        loadingText.style.position = 'absolute';
        loadingText.style.top = '0px';
        loadingText.style.bottom = '0px';
        loadingText.style.width = '100%';
        loadingText.style.textAlign = 'center';
        loadingText.style.lineHeight = '28px';
        loadingText.style.fontSize = '24px';

        document.body.appendChild(loadingText);
        this.loader = loadingText;
        loadingText.innerText = '';
        loadingText.style.color = '#ffffff';
    }

    updateLoaderStatus(stage:string, percent:number) {
        if(stage != this.lastStage){
            this.reset();
            this.loaderVisible(true)
            this.lastStage = stage;
        }
        if(percent === 100){
            this.loaderVisible(false)
        }
        this.loader.innerHTML = ` <div id="spinner" class="yingnyang inline-text" style="font-size: 48px !important; margin-top: 12px; top: 6px;">☯</div><div class="inline-text">${stage}...  ${percent}%</div>`;
        const spinner = document.getElementById('spinner');
        spinner.style.transform = `rotate(${this.spinnerAngle}deg)`;
        spinner.animate([
            // key frames
            {transform: `rotate(${this.spinnerAngle + Math.trunc((359 / 100)*percent)}deg)`}
        ], {
            // sync options
            duration: 250,
            iterations: 1
        });
        this.spinnerAngle += Math.trunc((359 / 100)*percent);
    }

    reset(){
        this.spinnerAngle = 0;
        this.loader.innerHTML = ` <div id="spinner" class="yingnyang inline-text" style="font-size: 48px !important; margin-top: 12px; top: 6px;">☯</div><div class="inline-text"> </div>`;
    }

    loaderVisible(value:boolean){
        if(value){
            this.loader.style.visibility = 'visible';
            this.loader.style.display = 'block';
        } else {
            this.loader.style.visibility = 'hidden';
            this.loader.style.display = 'none';
        }
    }
}

 */