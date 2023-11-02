export const brokers_kafka = getBrokers();

export const clientId_payment_kafka = process.env.KAFKA_CLIENT_ID__PAYMENT || "";

export const topic_payment_kafka = process.env.KAFKA_TOPIC_PAYMENT || "";

export const groupId_shipment_kafka = process.env.KAFKA_GROUPID_SHIPMENT || "";

export const clientId_shipment_kafka = process.env.KAFKA_CLIENT_ID_SHIPMENT || "";

export const topic_shipment_kafka = process.env.KAFKA_TOPIC_SHIPMENT || "";

function getBrokers(): string[]{
        
    const brokers = process.env.KAFKA_HOST;

    if( brokers != undefined ){
        let arrayBrokers = brokers.split(',');
        return arrayBrokers;

    }else{
        return ['kafka:9092']
    }
}