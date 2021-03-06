/**
 * Import external libraries
 */
const { Service } = require('alfred-base');
const debug = require('debug')('HousePlant:Server');

// Setup service options
const { version } = require('../../package.json');
const serviceName = require('../../package.json').description;
const namespace = require('../../package.json').name;

const options = {
  serviceName,
  namespace,
  serviceVersion: version,
};

// Bind api functions to base class
Object.assign(Service.prototype, require('../api/sensors/sensors'));

// Bind schedule functions to base class
Object.assign(Service.prototype, require('../schedules/controller'));

// Create base service
const service = new Service(options);

async function setupServer() {
  // Setup service
  await service.createRestifyServer();

  // Apply api routes
  service.restifyServer.get('/sensors/:sensorAddress', (req, res, next) =>
    service._sensors(req, res, next),
  );
  debug(`Added get '/sensors/:sensorAddress' api`);

  service.restifyServer.get('/sensors/current', (req, res, next) =>
    service._current(req, res, next),
  );
  debug(`Added get '/sensors/current' api`);

  service.restifyServer.get('/zones/:zone', (req, res, next) =>
    service._zones(req, res, next),
  );
  debug(`Added get '/zones/:zone' api`);

  service.restifyServer.get('/sensors/zone/:zone', (req, res, next) =>
    service._sensorsZone(req, res, next),
  );
  debug(`Added '/sensors/zone/:zone' api`);

  service.restifyServer.get('/needswater', (req, res, next) =>
    service._needsWater(req, res, next),
  );
  debug(`Added '/needsWater' api`);

  debug('Set up schedules');
  await service._setupSchedules();

  // Listen for api requests
  service.listen();
}
setupServer();
