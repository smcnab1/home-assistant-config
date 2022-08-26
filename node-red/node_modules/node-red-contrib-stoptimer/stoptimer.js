/**
 * Copyright jbardi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
	"use strict";
	function StopTimer(n) {
		RED.nodes.createNode(this,n);

		this.units = n.units || "Second";
		this.duration = n.duration || 5;
		this.payloadval = n.payloadval || "0";
    this.payloadtype = n.payloadtype || "num";

		if (this.duration <= 0) { this.duration = 0; }
		else {
			if (this.units == "Second") { this.duration = this.duration * 1000; }
			if (this.units == "Minute") { this.duration = this.duration * 1000 * 60; }
			if (this.units == "Hour") { this.duration = this.duration * 1000 * 60 * 60; }
		}

		if ((this.payloadtype === "num") && (!isNaN(this.payloadval))) {
			this.payloadval = Number(this.payloadval);
    }
    else if (this.payloadval === 'true' || this.payloadval === 'false') {
			this.payloadval = Boolean(this.payloadval);
    }
    else if (this.payloadval == "null") {
  		this.payloadtype = 'null';
  		this.payloadval = null;
    }
    else {
    	this.payloadval = String(this.payloadval);
    }

		var node = this;
		var timeout = null;
		var stopped = false;
		this.on("input", function(msg) {
			node.status({});
			if(stopped === false || msg._timerpass !== true) {
				stopped = false;
				clearTimeout(timeout);
        timeout = null;
				if (msg.payload == "stop" || msg.payload == "STOP") {
					node.status({fill:"red",shape:"ring",text:"stopped"});
					stopped = true;
					var msg2 = RED.util.cloneMessage(msg);
					msg2.payload = "stopped";
					node.send([null, msg2]);
				}else{
					msg._timerpass = true;
					node.status({fill:"green",shape:"dot",text:"running"});
					timeout = setTimeout(function() {
						node.status({});
						if(stopped === false) {
							var msg2 = RED.util.cloneMessage(msg);
              msg2.payload = node.payloadval;
							node.send([msg, msg2]);
						}
						timeout = null;
					},node.duration);
				}
			}
		});
		this.on("close", function() {
			if (timeout) {
				clearTimeout(timeout);
			}
			node.status({});
		});
	}
	RED.nodes.registerType("stoptimer",StopTimer);
}
