module {
  /// Cross-cutting type aliases shared across the backend.
  ///
  /// QRNova generates QR codes entirely in the browser, so the backend holds
  /// no QR content and no user records. These aliases exist only to keep the
  /// interface stable for future optional features.
  public type Timestamp = Int;
  public type UserId = Principal;
};
