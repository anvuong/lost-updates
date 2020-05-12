const nanoid = require('nanoid');
const models = require('../models');

const genCode = nanoid.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 15);

const insertUsers = async () => {
  const usersNum = 10;
  const usersCount = await models.User.count();
  if (usersCount >= usersNum) {
    console.log(`There are ${usersCount} users in database right now, no need to insert anymore.`);
    return;
  }
  const usersToInsertNum = usersNum - usersCount;
  console.log(`Inserting ${usersToInsertNum} users into database...`);

  let users = [];
  try {
    for (let i = 0; i < usersToInsertNum; i += 1) {
      users.push({
        username: genCode(),
        isMale: Math.random() < 0.5,
        score: Math.ceil(Math.random() * 10),
      });
      // To avoid out-of-memory error, insert every 10000 users into database
      if (i % 10000 === 0) {
        await models.User.bulkCreate(users);
        users = [];
      }
    }
    // Make sure no users are left uninserted (in cases usersToInsertNum % 10000 !== 0)
    if (users.length > 0) {
      await models.User.bulkCreate(users);
    }
    console.log(`${usersToInsertNum} users have been inserted into database successfully.`);
  } catch (error) {
    console.error('Error in insertUsers', error);
  }
};

module.exports = {
  insertUsers,
};