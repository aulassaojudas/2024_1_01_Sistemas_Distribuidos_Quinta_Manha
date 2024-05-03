import { JwtAuthGuardStrategy } from './jwt-auth.guard.strategy';

describe('JwtAuthGuardStrategy', () => {
  it('should be defined', () => {
    expect(new JwtAuthGuardStrategy()).toBeDefined();
  });
});
