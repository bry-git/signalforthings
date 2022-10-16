import * as cron from 'node-cron'
import {Service} from "./Service";
import {ApplicationConfig, Component, ExecaObject, MessageRequest} from "./globals";
import {Logger} from "./util/Logger";

export class Scheduler {
    private cron: any;
    private service: Service
    private userAgent: any;
    private admin: any;
    private logger: Logger

    constructor(config: ApplicationConfig, service: Service, logger: Logger) {
        this.cron = cron
        this.service = service
        this.userAgent = config.signal.registered_number
        this.logger = logger
        this.logger.out(Component.Scheduler, "configured")
    }

    /**
     * At first minute every 4th hour
     * */
    ipWatchdog() {
        const task = this.cron.schedule('0 */4 * * *', async () => {
            const eo: ExecaObject = await this.service.getPublicIp()
            this.logger.out(Component.Scheduler, `public ip is ${eo.stdout}`)
            const messageRequest: MessageRequest = {
                sender: this.userAgent,
                recipient: `${process.env.ADMIN}`,
                message: `public ip is ${eo.stdout}`,
                tag: Component.Scheduler
            }
            await this.service.sendMessage(messageRequest)
            task.start()
        })
    }
}