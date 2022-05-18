import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode, SeleniumNodeDef } from "./node";

// tslint:disable-next-line: no-empty-interface
export interface NodeCloseWebDef extends SeleniumNodeDef {

}

// tslint:disable-next-line: no-empty-interface
export interface NodeCloseWeb extends SeleniumNode {
}


export function NodeCloseWebConstructor (this : NodeCloseWeb, conf : NodeCloseWebDef) {
    WD2Manager.RED.nodes.createNode(this, conf);
    this.status({});

    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        const msg : SeleniumMsg = message;

        if (null === msg.driver) {
            const error = new Error("Can't use this node without a working open-web node first");
            this.status({ fill : "red", shape : "ring", text : "error"});
            done(error);
        } else {
            const waitFor : number = parseInt(msg.waitFor ?? conf.waitFor,10);
            this.status({ fill : "blue", shape : "ring", text : "waiting for " + (waitFor / 1000).toFixed(1) + " s"});
            setTimeout(async () => {
                try {
                    this.status({ fill : "blue", shape : "ring", text : "closing"});
                    await msg.driver.quit();
                    msg.driver = null;
                    WD2Manager.clearDriverList();
                    this.status({ fill : "green", shape : "dot", text : "closed"});
                    send(msg);
                    done();
                } catch (e) {
                    this.warn("Can't close the browser, check msg.error for more information");
                    msg.driver = null;
                    msg.error = e;
                    this.status({ fill : "red", shape : "dot", text : "critical error"});
                    done(e);
                }
            }, waitFor);
        }
    });
}