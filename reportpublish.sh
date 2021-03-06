#!/bin/bash
branchName=$2
url=$1
zipUrl=$3
commitMessage=$8

unique=$(date +"%d_%m_%y_Time_%H_%M_%S")
publishFolder=$branchName"_"$unique

rm -rf ./reports
rm -rf ./scrTemplate
rm -rf ./css
rm -rf ./js
rm -rf ./index.html

curl $zipUrl | tar xz

cp -rf ./reports/css ./css
cp -rf ./reports/js ./js
cp -rf ./reports/index.html ./index.html

cp -rf ./scrTemplate/css ./screenShots/css
cp -rf ./scrTemplate/js ./screenShots/js
cp -rf ./scrTemplate/images ./screenShots/images
cp -rf ./scrTemplate/index.html ./screenShots/index.html

tar -czvf $publishFolder.tar.gz coverage screenShots unittest coverageTest ./css ./js ./index.html

curl -i -F name=file -F file=@$publishFolder.tar.gz $url"/cgi-bin/upload.py"
replace=$publishFolder
reportUrl=$url"/"$replace
subject="Client Report - React - $publishFolder"
msg="<p><b>Report URL - <a href='$reportUrl'>Link</a></b></p>
<p><b>Report Branchname - $branchName</b></p>
<p><b>Report Unique ID - $unique</b></p>
<p><b>Report Developer - $6</b></p>
<p><b>Report commitMessage - $commitMessage</b></p>"
#node mailSender.js <from> <pass> <to> <subject> <text>
node ./node_modules/fz-react-cli/lib/mailSender $4 $5 $6 "$subject" "$msg" $7
