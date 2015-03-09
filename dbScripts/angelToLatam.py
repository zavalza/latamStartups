#!/usr/bin/env python
from urllib2 import Request, urlopen, URLError
import json
import httplib

startups = open('startups.json')
data = json.load(startups) 
print data['startups']

for startup in data['startups']:
	#print startup
	for key,value in startup.items():
		print key, value