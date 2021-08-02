#
# written by @author ZyzonixDev
# published by ZyzonixDevelopments 
# -
# date      | 01/08/2021
# type      | Makefile
# -
# file      | Makefile
# project   | rpi-weatherstation-web
# version   | 0.1.0
# 
# rd. to help menu
all: help


# initializing setup --> rd. to python script
install:
	@echo "installing rpi-weatherstation-web"
	@echo ""
	sudo ./setup/setup.sh
	
# removing all entries / files / folders [$(CURDIR) = getcwd()]
uninstall:
	@echo ""
	@echo "uninstalling rpi-weatherstation-web"
	@echo "--> errors are due to the uninstallation process"
	@echo ""
	make stop-all
	make disable-all
	sudo rm /lib/systemd/system/WS-web_frontendServer.service
	sudo rm /lib/systemd/system/WS-web_backendServer.service
	@echo ""
	@echo "---------------------------------------------------------------------------"
	@echo "uninstallation of rpi-weatherstation-web finished - removing last directory"
	@echo "---------------------------------------------------------------------------"
	@echo ""
#sudo rm -rf $(CURDIR)

# general control
start-all: start-backend start-frontend

stop-all: stop-backend start-frontend

enable-all: enable-backend enable-frontend

disable-all: disable-backend disable-frontend

# Crontrol backendServer
#
# starts backendserver manually (if disabled)
start-backend:
	@echo "starting weather station service"
	@echo
	sudo systemctl start WS-web_backendServer.service

# stops backendServer.service
stop-backend:	
	@echo "stopping weather station service"
	@echo ""
	sudo systemctl stop WS-web_backendServer.service

# installs backendServer.service
enable-backend:
	@echo ""
	@echo "Please keep in mind that the software will only work properly if both services are running!"
	@echo "--> to enable the whole software use: sudo make enable-all"
	@echo ""
	@echo "installing weather station service"
	@echo ""
	sudo systemctl enable WS-web_backendServer.service

# uninstalls backendServer.service
disable-backend:
	@echo ""
	@echo "Please keep in mind that the software will only work properly if both services are running!"
	@echo "--> to disable the whole software use: sudo make disable-all"
	@echo ""
	@echo "uninstalling weather station service"
	@echo ""
	sudo systemctl disable WS-web_backendServer.service

backend-status: backend-check
# checks the status of backendServer.service
backend-check: 
	@echo "checking weather station status"
	@echo ""
	@echo "the following error is due to the command - don't worry"
	@echo ""
	sudo systemctl status WS-web_backendServer.service

# -----------------------------------------------------------------
# Control frontend 
#
# starts frontend manually (if disabled)
start-frontend:
	@echo "starting livedataProvider service"
	@echo
	sudo systemctl start WS-web_frontendServer.service

# stops frontendServer.service
stop-frontend:	
	@echo "stopping livedataProvider service"
	@echo ""
	sudo systemctl stop WS-web_frontendServer.service

# installs frontendServer.service
enable-frontend:
	@echo ""
	@echo "Please keep in mind that the software will only work properly if both services are running!"
	@echo "--> to enable the whole software use: sudo make enable-all"
	@echo ""
	@echo "installing livedataProvider service"
	@echo ""
	sudo systemctl enable WS-web_frontendServer.service

# uninstalls frontendServer.service
disable-frontend:
	@echo ""
	@echo "Please keep in mind that the software will only work properly if both services are running!"
	@echo "--> to disable the whole software use: sudo make disable-all"
	@echo ""
	@echo "uninstalling livedataProvider service"
	@echo ""
	sudo systemctl disable WS-web_frontendServer.service

frontend-status: frontend-check
# checks the status of frontendServer.service
frontend-check: 
	@echo "checking livedataProvider status"
	@echo ""
	@echo "the following error is due to the command - don't worry"
	@echo ""
	sudo systemctl status WS-web_frontendServer.service

# Helpmenu
# prints all commands with an explanation
help:
	@echo ""
	@echo "-------------------------- [rpi-weatherstation-web - HELP] --------------------------"
	@echo ""
	@echo "------------------------------------ [General] --------------------------------------"
	@echo "- sudo make install................starts the setup script"
	@echo "- sudo make uninstall..............removes the software from this device"
	@echo ""
	@echo "[INFO] --> the next four commands are explained clearly in the README"
	@echo "- sudo make start-all..............starts all services"
	@echo "- sudo make stop-all...............stops all services"
	@echo "- sudo make enable-all.............enables all services"
	@echo "- sudo make disable-all............disables all services"
	@echo ""
	@echo "------------------------------------ [frontend] -------------------------------------"
	@echo "- sudo make start-frontend.........starts the system service"
	@echo "- sudo make stop-frontend..........stops the system service"
	@echo "- sudo make enable-frontend........installs the system service"
	@echo "- sudo make disable-frontend.......uninstalls the system service"
	@echo "- sudo make frontend-check.........shows the status of the station system service"
	@echo ""	
	@echo "------------------------------------- [backend] -------------------------------------"
	@echo "- sudo make start-backend..........starts the livedata service"
	@echo "- sudo make stop-backend...........stops the livedata service"
	@echo "- sudo make enable-backend.........installs the livedata service"	
	@echo "- sudo make disable-backend........uninstalls the livedata service"
	@echo "- sudo make backend-check..........shows the status of the livedata system service"
	@echo "-------------------------------------------------------------------------------------"
	@echo ""