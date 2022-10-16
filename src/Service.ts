import {execa} from 'execa'
import {ApplicationConfig, Component, ExecaObject, Message, MessageRequest} from "./globals";
import {Logger} from "./util/Logger";
import {DataSource} from "./persistence/DataSource";

export class Service {
    private dataSource: DataSource;
    private execa: any;
    private userAgent: any;
    private logger: Logger

    constructor(config: ApplicationConfig, dataSource: DataSource, logger: Logger) {
        this.dataSource = dataSource
        this.execa = execa
        this.userAgent = config.signal.registered_number
        this.logger = logger
        this.logger.out(Component.Service, "configured")
    }

    async getPublicIp(): Promise<ExecaObject> {
        return await this.execa('curl', ['ifconfig.me'])
    }

    async sendMessage(messageRequest: MessageRequest): Promise<ExecaObject> {
        try {
            const args: string[] = ['-u', `+${this.userAgent}`, 'send', '-m', `${messageRequest.message}`, `+${messageRequest.recipient}`]
            const saved: Message = await this.dataSource.saveOne(messageRequest)

            if(!!messageRequest.file) args.push('-a',`${messageRequest.attatchmentStoragePath}`)

            return await this.execa('signal-cli', args)
        } catch (error) {
            this.logger.out(Component.Error, null, error)
            throw new Error()
        }
    }
}