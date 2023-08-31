const MarketplaceMigration = artifacts.require("MarketPlace");

module.exports = function (deployer) {
  deployer.deploy(MarketplaceMigration);
};
