-- Enable PostGIS extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users Table
CREATE TABLE users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CognitoID VARCHAR(255) UNIQUE, -- Integration with AWS Cognito
    AccountBalance DECIMAL CHECK (AccountBalance >= 0) DEFAULT 0
);

-- Enum for SpotStatus
CREATE TYPE SpotStatusType AS ENUM ('Available', 'Occupied', 'Reserved', 'Unavailable');

-- ParkingSpots Table with Geographic Partitioning by Region
CREATE TABLE parking_spots (
    SpotID SERIAL PRIMARY KEY,
    OwnerID INT NOT NULL REFERENCES users(UserID),
    Location GEOGRAPHY NOT NULL,
    Price DECIMAL NOT NULL,
    AvailablyStart TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    SpotStatus SpotStatusType NOT NULL,
    Region TEXT NOT NULL,
    SubRegion TEXT NOT NULL
) PARTITION BY LIST (Region); -- Partitioning by Region (e.g., city or state)

-- Enum for RequestStatus
CREATE TYPE RequestStatusType AS ENUM ('Completed', 'Cancelled', 'Matched', 'Searching');

-- Request for Parking spot at specific time and location
CREATE TABLE requests (
    RequestID SERIAL PRIMARY KEY,
    RequesterID INT NOT NULL REFERENCES users(UserID),
    RequestedLocation GEOGRAPHY NOT NULL,
    RequestedDate TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    DateOfRequest TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    RequestStatus RequestStatusType NOT NULL
) PARTITION BY RANGE(RequestedDate); -- Partitioning by RequestedDate

-- Matched parking spot with request
CREATE TABLE matches (
    MatchID SERIAL PRIMARY KEY,
    RequestID INT NOT NULL REFERENCES requests(RequestID),
    SpotID INT NOT NULL REFERENCES parking_spots(SpotID),
    MatchedDate TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE(MatchedDate); -- Partitioning by MatchedDate

-- Enum for TransactionType
CREATE TYPE TransactionType AS ENUM ('Payment', 'Refund');

-- Enum for PaymentType
CREATE TYPE PaymentType AS ENUM ('CreditCard', 'PayPal', 'ApplePay', 'BankTransfer');

-- Transactions Table
CREATE TABLE transactions (
    TransactionID SERIAL PRIMARY KEY,
    BuyerID INT NOT NULL REFERENCES users(UserID),
    SellerID INT NOT NULL REFERENCES users(UserID),
    MatchID INT NOT NULL REFERENCES matches(MatchID),
    Amount DECIMAL NOT NULL,
    TransactionType TransactionType NOT NULL,
    PaymentType PaymentType NOT NULL,
    TransactionDate TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE(TransactionDate); -- Partitioning by TransactionDate

-- Audit Logs Table
CREATE TABLE audit_logs (
    LogID SERIAL PRIMARY KEY,
    UserID INT NOT NULL REFERENCES users(UserID),
    Action TEXT NOT NULL,
    LogDate TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE(LogDate); -- Partitioning by LogDate


-- Indexes for improved query performance
-- CREATE INDEX idx_parking_spots_region ON parking_spots USING btree (Region);
-- CREATE INDEX idx_parking_spots_subregion ON parking_spots USING btree (SubRegion);
-- We will implement indexes later based on query performance analysis

