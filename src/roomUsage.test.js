import {
  generateCustomers,
  settleCustomers,
  calculateRoomUsage
} from './roomUsage';
import { settledCustomers, payments } from './roomUsageTestFixtures';

describe('roomUsage', () => {
  describe('generateCustomers', () => {
    it('converts payments array into customer list', () => {
      const result = generateCustomers([100, 200, 300]);
      const expected = [
        { payment: 300, upgraded: undefined, room: undefined },
        { payment: 200, upgraded: undefined, room: undefined },
        { payment: 100, upgraded: undefined, room: undefined }
      ];
      expect(result).toEqual(expected);
    });

    it('works with empty array', () => {
      const result = generateCustomers([]);
      const expected = [];
      expect(result).toEqual(expected);
    });

    it('throws error if argument is not defined', () => {
      expect(generateCustomers).toThrow();
    });
  });
  describe('calculateRoomUsage', () => {
    it('calculates total usage based on settledCustomers argument', () => {
      const result = calculateRoomUsage(settledCustomers);
      const expected = {
        economy: {
          total: 2,
          value: 45
        },
        premium: {
          total: 3,
          value: 363
        }
      };

      expect(result).toEqual(expected);
    });

    it('works with empty array', () => {
      const result = calculateRoomUsage([]);
      const expected = {
        economy: {
          total: 0,
          value: 0
        },
        premium: {
          total: 0,
          value: 0
        }
      };
      expect(result).toEqual(expected);
    });

    it('throws error if argument is not defined', () => {
      expect(calculateRoomUsage).toThrow();
    });
  });
  describe('settleCustomers', () => {
    it('settles customers based on payments', () => {
      const customers = generateCustomers(payments);
      const settledCustomers = settleCustomers(customers, {
        economy: 3,
        premium: 3
      });
      const result = calculateRoomUsage(settledCustomers);
      const expected = {
        premium: {
          total: 3,
          value: 738
        },
        economy: {
          total: 3,
          value: 167
        }
      };
      expect(result).toEqual(expected);
    });

    it('settles customers correctly in case of upgrade option', () => {
      const customers = generateCustomers(payments);
      const settledCustomers = settleCustomers(customers, {
        economy: 1,
        premium: 9
      });
      const result = calculateRoomUsage(settledCustomers);
      const expected = {
        premium: {
          total: 9,
          value: 1221
        },
        economy: {
          total: 1,
          value: 22
        }
      };
      expect(result).toEqual(expected);
    });
  });
});
