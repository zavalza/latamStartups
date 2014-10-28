#!/usr/bin/env python
from urllib2 import Request, urlopen, URLError
import json
def getTagId():
	searchRequest = Request('https://api.angel.co/1/search/slugs?query=monterrey')
	try:
		response = urlopen(searchRequest)
		tag = response.read()
		data = json.loads(tag)
		print data['id']
		return data['id']
	except URLError, e:
    		print 'No tags. Got an error code:', e

try:
	tagId = getTagId()
	startupRequest = Request('https://api.angel.co/1/tags/'+str(tagId)+'/startups')
	response = urlopen(startupRequest)
	startups = response.read()
	print startups[0:5000]

except URLError, e:
    print 'No results. Got an error code:', e