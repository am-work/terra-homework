branch=$(git branch --show-current)
ssh github-bridge /bin/bash << EOF
  cd ~/code/github.com/lh265/terra_example_contracts
  git fetch public
  git checkout public/$branch
  git push internal HEAD:$branch
EOF
git pull internal $branch