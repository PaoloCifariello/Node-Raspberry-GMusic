import pickle, dataset, os, sys

from gmusicapi import Mobileclient
from parser import Parser

import dataset

class LibraryManager:

    def __init__(self, path, username, password):
        self.parser = Parser()
        self.db_path = path
        
        self.GUSER = username
        self.GPASS = password
    

        # Remove old database and creates new one
        self.init_db(path)
        # Getting data from Google
        data = self.__get_data()
        # Insert data in DB
        self.parser.parse(self.db, data)
        # Export DB
        self.export()
            
        
    """ Delete old database and creates the new one """
    def init_db(self, path):
        try:
            os.remove(path + 'library.db')
        except OSError:
            pass

        self.db = dataset.connect('sqlite:////' + self.db_path + 'library.db')
        
    def export(self):
        tracks = self.db['tracks'].all()
        dataset.freeze(tracks, format='json', filename=self.db_path + 'tracks.json')

        artists = self.db['artists'].all()
        dataset.freeze(artists, format='json', filename=self.db_path + 'artists.json')

        albums = self.db['albums'].all()
        dataset.freeze(albums, format='json', filename=self.db_path + 'albums.json')
        
    def __get_data(self):
        mobileapi = Mobileclient()
        mobileapi.login(self.GUSER, self.GPASS)
        library = mobileapi.get_all_songs()
        mobileapi.logout()
		
        return library
      
if __name__ == "__main__":
    lM = LibraryManager(sys.argv[1], sys.argv[2], sys.argv[3])
    sys.exit(0)
