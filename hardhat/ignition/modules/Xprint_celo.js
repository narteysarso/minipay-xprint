const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("XprintCelo", (m) => {

  const owner = m.getAccount(0)
  const xprint = m.contract("XPrint", [owner]);

  return { xprint };
});
