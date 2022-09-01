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
preferences::IntervalSyncer *preferences_intervalsyncer;
gpio::GPIOBinarySensor *gpio_gpiobinarysensor;
binary_sensor::DelayedOffFilter *binary_sensor_delayedofffilter;
esp32::ArduinoInternalGPIOPin *esp32_arduinointernalgpiopin;
gpio::GPIOBinarySensor *gpio_gpiobinarysensor_2;
binary_sensor::DelayedOffFilter *binary_sensor_delayedofffilter_2;
esp32::ArduinoInternalGPIOPin *esp32_arduinointernalgpiopin_2;
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
  //   name: esp-bed-sensor
  //   build_path: .esphome/build/esp-bed-sensor
  //   platformio_options: {}
  //   includes: []
  //   libraries: []
  //   name_add_mac_suffix: false
  App.pre_setup("esp-bed-sensor", __DATE__ ", " __TIME__, false);
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
  //   manual_ip:
  //     static_ip: 192.168.1.115
  //     gateway: 192.168.1.254
  //     subnet: 255.255.255.0
  //     dns1: 0.0.0.0
  //     dns2: 0.0.0.0
  //   ap:
  //     ssid: Esphome-Web-F849Ac
  //     password: 5jk1QYzLXM0y
  //     id: wifi_wifiap
  //     ap_timeout: 1min
  //   id: wifi_wificomponent
  //   domain: .local
  //   reboot_timeout: 15min
  //   power_save_mode: LIGHT
  //   fast_connect: false
  //   networks:
  //   - ssid: !secret 'wifi_ssid'
  //     password: !secret 'wifi_password'
  //     id: wifi_wifiap_2
  //     priority: 0.0
  //   use_address: 192.168.1.115
  wifi_wificomponent = new wifi::WiFiComponent();
  wifi_wificomponent->set_use_address("192.168.1.115");
  wifi::WiFiAP wifi_wifiap_2 = wifi::WiFiAP();
  wifi_wifiap_2.set_ssid("ALHN-72F7");
  wifi_wifiap_2.set_password("Jobby00!");
  wifi_wifiap_2.set_manual_ip(wifi::ManualIP{
      .static_ip = network::IPAddress(192, 168, 1, 115),
      .gateway = network::IPAddress(192, 168, 1, 254),
      .subnet = network::IPAddress(255, 255, 255, 0),
      .dns1 = network::IPAddress(0, 0, 0, 0),
      .dns2 = network::IPAddress(0, 0, 0, 0),
  });
  wifi_wifiap_2.set_priority(0.0f);
  wifi_wificomponent->add_sta(wifi_wifiap_2);
  wifi::WiFiAP wifi_wifiap = wifi::WiFiAP();
  wifi_wifiap.set_ssid("Esphome-Web-F849Ac");
  wifi_wifiap.set_password("5jk1QYzLXM0y");
  wifi_wifiap.set_manual_ip(wifi::ManualIP{
      .static_ip = network::IPAddress(192, 168, 1, 115),
      .gateway = network::IPAddress(192, 168, 1, 254),
      .subnet = network::IPAddress(255, 255, 255, 0),
      .dns1 = network::IPAddress(0, 0, 0, 0),
      .dns2 = network::IPAddress(0, 0, 0, 0),
  });
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
  //   password: NMZztEaFnj6Ia0XFZzstFPDW5Qdq1MqenPevnSLMpIY=
  //   id: ota_otacomponent
  //   safe_mode: true
  //   port: 3232
  //   reboot_timeout: 5min
  //   num_attempts: 10
  ota_otacomponent = new ota::OTAComponent();
  ota_otacomponent->set_port(3232);
  ota_otacomponent->set_auth_password("NMZztEaFnj6Ia0XFZzstFPDW5Qdq1MqenPevnSLMpIY=");
  ota_otacomponent->set_component_source("ota");
  App.register_component(ota_otacomponent);
  if (ota_otacomponent->should_enter_safe_mode(10, 300000)) return;
  // api:
  //   password: NMZztEaFnj6Ia0XFZzstFPDW5Qdq1MqenPevnSLMpIY=
  //   id: api_apiserver
  //   port: 6053
  //   reboot_timeout: 15min
  api_apiserver = new api::APIServer();
  api_apiserver->set_component_source("api");
  App.register_component(api_apiserver);
  api_apiserver->set_port(6053);
  api_apiserver->set_password("NMZztEaFnj6Ia0XFZzstFPDW5Qdq1MqenPevnSLMpIY=");
  api_apiserver->set_reboot_timeout(900000);
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
  // binary_sensor.gpio:
  //   platform: gpio
  //   pin:
  //     number: 23
  //     inverted: true
  //     mode:
  //       input: true
  //       pullup: true
  //       output: false
  //       open_drain: false
  //       pulldown: false
  //     id: esp32_arduinointernalgpiopin
  //   name: Bed Sensor Leah
  //   filters:
  //   - delayed_off: 20s
  //     type_id: binary_sensor_delayedofffilter
  //   disabled_by_default: false
  //   id: gpio_gpiobinarysensor
  gpio_gpiobinarysensor = new gpio::GPIOBinarySensor();
  App.register_binary_sensor(gpio_gpiobinarysensor);
  gpio_gpiobinarysensor->set_name("Bed Sensor Leah");
  gpio_gpiobinarysensor->set_disabled_by_default(false);
  binary_sensor_delayedofffilter = new binary_sensor::DelayedOffFilter(20000);
  binary_sensor_delayedofffilter->set_component_source("binary_sensor");
  App.register_component(binary_sensor_delayedofffilter);
  gpio_gpiobinarysensor->add_filters({binary_sensor_delayedofffilter});
  gpio_gpiobinarysensor->set_component_source("gpio.binary_sensor");
  App.register_component(gpio_gpiobinarysensor);
  esp32_arduinointernalgpiopin = new esp32::ArduinoInternalGPIOPin();
  esp32_arduinointernalgpiopin->set_pin(23);
  esp32_arduinointernalgpiopin->set_inverted(true);
  esp32_arduinointernalgpiopin->set_flags((gpio::Flags::FLAG_INPUT | gpio::Flags::FLAG_PULLUP));
  gpio_gpiobinarysensor->set_pin(esp32_arduinointernalgpiopin);
  // binary_sensor.gpio:
  //   platform: gpio
  //   pin:
  //     number: 21
  //     inverted: true
  //     mode:
  //       input: true
  //       pullup: true
  //       output: false
  //       open_drain: false
  //       pulldown: false
  //     id: esp32_arduinointernalgpiopin_2
  //   name: Bed Sensor Sam
  //   filters:
  //   - delayed_off: 20s
  //     type_id: binary_sensor_delayedofffilter_2
  //   disabled_by_default: false
  //   id: gpio_gpiobinarysensor_2
  gpio_gpiobinarysensor_2 = new gpio::GPIOBinarySensor();
  App.register_binary_sensor(gpio_gpiobinarysensor_2);
  gpio_gpiobinarysensor_2->set_name("Bed Sensor Sam");
  gpio_gpiobinarysensor_2->set_disabled_by_default(false);
  binary_sensor_delayedofffilter_2 = new binary_sensor::DelayedOffFilter(20000);
  binary_sensor_delayedofffilter_2->set_component_source("binary_sensor");
  App.register_component(binary_sensor_delayedofffilter_2);
  gpio_gpiobinarysensor_2->add_filters({binary_sensor_delayedofffilter_2});
  gpio_gpiobinarysensor_2->set_component_source("gpio.binary_sensor");
  App.register_component(gpio_gpiobinarysensor_2);
  esp32_arduinointernalgpiopin_2 = new esp32::ArduinoInternalGPIOPin();
  esp32_arduinointernalgpiopin_2->set_pin(21);
  esp32_arduinointernalgpiopin_2->set_inverted(true);
  esp32_arduinointernalgpiopin_2->set_flags((gpio::Flags::FLAG_INPUT | gpio::Flags::FLAG_PULLUP));
  gpio_gpiobinarysensor_2->set_pin(esp32_arduinointernalgpiopin_2);
  // socket:
  //   implementation: bsd_sockets
  // network:
  //   {}
  // =========== AUTO GENERATED CODE END ============
  App.setup();
}

void loop() {
  App.loop();
}
