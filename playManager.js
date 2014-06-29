function PlayerManager(config) {
  
  this.config = config;
  
  
  
}

module.exports = function(config) { 
  return new PlayerManager(config);
}