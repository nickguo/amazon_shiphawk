import os
import sys

import tornado.web
import json

from server import amazon
from server import shiphawk

class URLRequest(tornado.web.RequestHandler):
    def post(self):
        url = self.get_argument('url', '')
        from_zip = self.get_argument('url', '')

        print url
        data = amazon.AmazonPrice(url)

        data['fromZip'] = 92130
        data['toZip'] = 94102

        data['price'] = float(data['price'][1:])

        print data

        sh_price = shiphawk.ShiphawkPrice([data])

        data['sh_price'] = sh_price

        self.write(data)

class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("test.html")

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", HomeHandler),
            (r"/get_info", URLRequest)
        ]

        settings = dict(
            template_path = os.path.join(os.path.dirname(__file__), "public"),
            static_path = os.path.join(os.path.dirname(__file__), "public")
        )

        # start tornado
        tornado.web.Application.__init__(self, handlers, **settings)
