#ifndef CONFIG_H
#define CONFIG_H

// ─── WiFi ─────────────────────────────────────────────────────────────────────
#define WIFI_SSID      "Wirespot"
#define WIFI_PASSWORD  "W12345678T"

// ─── Backend ──────────────────────────────────────────────────────────────────
// Replace with your deployed backend URL.
// Render example: "https://your-app.onrender.com/api/readings"
#define SERVER_URL     "https://smartbin-be.onrender.com/api/readings"
#define DEVICE_API_KEY "sb_4e8a1f3c9b2d6e0f5a7c3b8d1e4f2a9c"

// ─── Bin ──────────────────────────────────────────────────────────────────────
#define BIN_ID         "BIN-001"
#define BIN_HEIGHT_CM  18.0f  // Physical interior height of the bin in centimetres

// ─── Pins (NodeMCU ESP8266) ───────────────────────────────────────────────────
// HC-SR04 ultrasonic sensor
#define TRIG_PIN  D5  // GPIO12 → HC-SR04 TRIG
#define ECHO_PIN  D6  // GPIO13 → HC-SR04 ECHO

// External LED (connect anode to pin through a 220Ω resistor, cathode to GND)
#define LED_PIN   D2  // GPIO4

// ─── Timing ───────────────────────────────────────────────────────────────────
#define READ_INTERVAL_MS   10000UL  // Interval between readings (10 seconds)
#define BLINK_INTERVAL_MS  200      // LED blink half-period during events

// ─── Sensor ───────────────────────────────────────────────────────────────────
#define SOUND_SPEED_CM_US  0.034f   // Speed of sound in cm/µs at ~20°C
#define PULSE_TIMEOUT_US   30000UL  // pulseIn timeout (≈ 510 cm max range)

#endif  // CONFIG_H
