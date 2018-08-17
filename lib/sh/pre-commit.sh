#!/bin/sh

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\.(js)$") # Get staged files

CURRENT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p') # Get branch name

echo "Branch Name - $CURRENT_BRANCH"

if [[ "$STAGED_FILES" = "" ]]; then
  exit 0
fi

IS_FAILED=false
FILES=""

for FILE in $STAGED_FILES # Add files with space separation
do
	FILES+="$FILE "
done

npm run lint $FILES # Run ESLint

if [[ "$?" != 0 ]]; then
	IS_FAILED=true
fi

if $IS_FAILED; then
  echo "\033[41mCOMMIT FAILED:\033[0m Your commit contains files that should pass ESLint but do not. Please fix the ESLint errors and try again.\n"
  exit 1
else
  echo "\033[42mCOMMIT SUCCEEDED\033[0m\n"
fi

exit $?
