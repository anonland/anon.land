import { BypassSanitizerPipe } from './bypass-sanitizer.pipe';

describe('BypassSanitizerPipe', () => {
  it('create an instance', () => {
    const pipe = new BypassSanitizerPipe();
    expect(pipe).toBeTruthy();
  });
});
