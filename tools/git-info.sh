#!/bin/sh

# Get current branch name or CI var
branch=$(git symbolic-ref --short HEAD 2>/dev/null)
if [ -z "$branch" ]; then
    branch=$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME
fi

# Get the commit SHA or CI var
commit=$(git rev-parse HEAD 2>/dev/null)
if [ -z "$commit" ]; then
    commit=$COMMIT_SHA
fi

json="{ \"currentBranch\": \"$branch\", \"commitSHA\": \"$commit\" }"
echo $json

exit 0 
