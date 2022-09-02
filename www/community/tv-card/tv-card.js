const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
import {
mdiPower,
mdiPowerOn,
mdiPowerOff,
mdiArrowLeft,
mdiVideoInputHdmi,
mdiHome,
mdiArrowUp,
mdiTelevisionGuide,
mdiArrowDown,
mdiChevronUp,
mdiChevronLeft,
mdiCheckboxBlankCircle,
mdiChevronRight,
mdiChevronDown,
mdiRewind,
mdiPlayPause,
mdiFastForward,
mdiVolumeMute,
mdiVolumeMinus,
mdiVolumePlus,
mdiNetflix,
mdiYoutube,
} from "https://unpkg.com/@mdi/js@6.4.95/mdi.js?module"

// Taken from mdi v5.9.55
const AMAZON_ICON_PATH = "M15.93,17.09C15.75,17.25 15.5,17.26 15.3,17.15C14.41,16.41 14.25,16.07 13.76,15.36C12.29,16.86 11.25,17.31 9.34,17.31C7.09,17.31 5.33,15.92 5.33,13.14C5.33,10.96 6.5,9.5 8.19,8.76C9.65,8.12 11.68,8 13.23,7.83V7.5C13.23,6.84 13.28,6.09 12.9,5.54C12.58,5.05 11.95,4.84 11.4,4.84C10.38,4.84 9.47,5.37 9.25,6.45C9.2,6.69 9,6.93 8.78,6.94L6.18,6.66C5.96,6.61 5.72,6.44 5.78,6.1C6.38,2.95 9.23,2 11.78,2C13.08,2 14.78,2.35 15.81,3.33C17.11,4.55 17,6.18 17,7.95V12.12C17,13.37 17.5,13.93 18,14.6C18.17,14.85 18.21,15.14 18,15.31L15.94,17.09H15.93M13.23,10.56V10C11.29,10 9.24,10.39 9.24,12.67C9.24,13.83 9.85,14.62 10.87,14.62C11.63,14.62 12.3,14.15 12.73,13.4C13.25,12.47 13.23,11.6 13.23,10.56M20.16,19.54C18,21.14 14.82,22 12.1,22C8.29,22 4.85,20.59 2.25,18.24C2.05,18.06 2.23,17.81 2.5,17.95C5.28,19.58 8.75,20.56 12.33,20.56C14.74,20.56 17.4,20.06 19.84,19.03C20.21,18.87 20.5,19.27 20.16,19.54M21.07,18.5C20.79,18.14 19.22,18.33 18.5,18.42C18.31,18.44 18.28,18.26 18.47,18.12C19.71,17.24 21.76,17.5 22,17.79C22.24,18.09 21.93,20.14 20.76,21.11C20.58,21.27 20.41,21.18 20.5,21C20.76,20.33 21.35,18.86 21.07,18.5Z";

class TVCardServices extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _apps: {}
    };
  }

  //  static async getConfigElement() {
  //    await import("./tv-card-editor.js");
  //    return document.createElement("tv-card-editor");
  //  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 7;
  }

  setConfig(config) {
    if (!config.entity) {
      console.log("Invalid configuration");
      return;
    }

    this._config = { theme: "default", ...config };
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];

    const emptyButton = html`
      <ha-icon-button
        .action="${""}"
        @click="${this.handleActionClick}"
        icon=""
        title=""
      ></ha-icon-button>
    `;

    return html`
      ${this.renderStyle()}
      <ha-card .header="${this._config.name}">
          <div class="row">

          </div>
          ${
            this._config.tv && this._config.power
              ? html`
                  <div class="row">
                    <ha-icon-button
                      .action="${"power"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:power"
                      .path=${mdiPower}
                      title="Power"
                    ></ha-icon-button>
                  </div>
                `
              : ""
          }

          ${
            this._config.tv && !(this._config.power) && (this._config.power_on || this._config.power_off)
              ? html`
                  <div class="row">
                    <ha-icon-button
                      .action="${"power_on"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:power-on"
                      .path=${mdiPowerOn}
                      title="Power on"
                    ></ha-icon-button>
                    ${emptyButton}
                    <ha-icon-button
                      .action="${"power_off"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:power-off"
                      .path=${mdiPowerOff}
                      title="Power off"
                    ></ha-icon-button>
                  </div>
                `
              : ""
          }

          ${
            this._config.back || this._config.source || this._config.home
              ? html`
                  <div class="row">
                    ${this._config.back
                      ? html`
                          <ha-icon-button
                            .action="${"back"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:arrow-left"
                            .path=${mdiArrowLeft}
                            title="Back"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                    ${this._config.source
                      ? html`
                          <ha-icon-button
                            .action="${"source"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:video-input-hdmi"
                            .path=${mdiVideoInputHdmi}
                            title="Source"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                    ${this._config.home
                      ? html`
                          <ha-icon-button
                            .action="${"home"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:home"
                            .path=${mdiHome}
                            title="Home"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                  </div>
                `
              : ""
          }

          ${
            this._config.channelup ||
            this._config.info ||
            this._config.channeldown
              ? html`
                  <div class="row">
                    ${this._config.channelup
                      ? html`
                          <ha-icon-button
                            .action="${"channelup"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:arrow-up"
                            .path=${mdiArrowUp}
                            title="Channelup"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                    ${this._config.info
                      ? html`
                          <ha-icon-button
                            .action="${"info"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:television-guide"
                            .path=${mdiTelevisionGuide}
                            title="Guide"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                    ${this._config.channeldown
                      ? html`
                          <ha-icon-button
                            .action="${"channeldown"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:arrow-down"
                            .path=${mdiArrowDown}
                            title="Channeldown"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                  </div>
                `
              : ""
          }

          <div class="row">
            <ha-icon-button
              .action="${"up"}"
              @click="${this.handleActionClick}"
              icon="mdi:chevron-up"
              .path=${mdiChevronUp}
              title="Up"
            ></ha-icon-button>
          </div>

          <div class="row">
            <ha-icon-button
              .action="${"left"}"
              @click="${this.handleActionClick}"
              icon="mdi:chevron-left"
              .path=${mdiChevronLeft}
              title="Left"
            ></ha-icon-button>
            <ha-icon-button
              .action="${"select"}"
              @click="${this.handleActionClick}"
              icon="mdi:checkbox-blank-circle"
              .path=${mdiCheckboxBlankCircle}
              title="Select"
            ></ha-icon-button>
            <ha-icon-button
              .action="${"right"}"
              @click="${this.handleActionClick}"
              icon="mdi:chevron-right"
              .path=${mdiChevronRight}
              title="Right"
            ></ha-icon-button>
          </div>

          <div class="row">
            <ha-icon-button
              .action="${"down"}"
              @click="${this.handleActionClick}"
              icon="mdi:chevron-down"
              .path=${mdiChevronDown}
              title="Down"
            ></ha-icon-button>
          </div>

          ${
            this._config.reverse || this._config.play || this._config.forward
              ? html`
                  <div class="row">
                    ${this._config.reverse
                      ? html`
                          <ha-icon-button
                            .action="${"reverse"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:rewind"
                            .path=${mdiRewind}
                            title="Rewind"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                    ${this._config.play
                      ? html`
                          <ha-icon-button
                            .action="${"play"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:play-pause"
                            .path=${mdiPlayPause}
                            title="Play/Pause"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                    ${this._config.forward
                      ? html`
                          <ha-icon-button
                            .action="${"forward"}"
                            @click="${this.handleActionClick}"
                            icon="mdi:fast-forward"
                            .path=${mdiFastForward}
                            title="Fast-Forward"
                          ></ha-icon-button>
                        `
                      : emptyButton}
                  </div>
                `
              : ""
          }

          ${
            this._config.tv && (
            this._config.volume_up ||
            this._config.volume_down ||
            this._config.volume_mute )
              ? html`
                  <div class="row">
                    <ha-icon-button
                      .action="${"volume_mute"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:volume-mute"
                      .path=${mdiVolumeMute}
                      title="Volume Mute"
                    ></ha-icon-button>
                    <ha-icon-button
                      .action="${"volume_down"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:volume-minus"
                      .path=${mdiVolumeMinus}
                      title="Volume Down"
                    ></ha-icon-button>
                    <ha-icon-button
                      .action="${"volume_up"}"
                      @click="${this.handleActionClick}"
                      icon="mdi:volume-plus"
                      .path=${mdiVolumePlus}
                      title="Volume Up"
                    ></ha-icon-button>
                  </div>
                `
              : ""
          }

          ${
            this._config.netflix ||
            this._config.prime_video ||
            this._config.youtube
              ? html`
                  <div class="row">
                    ${this._config.netflix ?
                      html`
                        <ha-icon-button
                          .action="${"netflix"}"
                          @click="${this.handleActionClick}"
                          icon="mdi:netflix"
                          .path=${mdiNetflix}
                          title="Netflix"
                        ></ha-icon-button>
                      `
                    : emptyButton}
                    ${this._config.prime_video ?
                      html`
                        <ha-icon-button
                          .action="${"prime_video"}"
                          @click="${this.handleActionClick}"
                          icon="mdi:amazon"
                          .path=${AMAZON_ICON_PATH}
                          title="Prime Video"
                        ></ha-icon-button>
                      `
                    : emptyButton}
                    ${this._config.youtube ?
                      html`
                        <ha-icon-button
                          .action="${"youtube"}"
                          @click="${this.handleActionClick}"
                          icon="mdi:youtube"
                          .path=${mdiYoutube}
                          title="Youtube"
                        ></ha-icon-button>
                      `
                    : emptyButton}
                  </div>
                `
              : ""
          }
        </div>
      </ha-card>
    `;
  }

  updated(changedProps) {
    if (!this._config) {
      return;
    }

    const oldHass = changedProps.get("hass");
    if (!oldHass || oldHass.themes !== this.hass.themes) {
      this.applyThemesOnElement(this, this.hass.themes, this._config.theme);
    }
  }

  renderStyle() {
    return html`
      <style>
        .remote {
          padding: 16px 0px 16px 0px;
        }
        img,
        ha-icon-button {
          width: 64px;
          height: 64px;
          cursor: pointer;
          --mdc-icon-size: 100%;
        }
        .row {
          display: flex;
          padding: 8px 36px 8px 36px;
          justify-content: space-evenly;
        }
        .diagonal {
          background-color: var(--light-primary-color);
        }
      </style>
    `;
  }

  launchApp(e) {
    this.hass.callService("media_player", "select_source", {
      entity_id: this._config.entity,
      source: e.currentTarget.value
    });
  }

  handleActionClick(e) {
    const custom_services = [
      "power",
      "power_on",
      "power_off",
      "volume_up",
      "volume_down",
      "volume_mute",
      "back",
      "source",
      "info",
      "home",
      "channelup",
      "channeldown",
      "up",
      "left",
      "select",
      "right",
      "down",
      "reverse",
      "play",
      "forward",
      "netflix",
      "prime_video",
      "youtube"
    ];

    if (
      custom_services.indexOf(e.currentTarget.action) >= 0 &&
      this._config[e.currentTarget.action]
    ) {
      const [domain, service] = this._config[
        e.currentTarget.action
      ].service.split(".", 2);
      this.hass.callService(
        domain,
        service,
        this._config[e.currentTarget.action].service_data
          ? this._config[e.currentTarget.action].service_data
          : null
      );
    } else {
      const [domain, service] = this._config[
        e.currentTarget.action
      ].service.split(".", 2);
      this.hass.callService(
        domain,
        service,
        this._config[e.currentTarget.action].service_data
          ? this._config[e.currentTarget.action].service_data
          : null
      );
    }
  }

  applyThemesOnElement(element, themes, localTheme) {
    if (!element._themes) {
      element._themes = {};
    }
    let themeName = themes.default_theme;
    if (localTheme === "default" || (localTheme && themes.themes[localTheme])) {
      themeName = localTheme;
    }
    const styles = Object.assign({}, element._themes);
    if (themeName !== "default") {
      var theme = themes.themes[themeName];
      Object.keys(theme).forEach(key => {
        var prefixedKey = "--" + key;
        element._themes[prefixedKey] = "";
        styles[prefixedKey] = theme[key];
      });
    }
    if (element.updateStyles) {
      element.updateStyles(styles);
    } else if (window.ShadyCSS) {
      // implement updateStyles() method of Polemer elements
      window.ShadyCSS.styleSubtree(
        /** @type {!HTMLElement} */ (element),
        styles
      );
    }

    const meta = document.querySelector("meta[name=theme-color]");
    if (meta) {
      if (!meta.hasAttribute("default-content")) {
        meta.setAttribute("default-content", meta.getAttribute("content"));
      }
      const themeColor =
        styles["--primary-color"] || meta.getAttribute("default-content");
      meta.setAttribute("content", themeColor);
    }
  }
}

customElements.define("tv-card", TVCardServices);
