// Auto generated code by esphome
// ========== AUTO GENERATED INCLUDE BLOCK BEGIN ===========
#include "esphome.h"
using namespace esphome;
using std::isnan;
using std::min;
using std::max;
using namespace binary_sensor;
logger::Logger *logger_logger;
web_server_base::WebServerBase *web_server_base_webserverbase;
captive_portal::CaptivePortal *captive_portal_captiveportal;
wifi::WiFiComponent *wifi_wificomponent;
mdns::MDNSComponent *mdns_mdnscomponent;
ota::OTAComponent *ota_otacomponent;
api::APIServer *api_apiserver;
using namespace api;
web_server::WebServer *web_server_webserver;
using namespace json;
preferences::IntervalSyncer *preferences_intervalsyncer;
improv_serial::ImprovSerialComponent *improv_serial_improvserialcomponent;
esp32_improv::ESP32ImprovComponent *esp32_improv_esp32improvcomponent;
using namespace output;
esp32_ble::ESP32BLE *esp32_ble_esp32ble;
esp32_ble_server::BLEServer *esp32_ble_server_bleserver;
#define yield() esphome::yield()
#define millis() esphome::millis()
#define micros() esphome::micros()
#define delay(x) esphome::delay(x)
#define delayMicroseconds(x) esphome::delayMicroseconds(x)
// ========== AUTO GENERATED INCLUDE BLOCK END ==========="

void setup() {
  // ========== AUTO GENERATED CODE BEGIN ===========
  // async_tcp:
  //   {}
  // esphome:
  //   name: bed-sensor
  //   name_add_mac_suffix: false
  //   project:
  //     name: esphome.esp_web_tools_example
  //     version: '1.0'
  //   build_path: .esphome/build/bed-sensor
  //   platformio_options: {}
  //   includes: []
  //   libraries: []
  App.pre_setup("bed-sensor", __DATE__ ", " __TIME__, false);
  // binary_sensor:
  // logger:
  //   id: logger_logger
  //   baud_rate: 115200
  //   tx_buffer_size: 512
  //   deassert_rts_dtr: false
  //   hardware_uart: UART0
  //   level: DEBUG
  //   logs: {}
  logger_logger = new logger::Logger(115200, 512, logger::UART_SELECTION_UART0);
  logger_logger->pre_setup();
  logger_logger->set_component_source("logger");
  App.register_component(logger_logger);
  // web_server_base:
  //   id: web_server_base_webserverbase
  web_server_base_webserverbase = new web_server_base::WebServerBase();
  web_server_base_webserverbase->set_component_source("web_server_base");
  App.register_component(web_server_base_webserverbase);
  // captive_portal:
  //   id: captive_portal_captiveportal
  //   web_server_base_id: web_server_base_webserverbase
  captive_portal_captiveportal = new captive_portal::CaptivePortal(web_server_base_webserverbase);
  captive_portal_captiveportal->set_component_source("captive_portal");
  App.register_component(captive_portal_captiveportal);
  // wifi:
  //   ap:
  //     ssid: ESP Web Tools
  //     id: wifi_wifiap
  //     ap_timeout: 1min
  //   id: wifi_wificomponent
  //   domain: .local
  //   reboot_timeout: 15min
  //   power_save_mode: LIGHT
  //   fast_connect: false
  //   networks:
  //   - ssid: ALHN-72F7
  //     password: Jobby00!
  //     id: wifi_wifiap_2
  //     priority: 0.0
  //   use_address: bed-sensor.local
  wifi_wificomponent = new wifi::WiFiComponent();
  wifi_wificomponent->set_use_address("bed-sensor.local");
  wifi::WiFiAP wifi_wifiap_2 = wifi::WiFiAP();
  wifi_wifiap_2.set_ssid("ALHN-72F7");
  wifi_wifiap_2.set_password("Jobby00!");
  wifi_wifiap_2.set_priority(0.0f);
  wifi_wificomponent->add_sta(wifi_wifiap_2);
  wifi::WiFiAP wifi_wifiap = wifi::WiFiAP();
  wifi_wifiap.set_ssid("ESP Web Tools");
  wifi_wificomponent->set_ap(wifi_wifiap);
  wifi_wificomponent->set_ap_timeout(60000);
  wifi_wificomponent->set_reboot_timeout(900000);
  wifi_wificomponent->set_power_save_mode(wifi::WIFI_POWER_SAVE_LIGHT);
  wifi_wificomponent->set_fast_connect(false);
  wifi_wificomponent->set_component_source("wifi");
  App.register_component(wifi_wificomponent);
  // mdns:
  //   id: mdns_mdnscomponent
  //   disabled: false
  mdns_mdnscomponent = new mdns::MDNSComponent();
  mdns_mdnscomponent->set_component_source("mdns");
  App.register_component(mdns_mdnscomponent);
  // ota:
  //   id: ota_otacomponent
  //   safe_mode: true
  //   port: 3232
  //   reboot_timeout: 5min
  //   num_attempts: 10
  ota_otacomponent = new ota::OTAComponent();
  ota_otacomponent->set_port(3232);
  ota_otacomponent->set_component_source("ota");
  App.register_component(ota_otacomponent);
  if (ota_otacomponent->should_enter_safe_mode(10, 300000)) return;
  // api:
  //   id: api_apiserver
  //   port: 6053
  //   password: ''
  //   reboot_timeout: 15min
  api_apiserver = new api::APIServer();
  api_apiserver->set_component_source("api");
  App.register_component(api_apiserver);
  api_apiserver->set_port(6053);
  api_apiserver->set_password("");
  api_apiserver->set_reboot_timeout(900000);
  // web_server:
  //   id: web_server_webserver
  //   port: 80
  //   version: 2
  //   web_server_base_id: web_server_base_webserverbase
  //   include_internal: false
  //   ota: true
  //   css_url: ''
  //   js_url: https:oi.esphome.io/v2/www.js
  web_server_webserver = new web_server::WebServer(web_server_base_webserverbase);
  web_server_webserver->set_component_source("web_server");
  App.register_component(web_server_webserver);
  web_server_base_webserverbase->set_port(80);
  web_server_webserver->set_css_url("");
  web_server_webserver->set_js_url("https://oi.esphome.io/v2/www.js");
  web_server_webserver->set_allow_ota(true);
  web_server_webserver->set_include_internal(false);
  // json:
  //   {}
  // substitutions:
  //   name: bed-sensor
  // esp32:
  //   board: esp32dev
  //   framework:
  //     version: 1.0.6
  //     source: ~3.10006.0
  //     platform_version: platformio/espressif32 @ 3.5.0
  //     type: arduino
  //   variant: ESP32
  // preferences:
  //   id: preferences_intervalsyncer
  //   flash_write_interval: 60s
  preferences_intervalsyncer = new preferences::IntervalSyncer();
  preferences_intervalsyncer->set_write_interval(60000);
  preferences_intervalsyncer->set_component_source("preferences");
  App.register_component(preferences_intervalsyncer);
  // improv_serial:
  //   id: improv_serial_improvserialcomponent
  improv_serial_improvserialcomponent = new improv_serial::ImprovSerialComponent();
  improv_serial_improvserialcomponent->set_component_source("improv_serial");
  App.register_component(improv_serial_improvserialcomponent);
  // dashboard_import:
  //   package_import_url: github:esphome/example-configs/esp-web-tools/esp32.yaml@v1
  dashboard_import::set_package_import_url("github://esphome/example-configs/esp-web-tools/esp32.yaml@v1");
  // esp32_improv:
  //   authorizer: null
  //   id: esp32_improv_esp32improvcomponent
  //   ble_server_id: esp32_ble_server_bleserver
  //   identify_duration: 10s
  //   authorized_duration: 1min
  esp32_improv_esp32improvcomponent = new esp32_improv::ESP32ImprovComponent();
  esp32_improv_esp32improvcomponent->set_component_source("esp32_improv");
  App.register_component(esp32_improv_esp32improvcomponent);
  // socket:
  //   implementation: bsd_sockets
  // network:
  //   {}
  // output:
  // esp32_ble_server:
  //   id: esp32_ble_server_bleserver
  //   ble_id: esp32_ble_esp32ble
  //   manufacturer: ESPHome
  // esp32_ble:
  //   id: esp32_ble_esp32ble
  esp32_ble_esp32ble = new esp32_ble::ESP32BLE();
  esp32_ble_esp32ble->set_component_source("esp32_ble");
  App.register_component(esp32_ble_esp32ble);
  esp32_ble_server_bleserver = new esp32_ble_server::BLEServer();
  esp32_ble_server_bleserver->set_component_source("esp32_ble_server");
  App.register_component(esp32_ble_server_bleserver);
  esp32_ble_server_bleserver->set_manufacturer("ESPHome");
  esp32_ble_esp32ble->set_server(esp32_ble_server_bleserver);
  esp32_ble_server_bleserver->register_service_component(esp32_improv_esp32improvcomponent);
  esp32_improv_esp32improvcomponent->set_identify_duration(10000);
  esp32_improv_esp32improvcomponent->set_authorized_duration(60000);
  // =========== AUTO GENERATED CODE END ============
  App.setup();
}

void loop() {
  App.loop();
}
