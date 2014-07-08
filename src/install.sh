1#!/bin/bash

echo "Checking node"
node_path=`which node`
if [ "$node_path" == "" ]; then
	echo "Installing node"
	sudo apt-get install node
fi

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

echo "Checking pip"
pip_path=`which pip`
if [ "$pip_path" == "" ]; then
	echo "Installing pip"
	sudo apt-get install python-pip
fi

echo "Installing required python packages"
sudo pip install dataset gmusicapi > /dev/null
echo "Installing required node packages"
sudo npm install > /dev/null
echo "Installation complete"