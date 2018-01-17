const pg = require('./index.js').pg;

module.exports = {

  getAllUserTransactions: (userId, callback) => {

    pg.table('users_transactions')
        .join('users', 'users_transactions.payee_id', '=', 'users.id')
        .where('users_transactions.payer_id', '=', userId)
        .select('users.username')

    .then( (result) => {
      callback(null, result);
    })
    .catch( (err) => {
      callback(err, null);
    })
  },

  getAllUserAmountsSpent: (username, callback) => {
    var subquery = pg.table('users').where('users.username', '=' ,`${username}`).select('users.id');
    pg.table('transactions')
      .join('users_transactions', 'transactions.txn_id', '=', 'users_transactions.txn_id')
      .where('users_transactions.payer_id', 'in', subquery)
      .select('transactions.amount')

    .then( (result) => {
      console.log('result: ', result)
      callback(null, result);
    })
    .catch( (err) => {
      callback(err, null);
    })  
  }

};