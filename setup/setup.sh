#
# written by @author ZyzonixDev
# published by ZyzonixDevelopments 
# -
# date      | 01/08/2021
# type      | ShellScript
# -
# file      | setup/setup.sh
# project   | rpi-weatherstation-web
# version   | 0.4.0
# 
echo
echo
echo -------------------
echo started SHELL setup
echo -------------------
echo updating...
echo -------------------
sudo apt update
echo
# installing python3 (req: 3.5)
echo --------------------
echo checking for python3
echo --------------------
sudo apt install python3
# checking if python packages are installes
echo
echo -------------------
echo installing packages
echo -------------------
pip3 install fastapi
pip3 install uvicorn
pip3 install configparser

# installing serve-environment for final build
echo
echo --------------------
echo installing npm-serve
echo --------------------
sudo npm install serve

# pasting service into correct directory
echo
echo ----------------------------------------------
echo copying system-services into correct directory
echo ----------------------------------------------
_cur_dir=$PWD
sudo cp $_cur_dir/setup/WS-web_frontendServer.service /lib/systemd/system/
echo done $_cur_dir/setup/WS-web_frontendServer.service copied
sudo cp $_cur_dir/setup/WS-web_backendServer.service /lib/systemd/system/
echo done $_cur_dir/setup/WS-web_backendServer.service copied
sudo cp $_cur_dir/setup/WS-web_storageSync.service /lib/systemd/system/
echo done $_cur_dir/setup/WS-web_storageSync.service copied

# shows status of system services
echo
echo --------------------
echo statuses of services 
echo --------------------
fe=$(sudo systemctl status WS-web_frontendServer.service)
echo $fe
be=$(sudo systemctl status WS-web_backendServer.service)
echo $be
se=$(sudo systemctl status WS-web_storageSync.service)
echo $se

# confirming setup
echo
echo ---------------
echo Setup completed
echo ---------------