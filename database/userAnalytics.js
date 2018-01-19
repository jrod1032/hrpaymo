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

    var secondSubquery = pg.table('users').where('users.username', '=' ,`${username}`).select('users.id');
    pg.table('transactions')
      .join('users_transactions', 'transactions.txn_id', '=', 'users_transactions.txn_id')
      .where('users_transactions.payee_id', 'in', secondSubquery)
      .select('transactions.amount')  

      .then( (secondResult) => {
        console.log('secondResult: ', secondResult)
        callback(null, result, secondResult);
      })    
      .catch( (err) => {
        callback(err, null)
      })
    })
    .catch( (err) => {
      callback(err, null);
    })  
  },

  getAllUserNotes: (username, callback) => {
    var subquery = pg.table('users').where('users.username', '=' ,`${username}`).select('users.id');  
    pg.table('transactions')
      .join('users_transactions', 'transactions.txn_id', '=', 'users_transactions.txn_id')
      .where('users_transactions.payer_id', 'in', subquery)
      .select('transactions.note')

      .then( (result) => {
        console.log('notes:', result);
        callback(null, result)
      })
      .catch( (err) => {
        callback(err, null)
      })
  },

  getEmoji: (query, callback) => {
    var subquery = `SELECT r_emoji FROM (SELECT reactions.emoji AS r_emoji, 
    to_tsvector(reactions.description) AS document FROM reactions) AS r_search 
    WHERE r_search.document @@ to_tsquery('${query}:*');`

    pg.raw(query)
      .then( (emojiList) => {
        console.log('emojis! ', emojiList)
        callback(null, emojiList)
      })
      .catch( (err) => {
        callback(err, null);
      })
  }

};