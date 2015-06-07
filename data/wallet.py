#!/usr/bin/python
import requests
import re
import json
import operator
from lxml import etree
import sys
import time
import datetime

# ---------------------------------------------

if (len(sys.argv) != 4):
    print sys.argv[0] + " <keyID> <vCode> <wallet>"
    sys.exit(1)

api_keyid = sys.argv[1]
api_vcode = sys.argv[2]
wallet = sys.argv[3]

# ---------------------------------------------

req = requests.get('https://api.eveonline.com/corp/AccountBalance.xml.aspx?keyID=' + api_keyid + "&vCode=" + api_vcode)
root = etree.fromstring(req.text.encode("utf-8"))

balance = 0

rows = root.xpath("/eveapi/result/rowset/row")
for row in rows:
	if (row.xpath("@accountKey")[0] != wallet):
	    continue
	balance = row.xpath("@balance")[0]

#--------------------------------------------------

json_stats = {
	"balance": balance,
	"time": datetime.datetime.utcfromtimestamp(time.time()).strftime('%Y-%m-%dT%H:%M:%SZ'),
}

f = open("../webroot/stats_current.json",'w')
json.dump(json_stats, f)
f.close()
