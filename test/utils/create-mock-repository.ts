import { Repository } from 'typeorm';

export type MockObject<T> = Partial<Record<keyof T, jest.Mock>>;
export type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

export const createMockRepository = <T>(): MockRepository<T> => {
  return {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };
};
