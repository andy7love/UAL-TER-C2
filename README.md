# UAL-TER-C2
Unmanned Aircraft Life - Terminal C2

Drone software written in NodeJS with Johnny-Five using Raspberry Pi 3 and Arduino.

Communication with client using UDP+TCP with a relay server using WebRTC.

Please visit wiki pages for more information about communication and modules: https://github.com/andy7love/UAL-TER-C2/wiki

For further information about the client please refer to: https://github.com/andy7love/UAL-TER-CLIENT

## States and Modules
States | Modules | Comm Input
------ | ------- | ----------
target.engines (fl,fr,bl,br) | Engines Controller | No
target.steering (roll,pitch,yaw,throttle) | Steering Translation System | Direct Joystick
target.attitude (roll,pitch,heading,throttle) | Stability Augmentation System | Attitude from Joystick
target.movement (horizontalSpeed,heading,verticalSpeed) | Advanced Flight System | Arcade like Joystick
target.position (lattitude,longitude,altitude) | Navigation System | Map Waypoints

### Helper modules
+ Measurement Processor System (used by AFS and Nav System)
+ Adaptive Maneuvers System (used by Advanced Flight System)
+ Obstacle Tracking System (used by Obstacle Avoidance System)
+ Obstacle Avoidance System (used by Advanced Flight System)
+ Indoor position (used by Nav System when indoor)

### Sensor modules
+ Camera
+ Altimeter
+ IMU
+ GPS
+ Proximity x6 (front,back,right,left,top,bottom)
+ DC Voltage

### Other modules
+ LEDs
