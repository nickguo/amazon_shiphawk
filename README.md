# amazon_shiphawk
Comparison between shipping an item on shiphawk and just buying it again from amazon

Runs on Python 2.7

## Install

First, you must install all packages like amazon-product-api:
```
pip install python-amazon-product-api
```
Make sure that you install all dependencies for python!! These include `tornado`, etc.

## Amazon Setup

Before use, move your amazon-product-api info into the home dir as an invis file:
```
mv amazon-product-api ~/.amazon-product-api
```
The `~/.amazon-product-api` should look like:
```
[Credentials]
access_key = 'my_access_key'
secret_key = 'my_secret_key'
associate_tag = 'my_associate_tag'
```
The above may be obtained from your AWS instance and your Amazon Affiliates accounts.

## Use
Once you finish, run a quick sanity check:
```
python script.py
```
The above should output some item dimension data and no error messages.

To start the server:
```
python webapp.py
```
