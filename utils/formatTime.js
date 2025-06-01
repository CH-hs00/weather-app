// utils/formatTime.js

/**
 * ISO 8601 또는 "YYYY-MM-DD HH:MM:SS" 형태의 문자열을 받아서
 * "HH:MMam" 또는 "HH:MMpm" 형식(시를 항상 두 자리로 pad)으로 반환합니다.
 */
function formatDisplayTime(timeStr) {
  const [, hm] = timeStr.split(' ');     // ex) ["2025-06-01", "05:24:00"]
  const [hh, mm] = hm.split(':');        
  let hourNum = parseInt(hh, 10);        

  const ampm = hourNum >= 12 ? 'pm' : 'am';
  if (hourNum === 0) {
    hourNum = 12;
  } else if (hourNum > 12) {
    hourNum = hourNum - 12;
  }

  const hourPadded = String(hourNum).padStart(2, '0');
  const minutePadded = String(parseInt(mm, 10)).padStart(2, '0');

  return `${hourPadded}:${minutePadded}${ampm}`;
}

module.exports = { formatDisplayTime };
