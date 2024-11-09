"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
class UploadRoutes {
    constructor(app, name) {
        this.app = app;
        this.name = name;
        this.configureRoutes();
    }
    configureRoutes() {
        this.app.route(`/upload`)
            .post();
        return this.app;
    }
    getName() {
        return this.name;
    }
}
exports.UploadRoutes = UploadRoutes;
