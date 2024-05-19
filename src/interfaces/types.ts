// interfaces/types.ts
import { Transaction } from "@prisma/client";
export interface Config {
  environment: string;
  port: string;
  databaseUrl: string;
  supabaseUrl: string;
  supabaseKey: string;
  supabaseJWT: string;
}
export interface MyLocation {
  latitude: number;
  longitude: number;
}

export type MyListing = {
  id: number;
  userId: number;
  status: Status;
  starttime: Date;
  departureTime: Date;
  price: number;
  region: String;
  subregion: String;
  location: MyLocation;
  match?: MyBestMatch;
};
export type MyBestMatch = {
  id: number;
  distance: number;
  availabilityStart?: Date;
};

export type MyRequest = {
  id: number;
  userId: number;
  status: Status;
  type: string;
  starttime: Date;
  departureTime: Date;
  relist: boolean;
  location: MyLocation;
  bid: number;
  match?: MyBestMatch;
};

export type MyMatch = {
  id: number;
  requestId: number;
  listingId: number;
  matchedDate: Date;
  distance: number;
  // request: MyRequest;
  // listing: MyListing;
  // transactions: Transaction[];
};

enum Status {
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
