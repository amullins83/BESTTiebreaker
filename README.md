#BEST Tiebreaker for Raspberry Pi

This project seeks to define GPIO-based tiebreaker field control for the annual BEST robotics tournament. There are two simultaneous subsystems to implement: IO switch order capture and TCP server.

##IO Order Capture

The basic idea for now is to poll each of 4 GPIO pins until each has entered the ON state and record the order in which each pin switched on. Ideally the order of the pin checks would be random to prevent deterministic bias toward any pin.

##TCP Server

When the program receives a "QRY" request over TCP, the current status of the switches should be reported in an XML document, the format of which is described elsewhere. When an "RST" request is received, the switch polling should restart and all rank orders reset.

