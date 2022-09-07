import {Repository} from "./Repository";
import {execa} from 'execa'
import {Component, ExecaObject, Message, MessageRequest} from "./globals";
import {logger} from "./Util/util";

export class Service {
    private repository: Repository;
    private execa: any;
    private userAgent: any;

    constructor() {
        this.repository = new Repository()
        this.execa = execa
        this.userAgent = process.env.USER_AGENT
    }

    async getPublicIp(): Promise<ExecaObject> {
        return await this.execa('curl', ['ifconfig.me'])
    }

    async sendMessage(messageRequest: MessageRequest): Promise<ExecaObject> {
        try {
            const saved: Message = await this.repository.saveOne(messageRequest)
            const args: string[] = ['-u', `+${this.userAgent}`, 'send', '-m', `${messageRequest.message}`, `+${messageRequest.recipient}`]

            if(!!messageRequest.file) args.push('-a',`${messageRequest.attatchmentStoragePath}`)

            const eo: ExecaObject = await this.execa('signal-cli', args)

            logger(Component.Service, "executing: ", eo.command)
            logger(Component.Service, "saved message successfully", saved)

            return eo
        } catch (error) {
            logger(Component.Error, null, error)
            throw new Error()
        }
    }
}