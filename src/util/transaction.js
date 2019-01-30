import drizzle from '../drizzle';

const TRANSACTION_NO_EXIST_YET = "no-transaction";
const UPDATE_TIME = 1000;

function transactionStatus(stackId, call){
  const { transactionStack, transactions } = drizzle.store.getState();

  if (stackId !== undefined){
    var transaction = transactionStack[stackId];

    if (transaction && transaction.length){
      return call(transactions[transaction].status);
    }
  }

  return call(TRANSACTION_NO_EXIST_YET);
}

export const handleTransactionUpdate = (stackId, call = (state) => true) => {
  function onTick(){
    if(transactionStatus(stackId, call)){
      return;
    }

    setTimeout(onTick, UPDATE_TIME);
  }

  onTick();
}
