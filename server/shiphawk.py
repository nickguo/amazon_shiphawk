import requests
import json

def ShiphawkPrice(params):

    url = 'https://stage.shiphawk.com/api/v1/rates/full?api_key=b230a747c492a66dd7d47b5f9b9dcf26'

    packed = False 
    itemData = []

    toZip = -1
    fromZip = -1

    for x in params:
        itemId = getItem(x['title'])
        print 'ITEMID: ', itemId
        fromZip = x['from_zip']
        toZip = x['to_zip']
        width = x['width']
        height = x['height']
        length = x['length']
        weight = x['weight']
        value = x['price']
        itemData.append({'width':float(width), 'length':float(length),'height':float(height), 'weight': float(weight), 'value': value, 'id': itemId, 'packed' : packed}) 

    data = {'rate-filter': 'consumer', 'from_zip' : str(fromZip),
            'to_zip' : str(toZip), 'items' : itemData}
    data = json.dumps(data)
    print data
    headers = {'Content-Type' : 'application/json'} 
    req = requests.post(url, data=data,headers=headers)
    
    req = req.content
    json2 = json.loads(req)

    if 'error' in json2:
        return -1

    return json2[0]['price']


def getItem(myStr):
    url = 'https://stage.shiphawk.com/api/v1/items/search/"' + myStr + '"?api_key=b230a747c492a66dd7d47b5f9b9dcf26'
    req = requests.get(url)
    req = req.content
    json3 = json.loads(req)
    return json3[0]['id']
    
