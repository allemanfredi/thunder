import Duplex from "@thunder/lib/duplex";
import EventChannel from "@thunder/lib/EventChannel";
import extensionizer from "extensionizer";

const contentScript = {
  eventChannel: new EventChannel("contentScript"),
  duplex: new Duplex.Tab(),

  init() {
    this.registerListeners();
    this.inject();
  },

  registerListeners() {
    this.eventChannel.on("tunnel", async data => {
      try {
        this.eventChannel.send(
          "tabReply",
          await this.duplex.send("tabRequest", data)
        );
      } catch (ex) {
        console.log("Tab request failed:", ex);
      }
    });

    this.duplex.on("tunnel", ({ action, data }) => {
      this.eventChannel.send(action, data);
    });
  },

  inject() {
    const injectionSite = document.head || document.documentElement;
    const container = document.createElement("script");

    container.src = extensionizer.extension.getURL("dist/inpage.js");
    container.onload = function() {
      this.parentNode.removeChild(this);
    };

    injectionSite.insertBefore(container, injectionSite.children[0]);
  }
};

contentScript.init();
