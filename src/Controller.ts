import express, {Express, Request, Response} from 'express';
import multer, {Multer} from 'multer'
import {Service} from "./Service";
import {Component, ExecaObject, MessageRequest} from "./globals";
import cors from 'cors'
import {dateFormatter, isValidRequest, logger} from "./Util/util";

export class Controller {
    private express: Express;
    private multer: Multer;
    private service: Service;
    private readonly port: any;
    private readonly storagePath: string;

    constructor() {
        this.express = express();
        this.storagePath = '/signalforthings/attachments/'
        this.multer = multer({storage: multer.diskStorage({
                destination: (req, file, cb) => cb(null, this.storagePath),
                filename: (req, file, cb) => cb(null, `${dateFormatter()}.${file.originalname.split('.').pop()}`)
            })});
        this.port = process.env.PORT;
        this.service = new Service()
    }

    run(): void {
        this.express.use(cors())
        this.express.use(express.json())
        this.express.use(express.urlencoded({extended: true}))

        this.express.post('/outgoing', this.multer.none(), async (req: Request, res: Response) => {
            try {
                if(!req.body.tag) {req.body.tag = req.headers['user-agent']}
                const messageRequest = req.body as MessageRequest
                if (!isValidRequest(messageRequest)) throw new Error()
                const eo: ExecaObject = await this.service.sendMessage(messageRequest)

                res.status(201).send(eo.stdout)
            } catch (error) {
                res.status(400).json("bad request")
            }
        })

        /**
         * will save an HTTP request that includes a file
         * posts to this endpoint should be sent as form-data, but also parses JSON
         */
        this.express.post('/outgoing/attached', this.multer.single('file'), async (req: Request, res: Response) => {
            try {
                logger(Component.Controller, "headers: ", req.headers)

                if(!req.body.tag) {req.body.tag = req.headers['user-agent']}
                const messageRequest = req.body as MessageRequest
                if (!isValidRequest(messageRequest)) throw new Error()

                messageRequest.file = req.file
                messageRequest.attatchmentName = req.file?.filename
                messageRequest.attatchmentStoragePath = req.file?.path

                const eo: ExecaObject = await this.service.sendMessage(messageRequest)

                res.status(201).send(eo.stdout)
            } catch(error) {
                res.status(400).json("bad request")
            }

        })

        this.express.listen(this.port, () => {
            logger(Component.Controller, `running at http://localhost:${this.port}`)
        });
    }
}