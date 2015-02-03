import os
import tornado.httpserver
import tornado.ioloop
import tornado.web
import application

def main():
    app = application.Application()
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(3000)
    tornado.ioloop.IOLoop.instance().start();

# only start the server if this webapp file is being executed
if __name__ == "__main__":
    main()
