const {get} = require("axios");
let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-mac-status", "MacStatus", MacStatus);
};

class MacStatus {
  constructor(log, config) {
    this.log = log;
    this.name = config.name;
  }

  getServices() {
    const informationService = new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Manufacturer, "Custom Manufacturer")
      .setCharacteristic(Characteristic.Model, "Mac Status Monitor");

    const switchService = new Service.Switch(this.name);
    switchService.getCharacteristic(Characteristic.On)
      .on('get', this.handleSwitchGet.bind(this))
      .on('set', this.handleSwitchSet.bind(this));

    return [informationService, switchService];
  }

handleSwitchGet(callback) {
  get('http://192.168.1.224:5000/current_app')
    .then(response => {
      this.log(`Current active application: ${response.data.current_app}`);
      callback(null, true);
    })
    .catch(error => {
      this.log('Error fetching current application:', error);
      callback(error);
    });
}


  handleSwitchSet(value, callback) {
    // Placeholder for waking up or sleeping the Mac
    callback();
  }
}
