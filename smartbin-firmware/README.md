# SmartBin Firmware

This folder contains the ESP8266 firmware for the SmartBin project. It measures bin fill level with an HC-SR04 ultrasonic sensor and sends readings over HTTPS to your backend (including Render deployments).

## What is included

- ESP8266 + HC-SR04 ultrasonic sensor support
- Status LED feedback
- HTTPS POST to your backend using WiFiClientSecure
- ArduinoJson payload generation

## Prerequisites

1. Arduino CLI installed and available in your PATH.
2. NodeMCU ESP8266 board support installed.
3. The ArduinoJson library installed.
4. A USB cable connected to your ESP8266 board.

## 1) Install the required toolchain

Run these commands from the firmware folder:

```powershell
arduino-cli core update-index
arduino-cli core install esp8266:esp8266
arduino-cli lib install "ArduinoJson"
```

If you want to confirm the board is visible, run:

```powershell
arduino-cli board list
```

> On Windows, your NodeMCU board is often listed as a COM port such as COM3 or COM4.

## 2) Configure your device

Edit `config.h` and update these values:

- `WIFI_SSID`
- `WIFI_PASSWORD`
- `SERVER_URL` (for Render, use something like `https://your-app.onrender.com/api/readings`)
- `DEVICE_API_KEY`
- `BIN_ID`

Example:

```cpp
#define WIFI_SSID      "YourWiFiName"
#define WIFI_PASSWORD  "YourWiFiPassword"
#define SERVER_URL     "https://your-app.onrender.com/api/readings"
#define DEVICE_API_KEY "your_device_api_key"
#define BIN_ID         "BIN-001"
```

## 3) Compile the firmware

From the `smartbin-firmware` folder:

```powershell
arduino-cli compile --fqbn esp8266:esp8266:nodemcuv2 .
```

## 4) Upload the firmware to the ESP8266

Replace `COM3` with the COM port reported by `arduino-cli board list`:

```powershell
arduino-cli upload -p COM3 --fqbn esp8266:esp8266:nodemcuv2 .
```

## 5) Open the serial monitor

To view debug output from the board:

```powershell
arduino-cli monitor -p COM3 --fqbn esp8266:esp8266:nodemcuv2
```

You can stop the monitor with `Ctrl+C`.

## 6) Optional: use the Arduino IDE

If you prefer the Arduino IDE instead of the CLI:

1. Open `smartbin-firmware.ino` in the Arduino IDE.
2. Select Board: `NodeMCU 1.0 (ESP-12E Module)`.
3. Select the correct COM port.
4. Click Verify and Upload.
5. Open Serial Monitor at 115200 baud.

## Notes

- The firmware uses `WiFiClientSecure` so it can send readings over HTTPS to your Render backend.
- If your backend changes from HTTPS to HTTP, update `SERVER_URL` and the client type accordingly.
