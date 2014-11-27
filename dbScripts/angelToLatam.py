#!/usr/bin/env python
from urllib2 import Request, urlopen, URLError
import json

startups = open('startups.json')
data = json.load(startups) 
print data['startups']