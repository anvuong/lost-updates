const { Transaction } = require('sequelize');
const models = require('../models');

const updateName = async (userId, name) => {
  if (!userId || !name) {
    return;
  }
  try {
    await models.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ
    }, async (t) => {
      const user = await models.User.findByPk(userId, { transaction: t });
      user.username = name;
      await user.save({ transaction: t });
    });
    return { userId, name, result: 'OK' }
  } catch (error) {
    return { userId, name, error: error.message || `${error}` }
  }
};

module.exports = {
  updateName,
};