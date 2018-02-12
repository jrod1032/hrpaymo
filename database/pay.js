const pg = require('./index.js').pg;
const pay = function(paymentDataFromServer) {
  let localPaymentInfo = {
    payerBalance: undefined,
    payeeBalance: undefined,
    payeeUserId: undefined
  }
  let hackyWorkaroundTXID; //for message notifications, I need the transaction ID to be returned by this function, as well as whatever the authors needed
  return new Promise ((res, rej) => {
    return pg.transaction(paymentTransaction => {
      return Promise.all([
        getPayerBalance(paymentTransaction, localPaymentInfo, paymentDataFromServer),
        getPayeeInfo(paymentTransaction, localPaymentInfo, paymentDataFromServer)
      ])
      // add to the users_transactions table and return created txn_id
      .then(() => {
        return pg.table('users_transactions')
        .transacting(paymentTransaction)
        .returning('txn_id')
        .insert({
          payer_id: parseInt(paymentDataFromServer.payerId),
          payee_id: localPaymentInfo.payeeUserId
        })
      })
      // add to the transactions table with txn_id
      .then(txn_id => {
        hackyWorkaroundTXID = txn_id; //see note above
        return Promise.all([
          addTransaction(paymentTransaction, txn_id, paymentDataFromServer),
          updatePayerBalance(paymentTransaction, paymentDataFromServer, localPaymentInfo),
          updatePayeeBalance(paymentTransaction, paymentDataFromServer, localPaymentInfo)
        ])
      })
      // commit
      .then(paymentTransaction.commit)
      // return the payer's balance
      .then(() => {
        // res(localPaymentInfo.payerBalance); //original, works, but will not allow notifications
        res({ balance: localPaymentInfo.payerBalance, transactionId: hackyWorkaroundTXID });
      })
      .catch(err => {
        paymentTransaction.rollback;
        rej(err);
      })
    });
  })
}

const getPayerBalance = function(paymentTransaction, localPaymentInfo, paymentDataFromServer) {
  return pg.table('balance')
  .transacting(paymentTransaction)
  .select('amount')
  .where({user_id: paymentDataFromServer.payerId})
  .then(rows => {
    localPaymentInfo.payerBalance = parseFloat(rows[0].amount);
    if(localPaymentInfo.payerBalance < parseFloat(paymentDataFromServer.amount)) {
      // return Promise.reject(new Error('Insufficient funds.'));
      throw new Error('Insufficient funds.');
    }
  })
}

const getPayeeInfo = function(paymentTransaction, localPaymentInfo, paymentDataFromServer) {
  return pg.table('users')
  .transacting(paymentTransaction)
  .select('amount', 'id')
  .innerJoin('balance', 'users.id', 'balance.user_id')
  .where({username: paymentDataFromServer.payeeUsername})
  .then(rows => {
    // if no user or payer userid === payee userid, throw error
    if(rows.length === 0 || rows[0].id === parseInt(paymentDataFromServer.payerId)) {
      throw new Error('Invalid payee username:', paymentDataFromServer.payeeUsername);
    }
    localPaymentInfo.payeeBalance = parseFloat(rows[0].amount);
    localPaymentInfo.payeeUserId = parseInt(rows[0].id);
  })
}

const addTransaction = function(paymentTransaction, txn_id, paymentDataFromServer) {
  return pg.table('transactions')
  .transacting(paymentTransaction)
  .insert({
    txn_id: parseInt(txn_id[0]),
    amount: parseFloat(paymentDataFromServer.amount).toFixed(2),
    note: paymentDataFromServer.note
  })
}

const updatePayerBalance = function(paymentTransaction, paymentDataFromServer, localPaymentInfo) {
  localPaymentInfo.payerBalance -= parseFloat(paymentDataFromServer.amount);
  return pg.table('balance')
  .transacting(paymentTransaction)
  .update({ amount: localPaymentInfo.payerBalance })
  .where({ user_id: parseInt(paymentDataFromServer.payerId) })
}

const updatePayeeBalance = function(paymentTransaction, paymentDataFromServer, localPaymentInfo) {
  localPaymentInfo.payeeBalance += parseFloat(paymentDataFromServer.amount);
  return pg.table('balance')
  .transacting(paymentTransaction)
  .update({ amount: localPaymentInfo.payeeBalance })
  .where({ user_id: localPaymentInfo.payeeUserId})
}

const getTransactionInfo = (transactionId) => {
  let query = `
    SELECT transactions.amount amount, transactions.created_at,
    (SELECT username payer_name FROM users WHERE users.id = users_transactions.payer_id),
    (SELECT phone payer_phone FROM users WHERE users.id = users_transactions.payer_id),
    (SELECT verified payer_verified FROM users WHERE users.id = users_transactions.payer_id),
    (SELECT username payee_name FROM users WHERE users.id = users_transactions.payee_id),
    (SELECT phone payee_phone FROM users WHERE users.id = users_transactions.payee_id),
    (SELECT verified payee_verified FROM users WHERE users.id = users_transactions.payee_id)
    FROM transactions, users_transactions WHERE transactions.txn_id = ${transactionId}
    AND transactions.txn_id = users_transactions.txn_id
  `;
  return pg.raw(query).then(res => res.rows[0]);
}

module.exports = {
  pay: pay,
  getTransactionInfo: getTransactionInfo
}