import os
import tornado.web
import amazon
import json
import shiphawk

class HelloHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("hello world")

class URLRequest(tornado.web.RequestHandler):
    def get(self):
        url = self.get_argument('url', '')
        from_zip = self.get_argument('url', '')

        print url
        data = amazon.AmazonPrice(url)

        data['fromZip'] = 92130
        data['toZip'] = 94102

        data['price'] = float(data['price'][1:])

        print data

        sh_price = shiphawk.ShiphawkPrice(data)

        data['sh_price'] = sh_price

        self.write(data)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", HelloHandler),
            (r"/get_info", URLRequest)
        ];

        # start tornado
        tornado.web.Application.__init__(self, handlers, debug=True)
