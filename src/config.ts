export const brokers_kafka = [ process.env.KAFKA_HOST || "" ];

export const clientId_kafka = process.env.KAFKA_CLIENT_ID || "";

export const topic_kafka = process.env.KAFKA_TOPIC || "";