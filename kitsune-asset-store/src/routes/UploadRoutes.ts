
import * as express from 'express';
export class UploadRoutes {
    app: express.Application;
    name: string;
    constructor(app: express.Application, name:string) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
    }

    configureRoutes() {
        this.app.route(`/upload`)
        .post();

        return this.app;
    }

    getName(){
        return this.name;
    }
}