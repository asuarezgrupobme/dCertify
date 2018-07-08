var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Utils = artifacts.require("./Utils.sol");
var Certify = artifacts.require("./Certify.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Utils);
  deployer.deploy(Certify);
};
