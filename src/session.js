// Transient, in-memory session intents (NOT persisted — must not survive reload).
// Home sets `autostart` when the user taps a "start a session" control so the
// Talk screen begins the voice call on arrival.
export const session = { autostart: false };
