aws iotwireless create-wireless-device \
  --type LoRaWAN \
  --name "" \
  --destination-name blah_test \
  --lorawan '{"DeviceProfileId": "bd2f3e79-bbea-47a0-9697-c9414b2d6394","ServiceProfileId": "349d0631-1d39-4438-8487-a43b3919d80c","OtaaV1_0_x": {"AppKey": "62A731A934AEDF9B8F3CFBAE5E1AD866","AppEui": "A840410000000101"},"DevEui": "A84041AFD184C239"}'