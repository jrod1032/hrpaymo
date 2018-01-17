const pg = require('./index.js').pg;

module.exports = {

  getAllUserTransactions: (userId, callback) => {
    console.log('id: ', userId)
    pg.table('users_transactions')
        .join('users', 'users_transactions.payee_id', '=', 'users.id')
        .where('users_transactions.payer_id', `${userId}`)
        .select('users.username')

    .then( (result) => {
      console.log('query of result: ', result)
      callback(null, result);
    })
    .catch( (err) => {
      callback(err, null);
    })
  }

};