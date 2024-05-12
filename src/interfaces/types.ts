export interface Config {
  environment: string;
  port: string;
  databaseUrl: string;
}
export interface MyLocation {
  latitude: number;
  longitude: number;
}

export type MyParkingSpot = {
  userId: number;
  status: string;
  availabilityTime: boolean;
  departureTime: Date;
  price: number;
  region: String;
  subregion: String;
  location: MyLocation;
};

export type MyRequest = {
  userId: number;
  status: string;
  type: string;
  arrivalTime: Date;
  departureTime: Date;
  location: MyLocation;
  bid: number;
};

enum ListingStatus {
  Available,
  Occupied,
  Reserved,
  Unavailable,
}

enum RequestStatus {
  Completed,
  Cancelled,
  Matched,
  Searching,
}

enum RequestType {
  Instant,
  Scheduled,
  Bid,
}

enum TransactionType {
  Payment,
  Refund,
}

enum PaymentType {
  CreditCard,
  PayPal,
  ApplePay,
  BankTransfer,
  AccountBalance,
}
