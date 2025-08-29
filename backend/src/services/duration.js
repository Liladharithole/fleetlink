export function estimateHours(fromPincode, toPincode) {
  const a = Math.abs(parseInt(toPincode, 10) - parseInt(fromPincode, 10));
  return a % 24; // placeholder as per task spec
}
