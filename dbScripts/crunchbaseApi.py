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
	#tagId = getTagId()
	#mexico and monterrey
	companyRequest = Request('http://api.crunchbase.com/v/2/organizations?organization_types=company&location_uuids=7268daaa389dc194116579bac2ff0617%2C308f292714b4d2d6be551d9ccab8426e&user_key=bea61d6448dc45d818b1648d7df25a79&page=1')
	response = urlopen(companyRequest)
	startups = response.read()
	print startups[0:5000]

except URLError, e:
    print 'No results. Got an error code:', e