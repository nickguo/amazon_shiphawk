import requests
import json

def ShiphawkPrice(params, num):

    url = 'https://stage.shiphawk.com/api/v1/rates/full?api_key=b230a747c492a66dd7d47b5f9b9dcf26'
   # url = "http://54.68.34.231:8000"
    itemId = getItem(params['title'])
    fromZip = params['fromZip']
    toZip = params['toZip']
    width = params['width']
    

    height = params['height']
    length = params['length']
    weight = params['weight']
    value = params['price']
    
    packed = False

   packed = False 
   itemData = []
   for x in range(0,num-1)
       itemId = getItem(params[x]['type'])
       fromZip = params[x]['fromZip']
       toZip = params[x]['toZip']
       width = params[x]['width']
       height = params[x]['height']
       length = params[x]['length']
       weight = params[x]['weight']
       value = params[x]['price']
       itemData.append({'width':float(width), 'length':float(length),'height':float(height), 'weight': float(weight), 'value': value, 'id': itemId, 'packed' : packed}) 

    data = {'from_zip' : str(fromZip), 'to_zip' : str(toZip), 'items' : itemData}
    headers = {'Content-Type' : 'application/json'} 
    req = requests.post(url, data=json.dumps(data),headers=headers)
    print json.dumps(data)
    print req
    
    req = req.content
    json2 = json.loads(req)
    
    print json2
    print json2[0]['price']

    return json2[0]['price']


def getItem(myStr):
    url = 'https://stage.shiphawk.com/api/v1/items/search/"' + myStr + '"?api_key=b230a747c492a66dd7d47b5f9b9dcf26'
    print url
    req = requests.get(url)
    req = req.content
   # print req
    json3 = json.loads(req)
   # print json3
    return json3[0]['id']
    
