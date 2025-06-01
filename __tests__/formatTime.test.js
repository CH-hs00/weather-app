// __tests__/formatTime.test.js

const { formatDisplayTime } = require('../utils/formatTime');

describe('formatDisplayTime 함수 단위 테스트', () => {
  test('00:00 (자정) → 12:00am', () => {
    const result = formatDisplayTime('2025-06-01 00:00:00');
    expect(result).toBe('12:00am');
  });

  test('오전 5시 4분 (5:04) → 05:04am', () => {
    const result = formatDisplayTime('2025-06-01 05:04:00');
    expect(result).toBe('05:04am');
  });

  test('정오 12:00 → 12:00pm', () => {
    const result = formatDisplayTime('2025-06-01 12:00:00');
    expect(result).toBe('12:00pm');
  });

  test('오후 15시 5분 (15:05) → 03:05pm', () => {
    const result = formatDisplayTime('2025-06-01 15:05:00');
    expect(result).toBe('03:05pm');
  });

  test('오후 23시 59분 (23:59) → 11:59pm', () => {
    const result = formatDisplayTime('2025-06-01 23:59:00');
    expect(result).toBe('11:59pm');
  });

  test('한 자리 시, 분이 같이 있을 때 (예: 7:2 → 07:02am)', () => {
    const result = formatDisplayTime('2025-06-01 07:02:00');
    expect(result).toBe('07:02am');
  });
});
