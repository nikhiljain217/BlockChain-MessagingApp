const Messages = artifacts.require("./Messages.sol");

module.exports = function(deployer) {
  deployer.deploy(Messages);
};
