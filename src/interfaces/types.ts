// interfaces/types.ts
import { Transaction } from "@prisma/client";
export interface Config {
  environment: string;
  port: string;
  databaseUrl: string;
}
export interface MyLocation {
  latitude: number;
  longitude: number;
}

export type MyListing = {
  id: number;
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
  id: number;
  userId: number;
  status: string;
  type: string;
  arrivalTime: Date;
  departureTime: Date;
  relist: boolean;
  location: MyLocation;
  bid: number;
};

export type MyMatch = {
  matchId: number;
  requestId: number;
  listingId: number;
  matchedDate: Date;
  distance: number;
  request: MyRequest;
  listing: MyListing;
  transactions: Transaction[];
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
