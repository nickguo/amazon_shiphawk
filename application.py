import os
import sys

import tornado.web
import json
import ast

from server import amazon
from server import shiphawk

class InfoHandler(tornado.web.RequestHandler):
    def post(self):
        print str(self)
        url = self.get_argument('url', '')
        data = amazon.AmazonPrice(url)

        if 'error' in data:
            self.write(data)
            return 

        print data
        self.write(data)

class ReqHandler(tornado.web.RequestHandler):
    def post(self):
        print str(self)
        urls = self.get_argument('urls', '')
        from_zip = self.get_argument('from_zip','')
        to_zip = self.get_argument('to_zip','')

        item_data_list = []

        print json.loads(self.request.body)

        #for url in urls:
            #data = amazon.AmazonPrice(url['url'])
            #data['from_zip'] = from_zip
            #data['to_zip'] = to_zip
            #item_data_list.append(data)


        #print item_data_list

        #sh_price = shiphawk.ShiphawkPrice(item_data_list) 


        # self.write({'sh_price': sh_price, 'items': item_data_list})
        self.write('test')

class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", HomeHandler),
            (r"/get_info", InfoHandler),
            (r"/submit_req", ReqHandler)
        ]

        settings = {
            "debug": True,
            "static_path": os.path.join(os.path.dirname(__file__), "static"),
            "template_path": os.path.join(os.path.dirname(__file__), "template"),
        }
        print settings['static_path']

        # start tornado
        tornado.web.Application.__init__(self, handlers, **settings)

