import { WD2Manager } from "../wd2-manager";
import { SeleniumAction, SeleniumNode, SeleniumNodeDef } from "./node";
import { GenericSeleniumConstructor } from "./node-constructor";
let utils = require('util');

// tslint:disable-next-line: no-empty-interface
export interface NodeSetValueDef extends SeleniumNodeDef {
    value: string;
}

// tslint:disable-next-line: no-empty-interface
export interface NodeSetValue extends SeleniumNode {

}

async function inputAction(node: NodeSetValue, conf: NodeSetValueDef, action: SeleniumAction): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
        const msg = action.msg;
        let value = msg.value ?? conf.value;
        try {
            if (conf.selector === "boundaryBox" && value === "msg.value") {
                conf.target = Object(msg.payload)["selector"];;
                let coordonates = conf.target.split(",");
                let result = WD2Manager.midpoint(Number.parseInt(coordonates[0]), Number.parseInt(coordonates[1]), Number.parseInt(coordonates[2]), Number.parseInt(coordonates[3]));
                let script = `document.elementFromPoint(${result[0]},${result[1]}).click()`;
                await msg.driver.executeScript(script, msg.element);
                value = Object(msg.payload)["msg"];
                let fillScript = `document.elementFromPoint(${result[0]},${result[1]}).value = '${value}'`;
                await msg.driver.executeScript(fillScript, msg.element);
            }
            else {
                await msg.driver.executeScript("arguments[0].setAttribute('value', '" + value + "')", msg.element);
            }
            node.status({ fill: "green", shape: "dot", text: "success" })
            if (msg.error) { delete msg.error; }
            action.send([msg, null]);
            action.done();
        } catch (err) {
            if (WD2Manager.checkIfCritical(err)) {
                reject(err);
            } else {
                msg.error = {
                    message: "Can't set value on the the element : " + err.message
                };
                node.warn(msg.error.message);
                node.status({ fill: "yellow", shape: "dot", text: "expected value error" })
                action.send([null, msg]);
                action.done();
            }
        }
        resolve();
    });
}

const NodeSetValueConstructor = GenericSeleniumConstructor(null, inputAction);

export { NodeSetValueConstructor as NodeSetValueConstructor }