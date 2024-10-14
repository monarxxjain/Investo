import { Aptos } from "@aptos-labs/ts-sdk";

const moduleAddress =
  "f794b00f96808a63fe845d60950fb60f1dfd69c083ab30a49864bc1841fb8593";
let hasInitializedInvesto = false;
const aptos = new Aptos();

// account is an instance of useWallet()
// const { account, signAndSubmitTransaction } = useWallet();

const initializeInvesto = async (account, signAndSubmitTransaction) => {
  if (hasInitializedInvesto) return true;
  if (!account) return [];
  const transaction = {
    data: {
      function: `${moduleAddress}::investo::initializeInvesto`,
      functionArguments: [],
    },
  };
  try {
    const response = await signAndSubmitTransaction(transaction);
    await aptos.waitForTransaction({ transactionHash: response.hash });
    hasInitializedInvesto = true;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const createInvestment = async (
  account,
  signAndSubmitTransaction,
  dealID,
  investorAddress,
  amountInvested
) => {
  if (!account) return [];
  if (!hasInitializedInvesto) {
    await initializeInvesto(account, signAndSubmitTransaction);
  }

  const transaction = {
    data: {
      function: `${moduleAddress}::investo::addInvestment`,
      functionArguments: [dealID, investorAddress, amountInvested],
    },
  };
  try {
    const response = await signAndSubmitTransaction(transaction);
    await aptos.waitForTransaction({ transactionHash: response.hash });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const fetchInvestments = async (account) => {
  if (!account) return [];
  if (!hasInitializedInvesto) {
    await initializeInvesto(account, signAndSubmitTransaction);
  }

  try {
    const investmentResource = await aptos.getAccountResource({
      accountAddress: account?.address,
      resourceType: `${moduleAddress}::investo::Investments`,
    });
    const tableHandle = investmentResource.data.investment.handle;
    const taskCounter = investmentResource.data.investment_counter;

    const investments = [];
    let counter = 1;
    while (counter <= taskCounter) {
      const tableItem = {
        key_type: "u64",
        value_type: `${moduleAddress}::investo::Investment`,
        key: `${counter}`,
      };
      const investment = await aptos.getTableItem({
        handle: tableHandle,
        data: tableItem,
      });
      investments.push(investment);
      counter++;
    }
    return investments;
  } catch (e) {
    console.log(e);
    return {};
  }
};

export { createInvestment, fetchInvestments, moduleAddress };
