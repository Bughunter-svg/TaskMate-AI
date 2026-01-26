const users = new Map();

function getUser(userId) {
  return users.get(userId);
}

function setUser(userId, data) {
  users.set(userId, data);
}

module.exports = { getUser, setUser };
