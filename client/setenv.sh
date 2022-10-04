clientEnv='';
if [ "$1" = 'prod' ]; then
  clientEnv='prod';
else
  clientEnv='dev';
fi;
cp "./src/keys/client.$clientEnv.js" "./src/keys/client.js"

# Check if last mod date is different
#  AND if env has changed
#  IF NOT: skip firebase config setting
if [ $(stat -f '%c' ./src/keys/firebase-config.js) = $(cat ./src/keys/firebase-config.lastmodified-time.txt) ]; then
  if [ $(cat ./src/keys/env.last-used.txt) = $clientEnv ]; then
    echo 'no changes to firebase config';
    exit;
  fi
fi

firebase apps:sdkconfig 2>/dev/null | sed -e 's/});/};/' -e 's/firebase.initializeApp({/export default {/' > ./src/keys/firebase-config.js

echo $(stat -f '%c' ./src/keys/firebase-config.js) > ./src/keys/firebase-config.lastmodified-time.txt
echo $clientEnv > ./src/keys/env.last-used.txt