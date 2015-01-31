import requests
import json

def main():
    url = 'https://stage.shiphawk.com/api/v1/rates/full?api_key=b230a747c492a66dd7d47b5f9b9dcf26'
   # url = "http://54.68.34.231:8000"
    fromZip = 92130
    toZip = 90024
    width = 100
    height = 100
    length = 100
    weight = 100
    value = 500
    itemId = getItem("table")
    packed = False
    
    itemData=[{'width':float(width), 'length':float(length),'height':float(height), 'weight': float(weight), 'value': value, 'id': itemId, 'packed' : packed}] 

    data = {'from_zip' : str(fromZip),'to_zip' : str(toZip), 'items' : itemData}
    headers = {'Content-Type' : 'application/json'} 
    req = requests.post(url, data=json.dumps(data),headers=headers)
    print json.dumps(data)
    print req
    
    req = req.content
    json2 = json.loads(req)
    
    print json2
    print json2[0]['price']


def getItem(myStr):
    url = 'https://stage.shiphawk.com/api/v1/items/search/"' + myStr + '"?api_key=b230a747c492a66dd7d47b5f9b9dcf26'
    print url
    req = requests.get(url)
    req = req.content
   # print req
    json3 = json.loads(req)
   # print json3
    return json3[0]['id']

    
if __name__ == "__main__":
    main()

