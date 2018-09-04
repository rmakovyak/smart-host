export function calculateRoomUsage(settledCustomers) {
  if (!settledCustomers) {
    throw new Error('settledCustomers argument is missing!');
  }

  const premiumCustomers = settledCustomers.filter(c => c.room === 'premium');
  const economyCustomers = settledCustomers.filter(c => c.room === 'economy');

  return {
    premium: {
      total: premiumCustomers.length,
      value: premiumCustomers.reduce(
        (total, current) => total + current.payment,
        0
      )
    },
    economy: {
      total: economyCustomers.length,
      value: economyCustomers.reduce(
        (total, current) => total + current.payment,
        0
      )
    }
  };
}

export function settleCustomers(customers, rooms) {
  let premiumLimit = 100;

  const economyCustomersForecast = customers.filter(
    c => c.payment < premiumLimit
  ).length;
  const premiumCustomersForecast = customers.filter(
    c => c.payment >= premiumLimit
  ).length;
  let occupiedPremium = 0;
  let occupiedEconomy = 0;
  let upgradeCapacity = 0;

  const upgradePossible =
    premiumCustomersForecast < rooms.premium &&
    economyCustomersForecast > rooms.economy;

  if (upgradePossible) {
    upgradeCapacity = economyCustomersForecast - rooms.economy;
  }

  /**
   * Cycle goes over sorted by payment capacity list of customers
   * and assign them with a room
   */
  for (let i = 0; i < customers.length; i++) {
    if (
      customers[i].payment >= premiumLimit &&
      occupiedPremium < rooms.premium
    ) {
      customers[i].room = 'premium';
      occupiedPremium = occupiedPremium + 1;
    }

    /**
     * Upgrade economy user if there is upgradeCapacity
     */
    if (customers[i].payment < premiumLimit && upgradeCapacity > 0) {
      customers[i].room = 'premium';
      customers[i].upgraded = true;
      upgradeCapacity = upgradeCapacity - 1;
      continue;
    }

    if (
      customers[i].payment < premiumLimit &&
      occupiedEconomy < rooms.economy
    ) {
      customers[i].room = 'economy';
      occupiedEconomy = occupiedEconomy + 1;
    }
  }

  return customers;
}

export function generateCustomers(payments) {
  if (!payments) {
    throw new Error('payment argument is missing!');
  }

  const sortedPayments = payments.sort((a, b) => b - a);
  return sortedPayments.map((payment, index) => ({
    payment,
    room: undefined,
    upgraded: undefined
  }));
}
