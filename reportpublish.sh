#!/bin/bash
branchName="$(git branch | grep \* | cut -d ' ' -f2 )"
unique=$(date +"%d_%m_%y_Time_%H_%M_%S")
publishFolder=$branchName"_"$unique
echo $publishFolder 
tar -czvf $publishFolder.tar.gz coverage screenshot
curl -i -F name=file -F file=@$publishFolder.tar.gz $1
