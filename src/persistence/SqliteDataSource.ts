import sqlite3 from 'sqlite3'
import {ApplicationConfig, Message, MessageRequest} from "../globals";
import {dateFormatter} from "../util/util";
import {DataSource} from "./DataSource";

export class SqliteDataSource implements DataSource{
    private db: any;

    constructor(config: ApplicationConfig) {
        const dbname = (config.persistence?.sqlite?.dbname) ? config.persistence.sqlite.dbname : "signalforthings.db"
        this.db = new sqlite3.Database(dbname)
        this.init()
    }

    async init() {
        await this.db.run(`CREATE TABLE IF NOT EXISTS messages
                           (
                               id                      INTEGER PRIMARY KEY,
                               sender                  TEXT      NOT NULL,
                               recipient               TEXT      NOT NULL,
                               message                 TEXT      NOT NULL,
                               attachment_name         TEXT,
                               attachment_storage_path TEXT,
                               tag                     TEXT,
                               timestamp               TIMESTAMP NOT NULL
                           )`)
    }

    async saveOne(messageRequest: MessageRequest): Promise<Message> {
        return new Promise((resolve, reject) => {
            this.db.get(`INSERT INTO messages (sender, recipient, message, attachment_name,
                                               attachment_storage_path, tag, timestamp)
                         VALUES ('${messageRequest.sender}',
                                 '${messageRequest.recipient}',
                                 '${messageRequest.message}',
                                 '${messageRequest.attatchmentName}',
                                 '${messageRequest.attatchmentStoragePath}',
                                 '${messageRequest.tag}',
                                 '${dateFormatter()}')
                         RETURNING *`, (error: Error, row: any) => {
                const message = row as Message
                if (error) {
                    reject(error)
                }
                resolve(message)
            })
        })
    }

}

