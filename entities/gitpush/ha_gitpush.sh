#       _ _                  _                 _      _   
#  __ _(_) |_   _ __ _  _ __| |_    ___ __ _ _(_)_ __| |_ 
# / _` | |  _| | '_ \ || (_-< ' \  (_-</ _| '_| | '_ \  _|
# \__, |_|\__| | .__/\_,_/__/_||_| /__/\__|_| |_| .__/\__|
# |___/        |_|                              |_|       
#--FROM https://github.com/smcnab1/op-question-mark
#---Script to push regular commit to github repo to keep it up to date.

# Go to /config folder
cd /config

# Add all files to the repository with respect to .gitignore rules
git add .

# Commit changes with message with current date stamp
git commit -m "config files on `date +'%d-%m-%Y %H:%M:%S'`"

# Push changes towards GitHub
git push -u origin master
