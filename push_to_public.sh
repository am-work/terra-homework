branch=$(git branch --show-current)
git push internal $branch
ssh github-bridge /bin/bash << EOF
  cd ~/code/github.com/lh265/terra_example_contracts
  git fetch internal
  git checkout internal/$branch
  git push public HEAD:$branch
EOF