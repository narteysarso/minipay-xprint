const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TTKModule", (m) => {

    const owner = m.getAccount(0)
  const xprint = m.contract("TTK",[owner]);

  return { xprint };
});
