#!/bin/bash

# NodeJS check
echo "Checking node"
node_path=`which node`
if [ "$node_path" == "" ]; then
	echo "Installing node"
	wget http://node-arm.herokuapp.com/node_latest_armhf.deb 
	sudo dpkg -i node_latest_armhf.deb
	rm node_latest_armhf.deb
fi

# Python check
echo "Checking Python"
case "$(python --version 2>&1)" in
    *" 3."*)
        ;;
    *" 2.7"*)
        ;;
    *)
		echo "Installing Python"
		sudo apt-get install python
		;;	
esac

# Pyp check
echo "Checking pip"
pip_path=`which pip`
if [ "$pip_path" == "" ]; then
	echo "Installing pip"
	sudo apt-get install python-pip
fi

sudo apt-get install g++ libasound2-dev

echo "Installing required python packages"
sudo pip install dataset gmusicapi > /dev/null
echo "Installing required node packages"
sudo npm install -g node-gyp
sudo npm install --unsafe-perm > /dev/null
echo "Installation complete"