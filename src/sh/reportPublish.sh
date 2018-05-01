#!/bin/bash
branchName=$2
url=$1
unique=$(date +"%d_%m_%y_Time_%H_%M_%S")
publishFolder=$branchName"_"$unique
echo $publishFolder
cp -r ./node_modules/fz-react-cli/templates/reports/ ./reports
tar -czvf $publishFolder.tar.gz coverage screenShots unittest reports
curl -i -F name=file -F file=@$publishFolder.tar.gz $url"/cgi-bin/upload.py"
replace=$publishFolder'/reports'
reportUrl=$url"/"$replace
subject="Build report - $publishFolder"
msg="<p><b>report url - <a href='$reportUrl'>Link</a></b></p>
<p><b>Report branchName - $branchName</b></p>
<p><b>Report unique id - $unique</b></p>"
#node mailSender.js <from> <pass> <to> <subject> <text>
node ./node_modules/fz-react-cli/lib/mailSender $3 $4 $5 "$subject" "$msg"
