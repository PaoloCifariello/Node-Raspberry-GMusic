import pickle, dataset, os, sys

from gmusicapi import Mobileclient
from parser import Parser

class LibraryManager:

    def __init__(self, path, username, password):
        self.parser = Parser()
        self.db_path = path
        
        self.GUSER = username
        self.GPASS = password
    

    # Remove old database and creates new one
        self.init_db(path)

    """ Delete old database and creates the new one """
    def init_db(self, path):
        try:
            os.remove(path)
        except OSError:
            pass

        data = self.get_data()

        self.db = dataset.connect('sqlite:////' + self.db_path)
        self.parser.parse(self.db, data)


    def get_data(self):
        mobileapi = Mobileclient()
        mobileapi.login(self.GUSER, self.GPASS)
        library = mobileapi.get_all_songs()
        mobileapi.logout()
		
        return library
      
if __name__ == "__main__":
    lM = LibraryManager(sys.argv[1], sys.argv[2], sys.argv[3])
    sys.exit(0)
