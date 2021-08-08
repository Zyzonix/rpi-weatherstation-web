# Webinterface for Zyzonix/rpi-weatherstation

[![Version](https://img.shields.io/badge/Project%20version-0.9-orange)]() 
[![Python-Version](https://img.shields.io/badge/Python-3.7.3-blue)]()
[![HTML-Version](https://img.shields.io/badge/HTML-5-blue)]()
[![Node-Version](https://img.shields.io/badge/Node-v14.17.2-blue)]()
[![NPM-Version](https://img.shields.io/badge/NPM-6.14.13-blue)]()
[![Last updated](https://img.shields.io/badge/Last%20updated-08/08/2021-orange)]()
[![Development completed](https://img.shields.io/badge/Development%20completed-true-green)]() 
[![Tests passed](https://img.shields.io/badge/Tests%20passed-false-red)]()


Webinterface for Zyzonix/rpi-weatherstation build with React (frontend) and Python3 (backend).

### Table of content
* [Requirements](#requirements)
* [Installation](#installation)
* [Controlling](#controlling)
* [About the project](#about-the-project)

### Requirements
This software was designed for Linux-based systems.
- Python3.6+
- Node
- NPM


### Installation:
**Please note that all python commands must be run in Python3.6+! (The backend-server requires Python3.6+) Python3.7 is recommmended, check your pythonversion using:**
```
$ python3 --version
```

Firstly clone this repository to your device using git and this command:
```
$ git clone https://github.com/Zyzonix/rpi-weatherstation-web.git
$ cd rpi-weatherstation-web/
```
Run the setup script as root:
##### Please notice, that all required commands are accessible through make.
PLEASE NOTE: this part is not finished yet! --> no automated installation available
```
$ sudo make install
```


### Controlling

Please keep in mind that the software can only function properly, if backend- and frontend-server are running. It is recommended to use the commands from the table below. 
##### General commands:
Command | Description
--- | ---
``` $ sudo make install ``` | Installs the software and it's services
``` $ sudo make uninstall ``` | Removes the whole software including all services from the device 
``` $ sudo make start-all ``` | Starts all required services
``` $ sudo make stop-all ``` | Stops all required services
``` $ sudo make enable-all ``` | Enables all required services
``` $ sudo make disbale-all ``` | Disables all required services

The following two tables are for an individual control (not recommended)
##### Backend commands:
Command | Description
--- | ---
``` $ sudo make start-backend ``` | Starts the backend-service (not required if the service is enabled)
``` $ sudo make backend-check ``` / ``` $ sudo make backend-status ``` | Shows the status of the backend-service
``` $ sudo make stop-backend ``` | Stops the backend-service
``` $ sudo make enable-backend ``` | Enables autostart at boot
``` $ sudo make disable-backend ``` | Disables autostart at boot

##### Frontend commands:
Command | Description
--- | ---
``` $ sudo make start-frontend ``` | Start the frontend-service (not required if the service is enabled)
``` $ sudo make frontend-check ``` / ``` $ sudo make frontend-status ``` | Shows the status of the frontend-Server
``` $ sudo make stop-frontend ``` | Stops the frontend-service
``` $ sudo make enable-frontend ``` | Enables autostart at boot
``` $ sudo make disable-frontend ``` | Disables autostart at boot

##### storageSync commands:
Command | Description
--- | ---
``` $ sudo make start-sync ``` | Start the frontend-service (not required if the service is enabled)
``` $ sudo make sync-check ``` / ``` $ sudo make sync-status ``` | Shows the status of the frontend-Server
``` $ sudo make stop-sync ``` | Stops the frontend-service
``` $ sudo make enable-sync ``` | Enables autostart at boot
``` $ sudo make disable-sync ``` | Disables autostart at boot

### About the project
This software is part of a school project developed by Zyzonix. It's goal was the development of an executeable software, that can retrieve environmental data, write these datasets into databases (1st pt.) and display the stored data into graphs on a webserver (2nd pt.). 
(This repository only contains the second part, the weather station software won't be published here within this repository, it can be found under Zyzonix/rpi-weatherstation)

README-version: 0.4
