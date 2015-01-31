import os
import tornado.web

class HelloHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("hello world")

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", HelloHandler)
        ];

        # start tornado
        tornado.web.Application.__init__(self, handlers)
