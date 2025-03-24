export const OwnFlexShifts = [
  // { id: "AM", description: "6h às 10h", limit: { h: 11, d: -1 } },
  { id: "PM", description: "15:30h às 18h", exclude: [0] },
];

export const LastMileShifts = [
  { id: "AM", description: "AM" },
  { id: "PM", description: "PM" },
  { id: "SD", description: "SD" },
];

export const FirstTripShifts = [
  { id: "AM", description: "De 6AM a 9AM" },
  { id: "PM", description: "De 14PM a 18PM" },
];
