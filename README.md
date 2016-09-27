# UAL-TER-C2
Unmanned Aircraft Life - Terminal C2

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
