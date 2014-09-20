#!/bin/bash

#global variables
prodHost=ds063218.mongolab.com:63218
testHost=ds059509.mongolab.com:59509
prodDB=meteor
testDB=meteor_test
collections=('users' 'people' 'tags' 'impulses' 'companies' 'cfs._tempstore.chunks' 'cfs.images.filerecord' 'cfs_gridfs._tempstore.chunks' 'cfs_gridfs._tempstore.files' 'cfs_gridfs.images.chunks' 'cfs_gridfs.images.files')

#number of collections
amount=${#collections[@]}

# echo each element in array 
# for loop
for (( i=0;i<$amount;i++)); do
    echo ${collections[${i}]}
    mongoexport -h $prodHost -d $prodDB -c ${collections[${i}]} -u xxxx -p xxxx -o ${collections[${i}]}.json
done
for (( i=0;i<$amount;i++)); do
    echo ${collections[${i}]}
    mongoimport -h $testHost -d $testDB -c ${collections[${i}]} -u xxxx -p xxxx --file ${collections[${i}]}.json
done

