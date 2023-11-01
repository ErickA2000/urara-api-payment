import updatePurchaseShipping from '@Helpers/updatePurchaseShipping';
import { MessageProcessor } from '@Interfaces/kafka.interface';
import { brokers_kafka, topic_shipment_kafka, clientId_shipment_kafka, groupId_shipment_kafka, aws } from 'config';
import { Consumer, ConsumerSubscribeTopics, EachBatchPayload, Kafka, EachMessagePayload } from 'kafkajs';
import { createMechanism } from '@jm18457/kafkajs-msk-iam-authentication-mechanism';

export default class ExampleConsumer {
    private kafkaConsumer: Consumer
    // private messageProcessor: MessageProcessor

    public constructor() {
        // this.messageProcessor = messageProcessor
        this.kafkaConsumer = this.createKafkaConsumer()
    }

    public async startConsumer(): Promise<void> {
        const topic: ConsumerSubscribeTopics = {
            topics: [ topic_shipment_kafka ],
            fromBeginning: false
        }

        try {
            await this.kafkaConsumer.connect()
            await this.kafkaConsumer.subscribe(topic)

            await this.kafkaConsumer.run({
                eachMessage: async (messagePayload: EachMessagePayload) => {
                    const { topic, partition, message } = messagePayload
                    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                    console.log(`- ${prefix} ${message.key}#${message.value}`);

                    let dataMessage: MessageProcessor = JSON.parse(`${message.value}`);

                    //actualizar compra
                    await updatePurchaseShipping( dataMessage );
                    
                }
            })
        } catch (error) {
            console.log('ERROR CONECT COMSUMER: ', error)
        }
    }

    public async startBatchConsumer(): Promise<void> {
        const topic: ConsumerSubscribeTopics = {
            topics: [ topic_shipment_kafka ],
            fromBeginning: false
        }

        try {
            await this.kafkaConsumer.connect()
            await this.kafkaConsumer.subscribe(topic)
            await this.kafkaConsumer.run({
                eachBatch: async (eachBatchPayload: EachBatchPayload) => {
                    const { batch } = eachBatchPayload
                    for (const message of batch.messages) {
                        const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`
                        console.log(`- ${prefix} ${message.key}#${message.value}`)
                    }
                }
            })
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    public async shutdown(): Promise<void> {
        await this.kafkaConsumer.disconnect()
    }

    private createKafkaConsumer(): Consumer {
        
        const kafka = new Kafka({
            clientId: clientId_shipment_kafka,
            brokers: brokers_kafka,
            authenticationTimeout: 3000,
            connectionTimeout: 5000,
            ssl: true,
            sasl: createMechanism({ region: aws.region, credentials: {
                accessKeyId: aws.accessKey,
                secretAccessKey: aws.secrectAccessKey
            } })
        })
        const consumer = kafka.consumer({ groupId: groupId_shipment_kafka })
        return consumer
    }
}