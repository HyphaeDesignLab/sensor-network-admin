clientEnv="$1";
cp "./src/keys/client/$clientEnv.js" "./src/keys/client.js"

# Check if last mod date is different
#  AND if env has changed
#  IF NOT: skip firebase config setting
if [ "$(stat -f '%c' ./src/keys/firebase/config.js)" = "$(stat -f '%c' ./src/keys/firebase/env.txt 2>/dev/null)" ]; then
  if [ "$(cat ./src/keys/firebase/env.txt 2>/dev/null)" = $clientEnv ]; then
    echo 'no changes to firebase config';
    exit;
  fi
fi

firebase apps:sdkconfig 2>/dev/null | sed -e 's/});/};/' -e 's/firebase.initializeApp({/export default {/' > ./src/keys/firebase/config.js
echo $clientEnv > ./src/keys/firebase/env.txt