# UAL-TER-C2
Unmanned Aircraft Life - Terminal C2
Drone software written on NodeJS with Johnny-Five using Raspberry Pi 3 and Arduino.

## States and Modules
States | Modules | Comm Input
------ | ------- | ----------
target.engines (fl,fr,bl,br) | Engines Controller | No
target.steering (roll,pitch,yaw,throttle) | Steering Translation System | Direct Joystick
target.attitude (roll,pitch,heading,verticalSpeed) | Stability Augmentation System | Attitude from Joystick
target.movement (horizontalSpeed,heading,verticalSpeed) | Advanced Flight System | Arcade like Joystick
target.position (lattitude,longitude,altitude) | Navigation System | Map Waypoints

### Helper modules
+ Measurement Processor System (used by SAS, AFS and Nav System)
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

## Objetives 

### Initialization modes
+ Normal
+ Simulation (mocks all sensors and engines).

### Broadcast status
#### Basic Sensors information
+ Camera streaming
+ Altitude
+ IMU (all axis orientation)
+ Proximity (all axis obstacles)
+ DC Voltage
+ GPS (lat/long/altitude coordinates)
+ Indoor position (wifi triangulation)

#### Real-time processed information
+ Proximity alert
+ Low-bat alert
+ Relative movement
+ Indoor map

#### On-demand information
+ Modules initialization
+ Modules status
+ Entire snapshot status
+ Debug mode
+ Logs

### Receive commands
#### Miscellaneous
+ System restart/shutdown
+ Emergency cut-off engines
+ Basic camera/lights on/off commands

#### Complete Manual Flight
+ Basic direct-Joystick commands such as x,y,z and thottle values directly translated to engines.

#### Assisted Manual Flight
+ Advanced flight attitudes such as heading, roll, pitch and altitude values.
+ Automatic reactions to prevent crash using proximity sensors.
+ Action commands such as maintain vertical/horizontal speed.
+ More advanced commands such as take-off, landing, hover.
+ Emergency hover.
 
#### Navigation Mode
+ Navigation commands such as GoTo (lattitude/longitude/altittude).
+ Navitation commands using waypoints.
+ Follow command.
