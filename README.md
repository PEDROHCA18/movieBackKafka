﻿# movieBackKafka
# movieBackKafka
executar:
mv docker/docker-compose.yml docker-compose.yml
docker-compose up -d
npm install kafkajs
node src/producer/movieProducer.js
node src/consumer/movieConsumer.js
