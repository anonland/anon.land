import { TimestampToDatePipe } from './timestamp-to-date.pipe';

describe('TimestampToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new TimestampToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
