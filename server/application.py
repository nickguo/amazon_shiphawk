import os
import tornado.web
import amazon
import json

class HelloHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("hello world")

class URLRequest(tornado.web.RequestHandler):
    def post(self):
        url = self.get_argument('url', '')
        print url
        data = amazon.AmazonPrice(url)
        print data

        self.write(data)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", HelloHandler),
            (r"/get_info", URLRequest)
        ];

        # start tornado
        tornado.web.Application.__init__(self, handlers, debug=True)
