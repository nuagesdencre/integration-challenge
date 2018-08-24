var express = require("express");
var router = express.Router();
var braintree = require("braintree");

router.post("/", function(req, res, next) {
  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "pddyn7f48q9pq2sq",
    publicKey: "vqnvqvnrzvzyj26n",
    privateKey: "29f39d47834b6faf5e1dc3b4a9a759f3"
  });

  // Use the payment method nonce here
  var nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  var newTransaction = gateway.transaction.sale(
    {
      amount: "10.00",
      paymentMethodNonce: nonceFromTheClient,
      options: {
        // This option requests the funds from the transaction
        // once it has been authorized successfully
        submitForSettlement: true
      }
    },
    function(error, transactionResult) {
      if (transactionResult) {
        gateway.testing.settle(transactionResult.transaction.id, function(
          err,
          settleResult
        ) {
          settleResult.success;
          // true

          settleResult.transaction.status;
          // Transaction.Status.Settled
        });
      } else {
        res.status(500).send(error);
      }
    }
  );
});

module.exports = router;
