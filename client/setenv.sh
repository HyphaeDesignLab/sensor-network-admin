clientEnv='';
if [ "$1" = 'prod' ]; then
  clientEnv='prod';
else
  clientEnv='dev';
fi;
cp "./src/keys/client.$clientEnv.js" "./src/keys/client.js"
firebase apps:sdkconfig 2>/dev/null | sed -e 's/});/};/' -e 's/firebase.initializeApp({/export default {/' > ./src/keys/firebase-config.js