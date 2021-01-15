/**
 * Import external libraries
 */
const { Service } = require('alfred-base');
const debug = require('debug')('Flower:Server');

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
Object.assign(Service.prototype, require('../api/schedules/schedules'));
Object.assign(Service.prototype, require('../api/sensors/sensors'));

// Create base service
const service = new Service(options);

async function setupServer() {
  // Setup service
  await service.createRestifyServer();

  // Set device data arrays
  service.devices = {};
  service.devicesFound = {};
  service.missingDevices = {};

  // Apply api routes
  service.restifyServer.get('/schedules', (req, res, next) =>
    service._listSchedules(req, res, next),
  );
  debug(`Added get '/schedules' api`);

  service.restifyServer.get('/schedules/:scheduleID', (req, res, next) =>
    service._listSchedule(req, res, next),
  );
  debug(`Added get '/schedules/:scheduleID' api`);

  service.restifyServer.put('/schedules/:scheduleID', (req, res, next) =>
    service._saveSchedule(req, res, next),
  );
  debug(`Added put '/schedules/:scheduleID' api`);

  service.restifyServer.get('/sensors/:gardenSensorAddress', (req, res, next) =>
    service._sensors(req, res, next),
  );
  debug(`Added get '/sensors/:gardenSensorAddress' api`);

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

  // Listen for api requests
  service.listen();
}
setupServer();
