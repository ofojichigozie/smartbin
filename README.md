# SmartBin

SmartBin is a full-stack waste monitoring solution that combines a real-time backend, a responsive dashboard, and ESP8266 firmware for sensor-based fill-level tracking.

## Project structure

- `smartbin-backend/` — Express + TypeScript API, MongoDB integration, authentication, and real-time socket support.
- `smartbin-frontend/` — React + Vite dashboard for viewing bin status, readings, and system insights.
- `smartbin-firmware/` — ESP8266 firmware for measuring distance with the HC-SR04 sensor and sending readings to the backend.

## Getting started

1. Set up the backend in `smartbin-backend/`.
2. Set up the frontend in `smartbin-frontend/`.
3. Configure and upload the firmware from `smartbin-firmware/`.

## Notes

- Each folder contains its own setup instructions and environment file template.
- Use the project-specific README files inside each directory for detailed development and deployment guidance.
