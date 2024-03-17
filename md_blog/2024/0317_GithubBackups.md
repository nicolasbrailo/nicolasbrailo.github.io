# Backup your Github repos

@meta publishDate 2024-03-17
@meta author Nico Brailovsky
@meta tags Bash

I try to back up all my online accounts, in case a provider ceases to exist, or one of my accounts is banned for (unknowingly) breaking terms-of-service. The other day I figured I wasn't doing that with Github, so I wrote [a script to back up all my (or any user's) repos automatically](https://github.com/nicolasbrailo/Nico.rc/blob/master/github.backup.sh). The gist is:

```bash
wget -q "https://api.github.com/users/$USER/repos" -O- > idx.json
for repo in $( cat idx.json | jq '.[].ssh_url' ); do
  git clone --recurse-submodules "$repo"
done
```

This will clone all *PUBLIC* repos to a local computer, from which you can tar.gz and upload to your preferred archive medium.

