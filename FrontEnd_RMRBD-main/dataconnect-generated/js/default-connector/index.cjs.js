const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'FrontEnd_RMRBD-main',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

