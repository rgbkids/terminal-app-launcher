import { Controller, Get, Query, Res } from '@nestjs/common';
import { exec } from 'child_process';
import { Response } from 'express';

function checkPortInUse(port: string): Promise<boolean> {
    return new Promise((resolve) => {
        exec(`lsof -i:${port} | grep LISTEN`, (err, stdout) => {
            resolve(stdout.trim().length > 0);
        });
    });
}

@Controller()
export class AppController {
    @Get('/run-docker')
    async runDocker(
        @Query('PORT_API') portApi: string,
        @Query('PORT_WEB') portWeb: string,
        @Res() res: Response,
    ) {
        try {
            if (!portApi || !portWeb) {
                return res.status(400).json({ error: 'PORT_API and PORT_WEB are required' });
            }

            // ポートが使用中かどうかを確認
            const isPortApiInUse = await checkPortInUse(portApi);
            const isPortWebInUse = await checkPortInUse(portWeb);

            if (isPortApiInUse || isPortWebInUse) {
                return res.status(400).json({
                    error: 'Specified ports are already in use',
                    details: {
                        portApi: isPortApiInUse ? 'in use' : 'available',
                        portWeb: isPortWebInUse ? 'in use' : 'available',
                    },
                });
            }

            // Dockerコマンドの実行
            const buildCommand = `docker build -t term-app --build-arg PORT=${portApi} .`;
            exec(buildCommand, (buildErr, buildStdout, buildStderr) => {
                if (buildErr) {
                    console.error(buildStderr);
                    return res.status(500).json({ error: buildErr.message });
                }

                const runCommand = `docker run -d -p ${portApi}:${portApi} -p ${portWeb}:3000 -it term-app`;
                exec(runCommand, (runErr, runStdout, runStderr) => {
                    if (runErr) {
                        console.error(runStderr);
                        return res.status(500).json({ error: runErr.message });
                    }

                    return res.json({ message: 'Docker container started successfully' });
                });
            });
        } catch (e) {
            const error = e as Error;
            return res.status(500).json({ error: error.message });
        }
    }
}
