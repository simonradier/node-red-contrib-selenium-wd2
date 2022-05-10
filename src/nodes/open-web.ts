import { WD2Manager } from "../wd2-manager";
import { SeleniumMsg, SeleniumNode, SeleniumNodeDef } from "./node";

// tslint:disable-next-line: no-empty-interface
export interface NodeOpenWebDef extends SeleniumNodeDef {
    serverURL : string;
    name : string;
    browser : string;
    webURL : string;
    width : number;
    heigth : number;
    maximized : boolean;
    headless : boolean;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeOpenWeb extends SeleniumNode {

}

export function NodeOpenWebConstructor (this : NodeOpenWeb, conf : NodeOpenWebDef) {
    WD2Manager.RED.nodes.createNode(this, conf);

    if (!conf.serverURL) {
        this.log("Selenium server URL is undefined");
        this.status({ fill : "red", shape : "ring", text : "no server defined"});
    } else {
        WD2Manager.setServerConfig(conf.serverURL).then ((result) => {
            if (result) {
                this.log(conf.serverURL + " is reacheable by Node-red");
                this.status({ fill : "green", shape : "ring", text : conf.serverURL + ": reachable"});
            } else {
                this.log(conf.serverURL + " is not reachable by Node-red");
                this.status({ fill : "red", shape : "ring", text : conf.serverURL + ": unreachable"});
            }
        }).catch ((error) => {
            this.log(error);
        });
    }
    this.on("input", async (message : any, send, done) => {
        // Cheat to allow correct typing in typescript
        const msg : SeleniumMsg = message;
        const node = this;
        let driverError = false;
        msg.driver = WD2Manager.getDriver(conf);
        this.status({ fill : "blue", shape : "ring", text : "opening browser"});
        if(conf.webURL != "msg.url"){
            this.log("Config web value is " + conf.webURL);
            msg.url = conf.webURL;
        }
        else if(msg.payload !=null){
            let message = JSON.stringify(msg.payload);
            let obj = JSON.parse(message);
            this.log("From payload. Have an url. It is "+ obj.url);
            msg.url = obj.url;
        }
        try {
            await msg.driver.get(msg.url);
        } catch (e) {
            msg.driver = null;
            node.error("Can't open an instance of " + conf.browser);
            node.status({ fill : "red", shape : "ring", text : "launch error"});
            driverError = true;
            msg.driver = null;
            done(e);
        }
        try {
            if (msg.driver) {
                if (!driverError)
                    if (!conf.headless)
                        if (!conf.maximized)
                            await msg.driver.manage().window().setSize(conf.width, conf.heigth);
                        else
                            await msg.driver.manage().window().maximize();
                send(msg);
                this.status({ fill : "green", shape : "dot", text : "success"});
                msg.url = null;
                done();
            }
        } catch (e) {
            node.error("Can't resize the instance of " + conf.browser);
            node.status({ fill : "red", shape : "ring", text : "resize error"});
            driverError = true;
            done(e);
        }
    });
}