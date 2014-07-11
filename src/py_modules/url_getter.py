import pygame, StringIO, sys, socket, os

from gmusicapi import Webclient, exceptions

class UrlGetter:
    
    def __init__(self, sck_path, user, passwd):
        pygame.init()
        pygame.mixer.init()

        self.sck_path = sck_path
        self.webapi = Webclient()
        self.socket = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)


        # Look if socket has been created
        try:
              os.remove(self.sck_path)
        except OSError:
              pass

            # GMusic login
        try:
            self.webapi.login(user, passwd)
        except:
            sys.stderr.write('Problem with authentication on Google server\n')

        self.init_socket()

    def init_socket(self):
        self.socket.bind(self.sck_path)
        self.socket.listen(3)
        
        while 1:
            conn, addr = self.socket.accept()
            self.manage_connection(conn)

    def manage_connection(self, conn):
		
        data = conn.recv(50)
                         
        if data:
            try:
                stream_url = self.webapi.get_stream_urls(data)
            except exceptions.CallFailure:
                conn.close()
                return
            
            conn.send(stream_url[0])
            print('url_getter.py: Ottenuta URL -> ' + stream_url[0])
        
        conn.close()

if __name__ == "__main__":
    url_getter = UrlGetter(sys.argv[1], sys.argv[2], sys.argv[3])
