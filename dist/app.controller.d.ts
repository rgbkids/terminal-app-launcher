import { Response } from 'express';
export declare class AppController {
    runDocker(portApi: string, portWeb: string, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
