#!/bin/bash
branchName="$(git branch | grep \* | cut -d ' ' -f2 )"
unique=$(date +"%d_%m_%y_Time_%H_%M_%S")
publishFolder=$branchName"_"$unique
echo $publishFolder
cp -r ./node_modules/fz-react-cli/reports/ ./reports
tar -czvf $publishFolder.tar.gz coverage screenShots unittest reports
curl -i -F name=file -F file=@$publishFolder.tar.gz $1
