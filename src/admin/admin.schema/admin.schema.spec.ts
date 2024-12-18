import { AdminSchema } from './admin.schema';

describe('AdminSchema', () => {
  it('should be defined', () => {
    expect(new AdminSchema()).toBeDefined();
  });
});
