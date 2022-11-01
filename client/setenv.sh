clientEnv="$1";
read -p 'Hard-reset env? (y)es or else leave blank to skip: ' isHardReset
if [ "_$isHardReset" = "_y" ]; then
  echo > ./src/keys/firebase/env.txt
fi;

# Check if last mod date is different
#  AND if env has changed
#  IF NOT: skip firebase config setting
if [ "$(stat -f '%c' ./src/keys/firebase/config.js)" = "$(stat -f '%c' ./src/keys/firebase/env.txt 2>/dev/null)" ]; then
  if [ "$(cat ./src/keys/firebase/env.txt 2>/dev/null)" = $clientEnv ]; then
    echo 'no changes to firebase config';
    exit;
  fi
fi


echo $clientEnv > ./src/keys/firebase/env.txt

envFile='.env'
if [ "$clientEnv" = 'dev' ]; then
  envFile='.env.local'
fi;

functionsUrl=$(grep FUNCTIONS_URL < ../functions/$envFile | sed -e 's/FUNCTIONS_URL=//')

echo > ./src/keys/firebase/config.js;
echo 'export default {' >> ./src/keys/firebase/config.js
firebase apps:sdkconfig 2>/dev/null | \
  sed -E -e '/^\s*\/\/.+/d' \
         -e '/^.*{\s*$/d' \
         -e '/^.*});\s*$/d' >> ./src/keys/firebase/config.js
echo ',' >> ./src/keys/firebase/config.js
echo "\"functionsUrl\":\"$functionsUrl\"" >> ./src/keys/firebase/config.js
echo '}' >> ./src/keys/firebase/config.js