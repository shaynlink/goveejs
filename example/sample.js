'use strict';
const {Client} = require('../dist');
const client = new Client('689544ee-914a-414f-b32c-b00ee8fba4a8');

client.on('error', console.error);
client.on('debug', console.info);

client.on('newDevice', async (device) => {
  console.log(
      'New device: %s (%s)', device.device, device.deviceName || 'unknown');

  if (device.deviceName == 'led chambre rayane') {
    await device.turn(false)
        .then(async () => await new Promise((r) => setTimeout(r, 5000)))
        .then(() => device.turn(true));
  }
});

client
    .sync();
