/**
 * SmartBin Firmware
 * ESP8266 + HC-SR04 ultrasonic sensor + Status LED
 *
 * Measures bin fill level and POSTs the reading to the backend every
 * READ_INTERVAL_MS milliseconds.
 *
 * Required libraries (install via Arduino Library Manager):
 *   - ArduinoJson  (by Benoit Blanchon, v6.x)
 *
 * Built-in libraries (included with ESP8266 board package):
 *   - ESP8266WiFi
 *   - ESP8266HTTPClient
 *   - WiFiClientSecure
 *
 * LED behaviour:
 *   Blinking fast  → Connecting to WiFi
 *   Steady ON      → Connected and idle
 *   3 quick blinks → Transmitting a reading
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "config.h"

// ─── State ────────────────────────────────────────────────────────────────────
static unsigned long lastReadingTime = 0;

// ─── LED helpers ──────────────────────────────────────────────────────────────

/** Blink the LED `times` times then restore steady ON. */
void blinkLed(int times, int halfPeriodMs) {
  for (int i = 0; i < times; i++) {
    digitalWrite(LED_PIN, LOW);
    delay(halfPeriodMs);
    digitalWrite(LED_PIN, HIGH);
    if (i < times - 1) delay(halfPeriodMs);  // no trailing delay after last blink
  }
}

// ─── Sensor ───────────────────────────────────────────────────────────────────

/**
 * Fire the HC-SR04 and return the measured distance in centimetres.
 * Returns -1.0 on timeout (no echo / object out of range).
 */
float measureDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(4);  // slightly longer settle

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Wait for ECHO to go LOW first (in case it's stuck HIGH)
  // then measure the actual pulse
  long duration = pulseIn(ECHO_PIN, HIGH, PULSE_TIMEOUT_US);

  if (duration == 0) return -1.0f;
  
  // Sanity range check — HC-SR04 is rated 2cm–400cm
  float distance = (duration * SOUND_SPEED_CM_US) / 2.0f;
  if (distance < 2.0f || distance > 400.0f) {
    Serial.print("[Sensor] Out-of-range reading: ");
    Serial.println(distance);
    return -1.0f;
  }

  return distance;
}

// ─── Network ──────────────────────────────────────────────────────────────────

/** Block until WiFi is connected; blink LED while waiting. */
void connectWiFi() {
  Serial.print("[WiFi] Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));  // toggle — fast blink
    delay(BLINK_INTERVAL_MS);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("[WiFi] Connected — IP: ");
  Serial.println(WiFi.localIP());

  digitalWrite(LED_PIN, HIGH);  // Steady ON — connected
}

/**
 * POST the reading to the backend.
 * @return true on HTTP 201, false otherwise.
 */
bool sendReading(float distanceCm) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.begin(client, SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-api-key", DEVICE_API_KEY);

  // Build JSON payload
  StaticJsonDocument<128> doc;
  doc["binId"]      = BIN_ID;
  doc["distanceCm"] = roundf(distanceCm * 100.0f) / 100.0f;  // 2 d.p.

  String payload;
  serializeJson(doc, payload);

  Serial.print("[HTTP] POST → ");
  Serial.println(payload);

  int statusCode = http.POST(payload);
  http.end();

  Serial.print("[HTTP] Response code: ");
  Serial.println(statusCode);

  return statusCode == 201;
}

// ─── Setup ────────────────────────────────────────────────────────────────────
void setup() {
  // Serial.begin(115200);
  Serial.begin(9600);
  Serial.println("\n[SmartBin] Firmware starting...");

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(LED_PIN,  OUTPUT);
  digitalWrite(LED_PIN, LOW);  // Off until WiFi connects

  connectWiFi();
}

// ─── Loop ─────────────────────────────────────────────────────────────────────
void loop() {
  unsigned long now = millis();

  // Send on first boot (lastReadingTime == 0) and every READ_INTERVAL_MS after
  bool shouldRead = (lastReadingTime == 0) ||
                    (now - lastReadingTime >= READ_INTERVAL_MS);

  if (!shouldRead) return;

  lastReadingTime = now;

  // Measure
  float distance = measureDistanceCm();

  if (distance < 0.0f) {
    Serial.println("[Sensor] Error — no echo received. Check wiring.");
    return;
  }

  Serial.print("[Sensor] Distance: ");
  Serial.print(distance, 2);
  Serial.println(" cm");

  // Signal transmission start
  blinkLed(3, BLINK_INTERVAL_MS);

  // Send
  bool ok = sendReading(distance);

  if (ok) {
    Serial.println("[SmartBin] Reading sent successfully.");
  } else {
    Serial.println("[SmartBin] Failed to send reading.");
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WiFi] Connection lost — reconnecting...");
      connectWiFi();
    }
  }
}
