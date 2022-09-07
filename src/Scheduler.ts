import * as cron from 'node-cron'
import {Service} from "./Service";
import {logger} from "./Util/util";
import {Component, ExecaObject, MessageRequest} from "./globals";

export class Scheduler {
    private cron: any;
    private service: Service
    private userAgent: any;

    constructor() {
        this.cron = cron
        this.service = new Service()
        this.userAgent = process.env.USER_AGENT
    }

    /**
     * At first minute every 4th hour
     * */
    ipWatchdog() {
        const task = this.cron.schedule('0 */4 * * *', async () => {
            const eo: ExecaObject = await this.service.getPublicIp()
            logger(Component.Scheduler, `public ip is ${eo.stdout}`)
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