"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
let AppController = class AppController {
    runDocker(portApi, portWeb, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!portApi || !portWeb) {
                    return res.status(400).json({ error: 'PORT_API and PORT_WEB are required' });
                }
                const buildCommand = `docker build -t term-app --build-arg PORT=${portApi} .`;
                (0, child_process_1.exec)(buildCommand, (buildErr, buildStdout, buildStderr) => {
                    if (buildErr) {
                        console.error(buildStderr);
                        return res.status(500).json({ error: buildErr.message });
                    }
                    const runCommand = `docker run -d -p ${portApi}:${portApi} -p ${portWeb}:3000 -it term-app`;
                    (0, child_process_1.exec)(runCommand, (runErr, runStdout, runStderr) => {
                        if (runErr) {
                            console.error(runStderr);
                            return res.status(500).json({ error: runErr.message });
                        }
                        return res.json({ message: 'Docker container started successfully' });
                    });
                });
            }
            catch (e) {
                const error = e;
                return res.status(500).json({ error: error.message });
            }
        });
    }
};
__decorate([
    (0, common_1.Get)('/run-docker'),
    __param(0, (0, common_1.Query)('PORT_API')),
    __param(1, (0, common_1.Query)('PORT_WEB')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "runDocker", null);
AppController = __decorate([
    (0, common_1.Controller)()
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map